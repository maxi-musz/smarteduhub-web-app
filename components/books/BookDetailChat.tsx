"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Loader2, BookOpen, FileText, AlertCircle, Wifi, WifiOff, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import ReactMarkdown from "react-markdown";
import type { GeneralMaterialChapter } from "@/hooks/general-materials/use-general-material-detail";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  status?: "sending" | "sent" | "failed";
  error?: string;
  tempId?: string;
}

interface BookDetailChatProps {
  selectedChapter: GeneralMaterialChapter | null;
  hasChapters: boolean;
  materialId?: string;
}

interface SocketError {
  success: false;
  message: string;
  error?: string;
  event?: string;
}

export function BookDetailChat({ selectedChapter, hasChapters }: BookDetailChatProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const hasLoadedHistoryRef = useRef(false);
  const previousChapterRef = useRef<string | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const isConnectingRef = useRef(false);
  const selectedChapterRef = useRef<GeneralMaterialChapter | null>(null);
  const { data: session } = useSession();
  
  // Keep selectedChapter ref in sync
  useEffect(() => {
    selectedChapterRef.current = selectedChapter;
  }, [selectedChapter]);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{
    backendUrl?: string;
    hasToken?: boolean;
    tokenLength?: number;
    socketId?: string;
    lastError?: string;
  }>({});

  // Connection setup function (reusable for initial connection and retry)
  const setupSocketConnection = useCallback((forceReconnect = false) => {
    // Prevent duplicate connections
    if (isConnectingRef.current && !forceReconnect) {
      console.log("[AI Chat] Connection already in progress, skipping...");
      return;
    }

    const currentAccessToken = session?.user?.accessToken;
    
    // If we already have a connection with the same token, don't reconnect
    if (socketRef.current?.connected && !forceReconnect && accessTokenRef.current === currentAccessToken) {
      console.log("[AI Chat] Already connected with same token, skipping reconnection");
      return;
    }

    // Close existing connection if any
    if (socketRef.current) {
      console.log("[AI Chat] Closing existing connection...");
      socketRef.current.removeAllListeners();
      socketRef.current.close();
      socketRef.current = null;
    }

    isConnectingRef.current = true;

    // Debug: Check session
    console.log("[AI Chat] Initializing connection...");
    console.log("[AI Chat] Session:", session ? "Exists" : "Missing");
    console.log("[AI Chat] Access Token:", currentAccessToken ? "Present" : "Missing");

    if (!currentAccessToken) {
      const errorMsg = "Authentication required. Please login again.";
      console.error("[AI Chat] ❌", errorMsg);
      setConnectionError(errorMsg);
      setIsRetrying(false);
      isConnectingRef.current = false;
      return;
    }

    // Store the current access token
    accessTokenRef.current = currentAccessToken;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log("[AI Chat] Backend URL:", backendUrl || "NOT CONFIGURED");
    
    if (!backendUrl) {
      const errorMsg = "Backend URL not configured. Please check your environment variables.";
      console.error("[AI Chat] ❌", errorMsg);
      setConnectionError(errorMsg);
      setIsRetrying(false);
      return;
    }

    // Extract base URL for Socket.IO (remove /api/v1 if present)
    // Socket.IO namespaces are at server root, not under API paths
    const baseUrl = backendUrl.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
    const socketUrl = `${baseUrl}/ai-chat-latest`;
    console.log("[AI Chat] Base URL (for Socket.IO):", baseUrl);
    console.log("[AI Chat] Connecting to:", socketUrl);
    console.log("[AI Chat] Token length:", currentAccessToken.length);
    console.log("[AI Chat] Token preview:", currentAccessToken.substring(0, 20) + "...");

    // Initialize socket connection
    const socket = io(socketUrl, {
      auth: {
        token: currentAccessToken,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socketRef.current = socket;

    // Update debug info
    setDebugInfo({
      backendUrl: baseUrl,
      hasToken: !!currentAccessToken,
      tokenLength: currentAccessToken.length,
    });

    // Connection events
    socket.on("connect", () => {
      console.log("[AI Chat] ✅ Connected to AI Chat Latest");
      console.log("[AI Chat] Socket ID:", socket.id);
      setIsConnected(true);
      setConnectionError(null);
      setIsRetrying(false);
      isConnectingRef.current = false;
      setDebugInfo((prev) => ({ ...prev, socketId: socket.id, lastError: undefined }));
      
      // Request history by chapter to load chat history
      // Note: selectedChapter is captured from closure, but we'll request history
      // in the separate effect when it's available
      if (selectedChapterRef.current?.id) {
        console.log("[AI Chat] Connected, requesting conversation:history for chapter:", selectedChapterRef.current.id);
        socket.emit("conversation:history", {
          materialId: selectedChapterRef.current.id, // Use chapter ID instead of material ID
          limit: 50,
          offset: 0,
        });
      }
    });

    socket.on("connection:success", (data) => {
      console.log("[AI Chat] ✅ Connection confirmed:", data);
      setIsConnected(true);
      setConnectionError(null);
      
      // Request history by chapter if we have selectedChapter
      if (selectedChapterRef.current?.id) {
        console.log("[AI Chat] Connection confirmed, requesting conversation:history for chapterId:", selectedChapterRef.current.id);
        console.log("[AI Chat] Selected chapter:", selectedChapterRef.current.title);
        socket.emit("conversation:history", {
          materialId: selectedChapterRef.current.id, // Use chapter ID instead of material ID
          limit: 50,
          offset: 0,
        });
      } else {
        console.log("[AI Chat] Connection confirmed, but selectedChapter not available yet", {
          hasSelectedChapter: !!selectedChapterRef.current,
        });
      }
    });

    socket.on("connection:error", (error: SocketError) => {
      console.error("[AI Chat] ❌ Connection error event:", error);
      console.error("[AI Chat] Error message:", error.message);
      console.error("[AI Chat] Error details:", error.error);
      setIsConnected(false);
      setIsRetrying(false);
      const errorMsg = error.message || error.error || "Failed to connect to AI chat service. Please try again.";
      setConnectionError(errorMsg);
    });

    socket.on("disconnect", (reason) => {
      console.log("[AI Chat] Disconnected. Reason:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        // Server disconnected the socket, need to reconnect manually
        setConnectionError("Connection lost. Please refresh the page.");
      } else if (reason === "io client disconnect") {
        // Client disconnected, no error needed
        console.log("[AI Chat] Client disconnected intentionally");
      } else {
        setConnectionError("Connection lost. Reconnecting...");
      }
    });

    socket.on("connect_error", (error: Error & { type?: string; description?: string }) => {
      console.error("[AI Chat] ❌ Socket.IO connect_error:", error);
      console.error("[AI Chat] Error type:", error.type);
      console.error("[AI Chat] Error message:", error.message);
      console.error("[AI Chat] Error description:", error.description);
      setIsConnected(false);
      isConnectingRef.current = false;
      
      const errorType = error.type || "Unknown";
      const errorDesc = error.description || "";
      const errorDetails = `${errorType}: ${error.message || errorDesc || "Connection failed"}`;
      setDebugInfo((prev) => ({ ...prev, lastError: errorDetails }));
      
      // More specific error messages
      let errorMsg = "Failed to connect to AI chat service.";
      const errorMessage = error.message || "";
      if (errorMessage.includes("xhr poll error") || errorMessage.includes("websocket error")) {
        errorMsg = `Connection failed: ${errorMessage}. Please check if the backend server is running at ${backendUrl}`;
      } else if (errorMessage.includes("timeout")) {
        errorMsg = "Connection timeout. The server may be unreachable. Please check your network connection.";
      } else if (errorMessage.includes("401") || errorMessage.includes("Unauthorized")) {
        errorMsg = "Authentication failed. Please login again.";
      } else if (errorMessage) {
        errorMsg = `Connection error: ${errorMessage}`;
      } else {
        errorMsg = "Failed to connect to AI chat service. Please check your internet connection and ensure the backend server is running.";
      }
      
      setConnectionError(errorMsg);
      setIsRetrying(false);
    });

    // Message events
    socket.on("message:user", (data) => {
      if (data.success && data.data) {
        // Replace pending message with confirmed message, or add new one
        setChatMessages((prev) => {
          // Find and replace any "sending" message with the same content
          const hasPending = prev.some(
            (msg) => msg.status === "sending" && msg.content === data.data.content
          );
          
          if (hasPending) {
            // Replace the pending message
            return prev.map((msg) =>
              msg.status === "sending" && msg.content === data.data.content
                ? {
                    id: data.data.id,
                    content: data.data.content,
                    role: "user",
                    timestamp: new Date(data.data.createdAt),
                    status: "sent" as const,
                  }
                : msg
            );
          } else {
            // Add new message if no pending match found
            return [
              ...prev,
              {
                id: data.data.id,
                content: data.data.content,
                role: "user",
                timestamp: new Date(data.data.createdAt),
                status: "sent" as const,
              },
            ];
          }
        });
        setMessageError(null);
      }
    });

    socket.on("message:assistant", (data) => {
      if (data.success && data.data) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: data.data.id,
            content: data.data.content,
            role: "assistant",
            timestamp: new Date(data.data.createdAt),
          },
        ]);
        setIsLoading(false);
        setIsTyping(false);
        setMessageError(null);

        // Update conversation ID if this is a new conversation
        if (data.data.conversationId && !conversationIdRef.current) {
          conversationIdRef.current = data.data.conversationId;
        }
      }
    });

    socket.on("message:typing", (data) => {
      if (data.success && data.data) {
        setIsTyping(data.data.isTyping);
      }
    });

    socket.on("message:error", (error: SocketError) => {
      console.error("Message error:", error.message);
      setIsLoading(false);
      setIsTyping(false);
      const errorMsg = error.message || "Failed to send message. Please try again.";
      
      // Mark the most recent "sending" message as failed
      setChatMessages((prev) => {
        const sendingMessages = prev.filter((msg) => msg.status === "sending");
        if (sendingMessages.length > 0) {
          const lastSending = sendingMessages[sendingMessages.length - 1];
          return prev.map((msg) =>
            msg.id === lastSending.id
              ? { ...msg, status: "failed" as const, error: errorMsg }
              : msg
          );
        }
        return prev;
      });
      
      setMessageError(errorMsg);
    });

    // Conversation error handler (for conversation:history errors)
    socket.on("conversation:error", (error: SocketError) => {
      console.error("[AI Chat] ❌ Conversation error:", error.message);
      const errorMsg = error.message || "Failed to get chat history. Please try again.";
      setMessageError(errorMsg);
      
      // Note: selectedChapter and chatMessages are from closure - this is fine for error handling
      // The welcome message will be shown by the history effect if needed
    });

    // Conversation history (backend endpoint for getting chat history)
    socket.on("conversation:history", (data) => {
      console.log("[AI Chat] Received conversation:history event:", data);
      if (data.success && data.data) {
        const { conversationHistory, usageLimits } = data.data;
        
        console.log("[AI Chat] ✅ Received conversation history:", {
          messageCount: conversationHistory?.length || 0,
          hasUsageLimits: !!usageLimits,
        });
        
        // Extract conversation ID from the first message if available
        // The backend spec shows each message has conversationId field
        if (conversationHistory && conversationHistory.length > 0) {
          const firstMessage = conversationHistory[0];
          if (firstMessage.conversationId) {
            conversationIdRef.current = firstMessage.conversationId;
            console.log("[AI Chat] Set conversation ID from history:", firstMessage.conversationId);
          } else {
            conversationIdRef.current = null;
            console.log("[AI Chat] No conversation ID in history (new conversation)");
          }
        } else {
          conversationIdRef.current = null;
          console.log("[AI Chat] No conversation history, resetting conversation ID");
        }
        
        // Map and set messages
        if (conversationHistory && Array.isArray(conversationHistory)) {
          interface ConversationHistoryItem {
            id: string;
            content: string;
            role: string;
            createdAt: string | number | Date;
            conversationId?: string | null;
          }

          const history: ChatMessage[] = conversationHistory.map((msg: ConversationHistoryItem) => ({
            id: msg.id,
            content: msg.content,
            role: (msg.role === "USER" ? "user" : msg.role === "ASSISTANT" ? "assistant" : "assistant") as "user" | "assistant",
            timestamp: new Date(msg.createdAt),
            status: msg.role === "USER" ? ("sent" as const) : undefined,
          }));
          
          setChatMessages(history);
          hasLoadedHistoryRef.current = true;
          
          // If no history, show welcome message
          if (history.length === 0 && selectedChapterRef.current) {
            console.log("[AI Chat] No history found, showing welcome message");
            setChatMessages([
              {
                id: "welcome-" + Date.now(),
                role: "assistant",
                content: `Hello! I'm your AI study assistant for "${selectedChapterRef.current.title}". I can help you understand concepts, answer questions, and provide explanations about this chapter. How can I assist you today?`,
                timestamp: new Date(),
              },
            ]);
          }
        } else {
          console.log("[AI Chat] No conversation history in response");
          hasLoadedHistoryRef.current = true;
        }
      } else {
        console.log("[AI Chat] ❌ Invalid conversation:history response:", data);
        hasLoadedHistoryRef.current = true;
      }
    });

    // Conversation created (when first message is sent)
    socket.on("conversation:created", (data) => {
      if (data.success && data.data?.id) {
        console.log("[AI Chat] New conversation created:", data.data.id);
        if (!conversationIdRef.current) {
          conversationIdRef.current = data.data.id;
        }
      }
    });
  }, [session]); // Depend on full session object

  // Initialize socket connection on mount or when access token changes
  useEffect(() => {
    const currentAccessToken = session?.user?.accessToken;
    
    // Only connect if we have a token and don't already have a connection with the same token
    if (currentAccessToken && accessTokenRef.current !== currentAccessToken) {
      setupSocketConnection();
    } else if (!currentAccessToken) {
      // If no token, close any existing connection
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
        accessTokenRef.current = null;
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log("[AI Chat] Cleaning up socket connection on unmount");
        socketRef.current.removeAllListeners();
        socketRef.current.close();
        socketRef.current = null;
        accessTokenRef.current = null;
        isConnectingRef.current = false;
      }
    };
  }, [session?.user?.accessToken, setupSocketConnection]);

  // Retry connection function
  const handleRetryConnection = useCallback(() => {
    console.log("[AI Chat] Retrying connection...");
    setIsRetrying(true);
    setConnectionError(null);
    setupSocketConnection(true); // Force reconnect
  }, [setupSocketConnection]);

  // Load conversation history when chapter/material changes and socket is connected
  useEffect(() => {
    const currentChapterId = selectedChapter?.id || null;
    // Only consider it a change if we had a previous chapter (not initial load)
    const chapterChanged = previousChapterRef.current !== null && previousChapterRef.current !== currentChapterId;
    
    if (chapterChanged) {
      // Immediately clear messages when chapter changes
      console.log("[AI Chat] ⚠️ Chapter changed! Clearing messages and resetting conversation lookup");
      console.log("[AI Chat] Previous chapter ID:", previousChapterRef.current, "→ New chapter ID:", currentChapterId);
      setChatMessages([]);
      setInputMessage("");
      conversationIdRef.current = null;
      hasLoadedHistoryRef.current = false;
    }
    
    // Update the previous chapter reference
    previousChapterRef.current = currentChapterId;

    if (!selectedChapter) {
      setChatMessages([]);
      setInputMessage("");
      conversationIdRef.current = null;
      hasLoadedHistoryRef.current = false;
      return;
    }

    console.log("[AI Chat] Chapter effect triggered:", {
      chapterId: currentChapterId,
      chapterTitle: selectedChapter.title,
      chapterChanged,
      hasConversationId: !!conversationIdRef.current,
      isConnected: socketRef.current?.connected,
    });

      if (socketRef.current?.connected) {
      // Always request history by chapter when chapter changes or when we need to load history
      console.log("[AI Chat] Requesting conversation:history for chapterId:", selectedChapter.id);
      console.log("[AI Chat] Emitting conversation:history with:", {
        materialId: selectedChapter.id, // Use chapter ID instead of material ID
        limit: 50,
        offset: 0,
      });
      socketRef.current.emit("conversation:history", {
        materialId: selectedChapter.id, // Use chapter ID instead of material ID
        limit: 50,
        offset: 0,
      });
    } else {
      console.log("[AI Chat] Socket not connected yet, waiting for connection...");
      // Show welcome message while waiting for connection if no messages
      if (selectedChapter) {
        setChatMessages((prev) => {
          if (prev.length > 0) return prev;
          return [
            {
              id: "welcome-" + Date.now(),
              role: "assistant",
              content: `Hello! I'm your AI study assistant for "${selectedChapter.title}". I can help you understand concepts, answer questions, and provide explanations about this chapter. How can I assist you today?`,
              timestamp: new Date(),
            },
          ];
        });
      }
    }
  }, [selectedChapter]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || isLoading || !selectedChapter || !socketRef.current?.connected) {
      if (!socketRef.current?.connected) {
        setMessageError("Not connected to chat service. Please wait for connection.");
      }
      return;
    }

    const messageToSend = inputMessage.trim();
    const tempMessageId = `temp-${Date.now()}`;
    
    // Add message immediately with "sending" status (optimistic update)
    const pendingMessage: ChatMessage = {
      id: tempMessageId,
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
      status: "sending",
    };

    setChatMessages((prev) => [...prev, pendingMessage]);
    setInputMessage("");
    setIsLoading(true);
    setMessageError(null);

    try {
      socketRef.current.emit("message:send", {
        message: messageToSend,
        materialId: selectedChapter.id, // Use chapter ID instead of material ID
        conversationId: conversationIdRef.current || undefined,
      });
      
      // Store temp ID to track this message
      pendingMessage.tempId = tempMessageId;
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      // Mark message as failed
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId
            ? { ...msg, status: "failed" as const, error: "Failed to send message. Please try again." }
            : msg
        )
      );
    }
  }, [inputMessage, isLoading, selectedChapter]);

  // Retry sending a failed message
  const handleRetryMessage = useCallback((messageId: string, messageContent: string) => {
    if (!socketRef.current?.connected) {
      setMessageError("Not connected to chat service. Please wait for connection.");
      return;
    }

    // Update message status to "sending"
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, status: "sending" as const, error: undefined } : msg
      )
    );

    try {
      socketRef.current.emit("message:send", {
        message: messageContent,
        materialId: selectedChapter?.id, // Use chapter ID instead of material ID
        conversationId: conversationIdRef.current || undefined,
      });
    } catch (error) {
      console.error("Error retrying message:", error);
      // Mark message as failed again
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, status: "failed" as const, error: "Failed to send message. Please try again." }
            : msg
        )
      );
    }
  }, [selectedChapter]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!hasChapters) {
    return (
      <div className="w-[600px] flex flex-col bg-white border-l border-brand-border">
        <div className="border-b border-brand-border px-4 py-3 bg-brand-bg/60">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-primary" />
            <h2 className="font-semibold text-brand-heading">AI Study Assistant</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-brand-heading mb-2">
              No Chapters Available
            </h3>
            <p className="text-sm text-brand-light-accent-1">
              Add a chapter to start chatting with the AI assistant about the book content.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedChapter) {
    return (
      <div className="w-[600px] flex flex-col bg-white border-l border-brand-border">
        <div className="border-b border-brand-border px-4 py-3 bg-brand-bg/60">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-primary" />
            <h2 className="font-semibold text-brand-heading">AI Study Assistant</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-brand-heading mb-2">
              Select a Chapter
            </h3>
            <p className="text-sm text-brand-light-accent-1">
              Please select a chapter from the dropdown above to start chatting with the AI assistant about that specific chapter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if chapter has files
  const hasChapterFiles = selectedChapter.files && selectedChapter.files.length > 0;

  if (!hasChapterFiles) {
    return (
      <div className="w-[600px] flex flex-col bg-white border-l border-brand-border">
        <div className="border-b border-brand-border px-4 py-3 bg-brand-bg/60">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-primary" />
            <h2 className="font-semibold text-brand-heading">AI Study Assistant</h2>
          </div>
          <p className="text-xs text-brand-light-accent-1 mt-1">
            Context: {selectedChapter.title}
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-lg font-semibold text-brand-heading mb-2">
              No Files Available
            </h3>
            <p className="text-sm text-brand-light-accent-1">
              This chapter doesn&apos;t have any files uploaded yet. Please upload a file to this chapter to enable AI chat functionality.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[600px] flex flex-col bg-white border-l border-brand-border">
      <div className="border-b border-brand-border px-4 py-3 bg-brand-bg/60">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-brand-primary" />
          <h2 className="font-semibold text-brand-heading">AI Study Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1 text-green-600">
                <Wifi className="h-4 w-4" />
                <span className="text-xs">Connected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <WifiOff className="h-4 w-4" />
                <span className="text-xs">Disconnected</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-brand-light-accent-1 mt-1">
          Context: {selectedChapter.title}
        </p>
        {connectionError && (
          <div className="mt-2 space-y-2">
            <div className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-red-700 font-medium">{connectionError}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={handleRetryConnection}
                    disabled={isRetrying}
                    className="flex items-center gap-1 text-xs text-white bg-brand-primary hover:bg-brand-primary/90 px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
                    {isRetrying ? "Retrying..." : "Retry Connection"}
                  </button>
                  <button
                    onClick={() => setShowDebugInfo(!showDebugInfo)}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    {showDebugInfo ? "Hide" : "Show"} debug info
                  </button>
                </div>
              </div>
            </div>
            {showDebugInfo && (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-xs font-mono">
                <p className="font-semibold mb-2">Debug Information:</p>
                <div className="space-y-1 text-gray-700">
                  <p>Backend URL: {debugInfo.backendUrl || "Not configured"}</p>
                  <p>Has Token: {debugInfo.hasToken ? "Yes" : "No"}</p>
                  {debugInfo.tokenLength && <p>Token Length: {debugInfo.tokenLength} characters</p>}
                  {debugInfo.socketId && <p>Socket ID: {debugInfo.socketId}</p>}
                  {debugInfo.lastError && (
                    <p className="text-red-600">Last Error: {debugInfo.lastError}</p>
                  )}
                  <p className="mt-2 text-gray-500">
                    Check browser console (F12) for detailed logs
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="h-4 w-4 text-brand-primary" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.role === "user"
                  ? message.status === "failed"
                    ? "bg-red-100 text-red-900 border border-red-300"
                    : "bg-brand-primary text-white"
                  : "bg-brand-bg text-brand-heading"
              }`}
            >
              {message.role === "assistant" ? (
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-relaxed text-brand-heading">{children}</p>,
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-3 mt-4 first:mt-0 text-brand-heading border-b border-gray-200 pb-1">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-brand-heading">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-brand-heading">{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc list-outside mb-3 space-y-2 ml-4">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-outside mb-3 space-y-2 ml-4">{children}</ol>,
                      li: ({ children }) => <li className="text-sm leading-relaxed text-brand-heading pl-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-brand-heading">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children, className }) => {
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono text-brand-heading">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs font-mono overflow-x-auto my-2 text-brand-heading border border-gray-200">
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md text-xs font-mono overflow-x-auto my-2 border border-gray-200">
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-brand-primary pl-4 italic my-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 py-2 rounded-r">
                          {children}
                        </blockquote>
                      ),
                      hr: () => <hr className="my-4 border-gray-300 dark:border-gray-600" />,
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-primary hover:underline font-medium"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
                {message.role === "user" && (
                  <div className="flex items-center gap-1">
                    {message.status === "sending" && (
                      <Loader2 className="h-3 w-3 animate-spin opacity-70" />
                    )}
                    {message.status === "sent" && (
                      <CheckCircle2 className="h-3 w-3 opacity-70" />
                    )}
                    {message.status === "failed" && (
                      <div className="flex items-center gap-1">
                        <XCircle className="h-3 w-3 text-red-600" />
                        <button
                          onClick={() => handleRetryMessage(message.id, message.content)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium underline flex items-center gap-1"
                          title={message.error || "Retry sending this message"}
                        >
                          <RefreshCw className="h-3 w-3" />
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {message.status === "failed" && message.error && (
                <p className="text-xs text-red-600 mt-1">{message.error}</p>
              )}
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">U</span>
              </div>
            )}
          </div>
        ))}
        {(isLoading || isTyping) && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-4 w-4 text-brand-primary" />
            </div>
            <div className="bg-brand-bg rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                <p className="text-sm text-brand-light-accent-1">
                  {isTyping ? "AI is typing..." : "Thinking..."}
                </p>
              </div>
            </div>
          </div>
        )}
        {messageError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-xs text-red-700 mt-1">{messageError}</p>
            </div>
            <button
              onClick={() => setMessageError(null)}
              className="text-red-600 hover:text-red-800 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-brand-border p-4 bg-brand-bg/30">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              !isConnected
                ? "Connecting to chat service..."
                : `Ask a question about "${selectedChapter.title}"...`
            }
            className="flex-1 min-h-[60px] max-h-[120px] rounded-md border border-brand-border bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
            rows={2}
            disabled={!selectedChapter || isLoading || !isConnected}
          />
          <Button
            onClick={handleSendMessage}
            disabled={
              !inputMessage.trim() ||
              isLoading ||
              !selectedChapter ||
              !isConnected
            }
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-brand-light-accent-1 mt-2">
          {!isConnected
            ? "Waiting for connection..."
            : "Press Enter to send, Shift+Enter for new line"}
        </p>
      </div>
    </div>
  );
}

