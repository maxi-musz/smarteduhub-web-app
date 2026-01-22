"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

export interface ConnectionSuccessData {
  success: true;
  message: string;
  data: {
    userId: string;
    socketId: string;
    timestamp: string;
  };
  event: "connection:success";
}

export interface ConnectionErrorData {
  success: false;
  message: string;
  error: string;
  event: "connection:error";
}

export interface MessageTypingData {
  success: true;
  message: string;
  data: {
    isTyping: boolean;
  };
  event: "message:typing";
}

export interface MessageResponseData {
  success: true;
  message: string;
  data: {
    response: string; // Markdown formatted AI response
    userId: string;
    chapterId: string; // Chapter ID (the materialId/chapterId you sent)
    chapterTitle: string; // Chapter title
    materialId: string; // Parent material ID
    materialTitle: string; // Parent material title
    language: string; // Language code used for the response
    tokensUsed: number; // Number of tokens used by OpenAI
    responseTimeMs: number; // Response time in milliseconds
    timestamp: string;
  };
  event: "message:response";
}

export interface MessageErrorData {
  success: false;
  message: string;
  error: string;
  event: "message:error";
}

export interface SendMessagePayload {
  message: string; // The message/question to send
  materialId: string; // Chapter ID (note: parameter name is materialId but it's actually chapterId)
  userId: string; // User ID (must match authenticated user)
  language?: string; // Optional: Language code (ISO 639-1, e.g., 'en', 'fr', 'es'). Defaults to 'en'
}

export type SocketConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

export interface UseExploreChatSocketReturn {
  socket: Socket | null;
  connectionStatus: SocketConnectionStatus;
  isConnected: boolean;
  error: string | null;
  isTyping: boolean;
  retryConnection: () => void;
  sendMessage: (message: string, materialId: string, userId: string, language?: string) => void; // Note: materialId is actually chapterId
  onMessageResponse: (callback: (data: MessageResponseData) => void) => (() => void);
  onMessageError: (callback: (error: MessageErrorData) => void) => (() => void);
  onTypingStatus: (callback: (isTyping: boolean) => void) => (() => void);
}

/**
 * Hook to manage socket connection for Explore Chat
 * 
 * @returns {UseExploreChatSocketReturn} Socket instance, connection status, and error state
 */
export function useExploreChatSocket(): UseExploreChatSocketReturn {
  const { data: session, status } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const retryTriggerRef = useRef(0);
  const messageResponseCallbacksRef = useRef<Set<(data: MessageResponseData) => void>>(new Set());
  const messageErrorCallbacksRef = useRef<Set<(error: MessageErrorData) => void>>(new Set());
  const typingStatusCallbacksRef = useRef<Set<(isTyping: boolean) => void>>(new Set());

  // Function to establish socket connection
  const connectSocket = () => {
    console.log("[useExploreChatSocket] ===== Starting Socket Connection =====");
    console.log("[useExploreChatSocket] Session status:", status);
    console.log("[useExploreChatSocket] Has session:", !!session);
    console.log("[useExploreChatSocket] Has access token:", !!session?.user?.accessToken);

    // Wait for session to be ready
    if (status === "loading") {
      console.log("[useExploreChatSocket] Session is loading, waiting...");
      return;
    }

    // Check if we have a valid session and token
    if (status === "unauthenticated" || !session?.user?.accessToken) {
      console.error("[useExploreChatSocket] Authentication check failed:", {
        status,
        hasSession: !!session,
        hasToken: !!session?.user?.accessToken,
      });
      setConnectionStatus("error");
      setError("Authentication required. Please login to use chat.");
      return;
    }

    const token = session.user.accessToken;
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    console.log("[useExploreChatSocket] Environment check:", {
      hasApiBaseUrl: !!apiBaseUrl,
      apiBaseUrl: apiBaseUrl ? `${apiBaseUrl.substring(0, 20)}...` : "missing",
    });

    if (!apiBaseUrl) {
      console.error("[useExploreChatSocket] Backend URL not configured");
      setConnectionStatus("error");
      setError("Backend URL not configured");
      return;
    }

    // Clean up existing socket if any
    if (socketRef.current) {
      console.log("[useExploreChatSocket] Cleaning up existing socket connection");
      socketRef.current.removeAllListeners();
      socketRef.current.close();
      socketRef.current = null;
    }

    // Initialize socket connection
    console.log("[useExploreChatSocket] Setting connection status to 'connecting'");
    setConnectionStatus("connecting");
    setError(null);

    // Construct socket URL
    // Socket.IO namespaces work like this: io('http://server/namespace')
    // This connects to the server at 'http://server' and joins namespace '/namespace'
    // We need to extract the origin (protocol + host + port) from the API base URL
    let socketUrl: string;
    try {
      const url = new URL(apiBaseUrl);
      // Use origin (protocol + host + port) and append namespace
      socketUrl = `${url.origin}/explore-chat`;
      console.log("[useExploreChatSocket] Constructed socket URL from URL object:", {
        original: apiBaseUrl,
        origin: url.origin,
        socketUrl,
      });
    } catch (e) {
      console.warn("[useExploreChatSocket] URL parsing failed, trying regex fallback:", e);
      // Fallback: if URL parsing fails, try to construct it manually
      // Remove any path from the base URL and use just the origin
      const match = apiBaseUrl.match(/^(https?:\/\/[^\/]+)/);
      if (match) {
        socketUrl = `${match[1]}/explore-chat`;
        console.log("[useExploreChatSocket] Constructed socket URL from regex:", {
          original: apiBaseUrl,
          match: match[1],
          socketUrl,
        });
      } else {
        console.error("[useExploreChatSocket] Failed to parse backend URL:", apiBaseUrl);
        setConnectionStatus("error");
        setError("Invalid backend URL format");
        return;
      }
    }

    console.log("[useExploreChatSocket] Final socket configuration:", {
      socketUrl,
      apiBaseUrl,
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });

    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      auth: {
        token: token,
      },
      // Enable reconnection
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    console.log("[useExploreChatSocket] Socket.IO instance created:", {
      id: newSocket.id,
      connected: newSocket.connected,
      disconnected: newSocket.disconnected,
    });

    socketRef.current = newSocket;

    // Connection success handler
    newSocket.on("connection:success", (data: ConnectionSuccessData) => {
      console.log("[useExploreChatSocket] ✅ Connection success event received:", {
        success: data.success,
        message: data.message,
        userId: data.data?.userId,
        socketId: data.data?.socketId,
        timestamp: data.data?.timestamp,
      });
      setConnectionStatus("connected");
      setError(null);
    });

    // Connection error handler
    newSocket.on("connection:error", (errorData: ConnectionErrorData) => {
      console.error("[useExploreChatSocket] ❌ Connection error event received:", {
        success: errorData.success,
        message: errorData.message,
        error: errorData.error,
        event: errorData.event,
      });
      setConnectionStatus("error");
      setError(errorData.message || errorData.error || "Connection failed");
    });

    // Socket disconnect handler
    newSocket.on("disconnect", (reason) => {
      console.log("[useExploreChatSocket] 🔌 Disconnect event:", {
        reason,
        socketId: newSocket.id,
        wasConnected: newSocket.connected,
      });
      if (reason === "io server disconnect") {
        // Server disconnected the socket, reconnect manually
        console.warn("[useExploreChatSocket] Server disconnected the socket");
        setConnectionStatus("error");
        setError("Server disconnected. Please refresh the page.");
      } else {
        // Client disconnected or network error
        console.log("[useExploreChatSocket] Client disconnected or network error");
        setConnectionStatus("disconnected");
      }
    });

    // Socket connect handler (fires when socket connects, but before auth)
    newSocket.on("connect", () => {
      console.log("[useExploreChatSocket] 🔗 Socket connected (before auth):", {
        socketId: newSocket.id,
        transport: newSocket.io.engine?.transport?.name,
      });
    });

    // Socket connect_error handler
    newSocket.on("connect_error", (err) => {
      console.error("[useExploreChatSocket] ❌ Connect error event:", {
        message: err.message,
        name: err.name,
      });
      if (err instanceof Error && err.stack) {
        console.error("[useExploreChatSocket] Error stack:", err.stack);
      }
      
      // Extract more detailed error message
      let errorMessage = err.message || "Failed to connect to chat server";
      if (err.message?.includes("Invalid namespace")) {
        errorMessage = "Invalid namespace. Please check server configuration.";
        console.error("[useExploreChatSocket] Invalid namespace error detected");
      } else if (err.message?.includes("authentication")) {
        errorMessage = "Authentication failed. Please login again.";
        console.error("[useExploreChatSocket] Authentication error detected");
      } else if (err.message?.includes("timeout")) {
        errorMessage = "Connection timeout. Please check your network.";
        console.error("[useExploreChatSocket] Timeout error detected");
      }
      
      setConnectionStatus("error");
      setError(errorMessage);
    });

    // Socket reconnection events
    newSocket.io.on("reconnect", (attempt) => {
      console.log("[useExploreChatSocket] 🔄 Reconnected after attempt:", attempt);
    });

    newSocket.io.on("reconnect_attempt", (attempt) => {
      console.log("[useExploreChatSocket] 🔄 Reconnection attempt:", attempt);
    });

    newSocket.io.on("reconnect_error", (err) => {
      console.error("[useExploreChatSocket] ❌ Reconnection error:", err);
    });

    newSocket.io.on("reconnect_failed", () => {
      console.error("[useExploreChatSocket] ❌ Reconnection failed after all attempts");
      setConnectionStatus("error");
      setError("Failed to reconnect. Please try again.");
    });

    // Message typing handler
    newSocket.on("message:typing", (data: MessageTypingData) => {
      console.log("[useExploreChatSocket] ⌨️ Typing status received:", {
        isTyping: data.data.isTyping,
        message: data.message,
      });
      setIsTyping(data.data.isTyping);
      // Notify all callbacks
      typingStatusCallbacksRef.current.forEach((callback) => {
        callback(data.data.isTyping);
      });
    });

    // Message response handler
    newSocket.on("message:response", (data: MessageResponseData) => {
      console.log("[useExploreChatSocket] 💬 Message response received:", {
        success: data.success,
        message: data.message,
        userId: data.data.userId,
        chapterId: data.data.chapterId,
        chapterTitle: data.data.chapterTitle,
        materialId: data.data.materialId,
        materialTitle: data.data.materialTitle,
        language: data.data.language,
        tokensUsed: data.data.tokensUsed,
        responseTimeMs: data.data.responseTimeMs,
        timestamp: data.data.timestamp,
        responseLength: data.data.response?.length || 0,
      });
      setIsTyping(false);
      // Notify all callbacks
      messageResponseCallbacksRef.current.forEach((callback) => {
        callback(data);
      });
    });

    // Message error handler
    newSocket.on("message:error", (errorData: MessageErrorData) => {
      console.error("[useExploreChatSocket] ❌ Message error received:", {
        success: errorData.success,
        message: errorData.message,
        error: errorData.error,
        event: errorData.event,
      });
      setIsTyping(false);
      // Notify all callbacks
      messageErrorCallbacksRef.current.forEach((callback) => {
        callback(errorData);
      });
    });

    setSocket(newSocket);
    console.log("[useExploreChatSocket] ===== Socket Connection Setup Complete =====");
  };

  // Retry connection function
  const retryConnection = () => {
    console.log("[useExploreChatSocket] 🔄 Retry connection triggered");
    retryTriggerRef.current += 1;
    // Force reconnection by cleaning up and reconnecting
    if (socketRef.current) {
      console.log("[useExploreChatSocket] Closing existing socket for retry");
      socketRef.current.removeAllListeners();
      socketRef.current.close();
      socketRef.current = null;
    }
    setSocket(null);
    // Small delay to ensure cleanup completes
    setTimeout(() => {
      connectSocket();
    }, 100);
  };

  useEffect(() => {
    connectSocket();

    // Cleanup function
    return () => {
      console.log("[useExploreChatSocket] 🧹 Cleanup: Removing socket connection");
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
      }
      setSocket(null);
      setConnectionStatus("disconnected");
    };
  }, [session, status]);

  // Send message function
  // Note: materialId parameter is actually the chapterId, not the material ID
  const sendMessage = (message: string, materialId: string, userId: string, language?: string) => {
    if (!socketRef.current || !isConnected) {
      console.warn("[useExploreChatSocket] Cannot send message - socket not connected");
      return;
    }

    const payload: SendMessagePayload = {
      message: message.trim(),
      materialId, // Note: This is actually chapterId, not materialId
      userId,
      language: language || "en", // Optional: defaults to 'en'
    };

    console.log("[useExploreChatSocket] 📤 Sending message:", {
      message: payload.message.substring(0, 50) + (payload.message.length > 50 ? "..." : ""),
      materialId: payload.materialId, // Actually chapterId
      userId: payload.userId,
      language: payload.language,
    });

    socketRef.current.emit("message:send", payload);
  };

  // Register message response callback
  const onMessageResponse = (callback: (data: MessageResponseData) => void): (() => void) => {
    messageResponseCallbacksRef.current.add(callback);
    return () => {
      messageResponseCallbacksRef.current.delete(callback);
    };
  };

  // Register message error callback
  const onMessageError = (callback: (error: MessageErrorData) => void): (() => void) => {
    messageErrorCallbacksRef.current.add(callback);
    return () => {
      messageErrorCallbacksRef.current.delete(callback);
    };
  };

  // Register typing status callback
  const onTypingStatus = (callback: (isTyping: boolean) => void): (() => void) => {
    typingStatusCallbacksRef.current.add(callback);
    return () => {
      typingStatusCallbacksRef.current.delete(callback);
    };
  };

  const isConnected = connectionStatus === "connected";

  return {
    socket,
    connectionStatus,
    isConnected,
    error,
    isTyping,
    retryConnection,
    sendMessage,
    onMessageResponse,
    onMessageError,
    onTypingStatus,
  };
}
