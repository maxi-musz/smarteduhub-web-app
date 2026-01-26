"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useExploreChatSocket, type MessageResponseData, type MessageErrorData } from "@/hooks/explore/use-explore-chat-socket";
import { ChatSettings, getStoredSettings, type ChatSettingsData } from "./ChatSettings";
import { getChatTranslations } from "./chatTranslations";
import { getStudyToolDisplayMessage, getStudyToolBackendMessage, studyToolRequiresDialog, type StudyToolDialogData } from "./studyToolMessages";
import { StudyToolDialog } from "./StudyToolDialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

// Import new components
import {
  type ChatInterfaceProps,
  type ChatMessage,
  defaultStudyTools,
  MIN_WIDTH,
  MAX_WIDTH,
  DEFAULT_WIDTH,
  ChatHeader,
  ResizeHandle,
  StudyToolsSelector,
  ChatMessages,
  ChatInput,
  useTTS,
  markdownToPlainText,
} from "./chat";

// Re-export types for backward compatibility
export type { ChatInterfaceProps, ChatMessage, StudyTool } from "./chat/types";

export function ChatInterface({
  bookTitle,
  chapterTitle,
  initialMessage,
  messages: externalMessages = [],
  onSendMessage: externalOnSendMessage,
  isLoading: externalIsLoading = false,
  studyTools = defaultStudyTools,
  showStudyTools = true,
  onStudyToolClick,
  disclaimer,
  materialId,
  useSocket = true,
  programmaticMessage,
  onProgrammaticMessageSent,
}: ChatInterfaceProps) {
  const { data: session } = useSession();
  const [inputMessage, setInputMessage] = useState("");
  const [selectedStudyTool, setSelectedStudyTool] = useState<string>("");
  const [, setShowFeedback] = useState<string | null>(null);
  const [studyToolDialogOpen, setStudyToolDialogOpen] = useState(false);
  const [pendingToolId, setPendingToolId] = useState<string | null>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const [internalMessages, setInternalMessages] = useState<ChatMessage[]>([]);
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ChatSettingsData>(() => getStoredSettings());
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use TTS hook
  const {
    playingMessageId,
    loadingTtsMessageId,
    autoPlayedMessageIds,
    preparedAudioRefs,
    setAutoPlayedMessageIds,
    prepareTTSAudio,
    playPreparedAudio,
    handlePlayTTS,
    cleanup: cleanupTTS,
  } = useTTS(settings);

  // Get translations based on selected language
  const translations = useMemo(() => getChatTranslations(settings.language), [settings.language]);
  
  // Get default disclaimer from translations if not provided
  const effectiveDisclaimer = disclaimer || translations.disclaimer;
  
  // Translate study tools
  const translatedStudyTools = useMemo(() => {
    const toolIdToKey: Record<string, keyof typeof translations.studyTools> = {
      "chapter-summary": "chapterSummary",
      "important-notes": "importantNotes",
      "revision-notes": "revisionNotes",
      "common-mistakes": "commonMistakes",
      "study-tricks": "studyTricks",
      "create-definitions": "createDefinitions",
      "create-question-paper": "createQuestionPaper",
      "create-questions-answers": "createQuestionsAnswers",
      "create-mcqs": "createMcqs",
    };
    
    return studyTools.map((tool) => {
      const translationKey = toolIdToKey[tool.id];
      const translatedLabel = translationKey ? translations.studyTools[translationKey] : tool.label;
      return {
        ...tool,
        label: translatedLabel,
      };
    });
  }, [studyTools, translations]);

  // Socket connection
  const {
    connectionStatus,
    isConnected,
    error: socketError,
    isTyping: socketIsTyping,
    retryConnection,
    sendMessage: socketSendMessage,
    onMessageResponse,
    onMessageError,
  } = useExploreChatSocket();

  // Use socket messaging if enabled, otherwise use external callbacks
  const useSocketMessaging = useSocket && isConnected && !!materialId && !!session?.user?.id;

  // Check if chapter is selected (required for socket messaging)
  const hasChapterSelected = !!materialId;
  
  // Determine if user can send messages
  const canSendMessage = useSocket
    ? hasChapterSelected && isConnected && !internalIsLoading && !socketIsTyping
    : !externalIsLoading;

  // Clear messages when chapter (materialId) changes
  useEffect(() => {
    if (useSocket && materialId) {
      console.log("[ChatInterface] Chapter changed, clearing messages. New materialId:", materialId);
      setInternalMessages([]);
      setInternalIsLoading(false);
      cleanupTTS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, useSocket]);

  // Handle socket message responses
  useEffect(() => {
    if (!useSocketMessaging) return;

    const cleanupResponse = onMessageResponse((data: MessageResponseData) => {
      console.log("[ChatInterface] Received message response:", {
        chapterId: data.data.chapterId,
        chapterTitle: data.data.chapterTitle,
        materialId: data.data.materialId,
        materialTitle: data.data.materialTitle,
        language: data.data.language,
        tokensUsed: data.data.tokensUsed,
        responseTimeMs: data.data.responseTimeMs,
        responseLength: data.data.response?.length || 0,
      });
      setInternalIsLoading(false);
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.data.response,
        timestamp: new Date(data.data.timestamp),
        isTyping: true,
      };
      
      setInternalMessages((prev) => [...prev, aiMessage]);
      
      // If auto-play TTS is enabled, prepare audio immediately
      if (
        settings.autoPlayTTS && 
        !autoPlayedMessageIds.has(aiMessage.id)
      ) {
        // Small delay to ensure message is added to state first
        setTimeout(() => {
          prepareTTSAudio(aiMessage.id, data.data.response);
        }, 100);
      }
    });

    const cleanupError = onMessageError((error: MessageErrorData) => {
      console.error("[ChatInterface] Message error:", error);
      setInternalIsLoading(false);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `**Error:** ${error.message || error.error || "Failed to get response. Please try again."}`,
        timestamp: new Date(),
      };
      
      setInternalMessages((prev) => [...prev, errorMessage]);
    });

    return () => {
      cleanupResponse();
      cleanupError();
    };
  }, [useSocketMessaging, onMessageResponse, onMessageError, settings.autoPlayTTS, prepareTTSAudio, autoPlayedMessageIds]);

  // Handle programmatic messages (from TeacherDashboard tools or PDF snapshots)
  const prevProgrammaticMessageRef = useRef<typeof programmaticMessage>(null);
  useEffect(() => {
    // Only send if programmaticMessage changed and is not null
    if (
      programmaticMessage && 
      programmaticMessage !== prevProgrammaticMessageRef.current &&
      useSocketMessaging && 
      materialId && 
      session?.user?.id
    ) {
      const { message, displayContent, imageUrl, imageCaption, metadata } = programmaticMessage;
      const contentToShow = displayContent || message;
      
      // Add user message to chat (with image if provided)
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: contentToShow,
        timestamp: new Date(),
        imageUrl: imageUrl,
        imageCaption: imageCaption,
      };
      
      setInternalMessages((prev) => [...prev, userMessage]);
      setInternalIsLoading(true);
      
      // Send the actual backend message via socket
      // For images, send structured data that backend can parse
      // This allows backend to:
      // 1. Extract metadata (page, coordinates)
      // 2. Process image separately
      // 3. Chunk OCR text before generating embeddings (to avoid token limit errors)
      let messageToSend = message;
      if (imageUrl && metadata) {
        // Send structured snapshot data that backend can parse
        // Backend should:
        // - Parse this JSON structure
        // - Extract the image and run OCR
        // - Chunk the OCR text into smaller pieces (max 8000 tokens each)
        // - Generate embeddings for each chunk separately
        messageToSend = `[SNAPSHOT_START]${JSON.stringify({
          type: 'pdf_snapshot',
          page: metadata.page,
          coordinates: metadata.coordinates,
          caption: imageCaption || "PDF Snapshot",
          imageData: imageUrl, // Full base64 image
        })}[SNAPSHOT_END]`;
      } else if (imageUrl) {
        // Fallback: send with image data
        // Backend needs to chunk OCR text to avoid token limit errors
        messageToSend = `${message}\n\n[Image: ${imageCaption || "PDF Snapshot"}]\n${imageUrl}`;
      }
      socketSendMessage(messageToSend, materialId, session.user.id, settings.language);
      
      // Update ref to prevent duplicate sends
      prevProgrammaticMessageRef.current = programmaticMessage;
      
      // Notify parent that message was sent
      onProgrammaticMessageSent?.();
    } else if (!programmaticMessage) {
      // Reset ref when message is cleared
      prevProgrammaticMessageRef.current = null;
    }
  }, [programmaticMessage, useSocketMessaging, materialId, session?.user?.id, socketSendMessage, settings.language, onProgrammaticMessageSent]);

  // Use internal messages if using socket, otherwise use external messages
  const messages = useSocketMessaging ? internalMessages : externalMessages;
  const isLoading = useSocketMessaging ? internalIsLoading || socketIsTyping : externalIsLoading;

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Auto-scroll during typing (more frequent updates)
  useEffect(() => {
    const hasTypingMessage = messages.some((msg) => msg.isTyping);
    if (hasTypingMessage) {
      const interval = setInterval(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [messages]);

  // Handle resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleSend = () => {
    const message = inputMessage.trim();
    if (!message || !canSendMessage) return;

    if (useSocketMessaging && materialId && session?.user?.id) {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: message,
        timestamp: new Date(),
      };
      
      setInternalMessages((prev) => [...prev, userMessage]);
      setInternalIsLoading(true);
      setInputMessage("");
      
      console.log("[ChatInterface] Sending message via socket:", {
        message,
        materialId,
        userId: session.user.id,
        language: settings.language,
      });
      
      socketSendMessage(message, materialId, session.user.id, settings.language);
    } else if (externalOnSendMessage) {
      externalOnSendMessage(message);
      setInputMessage("");
    }
  };

  // Handle copy to clipboard
  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      const plainText = markdownToPlainText(content);
      await navigator.clipboard.writeText(plainText);
      
      setCopiedMessageId(messageId);
      toast({
        title: "Copied!",
        description: "Response copied to clipboard as plain text",
        duration: 2000,
      });
      
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async (messageId: string, content: string) => {
    try {
      const jsPDFModule = await import("jspdf");
      const html2canvasModule = await import("html2canvas");
      
      const jsPDF = jsPDFModule.default;
      const html2canvas = html2canvasModule.default;

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "800px";
      tempContainer.style.padding = "40px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "14px";
      tempContainer.style.lineHeight = "1.6";
      tempContainer.style.color = "#333333";
      tempContainer.className = "prose prose-sm max-w-none";
      
      const React = await import("react");
      const ReactDOM = await import("react-dom/client");
      const { MarkdownRenderer } = await import("./MarkdownRenderer");
      
      const MarkdownWrapper = React.createElement(MarkdownRenderer, { content });
      const root = ReactDOM.createRoot(tempContainer);
      root.render(MarkdownWrapper);
      
      document.body.appendChild(tempContainer);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = imgWidth * 0.264583;
      const pdfHeight = imgHeight * 0.264583;
      
      const pdf = new jsPDF({
        orientation: pdfHeight > pdfWidth ? "portrait" : "landscape",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      });
      
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
      const filename = `ai-response-${timestamp}.pdf`;
      
      pdf.save(filename);
      
      document.body.removeChild(tempContainer);
      root.unmount();
      
      toast({
        title: "PDF Downloaded!",
        description: "Response downloaded as PDF with formatting preserved",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      
      if (error instanceof Error && error.message.includes("Cannot find module")) {
        toast({
          title: "PDF Library Not Installed",
          description: "Please install jspdf and html2canvas: npm install jspdf html2canvas",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: "PDF Generation Failed",
          description: "Failed to generate PDF. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const handleStudyToolChange = (toolId: string) => {
    setSelectedStudyTool(toolId);
    onStudyToolClick?.(toolId);
    
    if (studyToolRequiresDialog(toolId)) {
      setPendingToolId(toolId);
      setStudyToolDialogOpen(true);
      return;
    }
    
    sendStudyToolMessage(toolId);
    setSelectedStudyTool("");
  };

  const sendStudyToolMessage = (toolId: string, dialogData?: StudyToolDialogData) => {
    const displayMessage = getStudyToolDisplayMessage(toolId, dialogData);
    const backendMessage = getStudyToolBackendMessage(toolId, bookTitle, chapterTitle, dialogData);
    
    if (useSocketMessaging && materialId && session?.user?.id && canSendMessage) {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: displayMessage,
        timestamp: new Date(),
      };
      
      setInternalMessages((prev) => [...prev, userMessage]);
      setInternalIsLoading(true);
      
      console.log("[ChatInterface] Sending study tool message:", {
        toolId,
        displayMessage,
        backendMessage,
        dialogData,
        materialId,
        userId: session.user.id,
        language: settings.language,
      });
      
      socketSendMessage(backendMessage, materialId, session.user.id, settings.language);
    } else if (externalOnSendMessage && canSendMessage) {
      externalOnSendMessage(backendMessage);
    }
  };

  const handleStudyToolDialogSubmit = (dialogData: StudyToolDialogData) => {
    if (pendingToolId) {
      sendStudyToolMessage(pendingToolId, dialogData);
      setPendingToolId(null);
      setSelectedStudyTool("");
    }
  };

  const handleMessageComplete = useCallback((messageId: string) => {
    if (useSocketMessaging) {
      setInternalMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isTyping: false } : msg
        )
      );
    }
    
    // Mark as auto-played if TTS is enabled and audio was prepared
    if (settings.autoPlayTTS && !autoPlayedMessageIds.has(messageId)) {
      setAutoPlayedMessageIds((prev) => new Set(prev).add(messageId));
    }
  }, [useSocketMessaging, settings.autoPlayTTS, autoPlayedMessageIds, setAutoPlayedMessageIds]);

  // Use translated initial message if no custom initialMessage provided
  const defaultInitialMessage = chapterTitle
    ? translations.initialMessageWithChapter
    : translations.initialMessageNoChapter;
  
  const effectiveInitialMessage = initialMessage || defaultInitialMessage;
  
  const shouldShowInitialMessage = messages.length === 0 && (
    !useSocket || 
    (hasChapterSelected && isConnected) || 
    !isConnected
  );
  
  const displayMessages = messages.length > 0 ? messages : (
    shouldShowInitialMessage ? [
      {
        id: "initial",
        role: "assistant" as const,
        content: effectiveInitialMessage,
        timestamp: new Date(),
      },
    ] : []
  );

  return (
    <div
      className="flex flex-col bg-white border-l border-brand-border h-full relative"
      style={{ width: `${width}px`, minWidth: `${MIN_WIDTH}px`, maxWidth: `${MAX_WIDTH}px` }}
    >
      <ResizeHandle onMouseDown={handleMouseDown} />

      <ChatHeader
        bookTitle={bookTitle}
        chapterTitle={chapterTitle}
        connectionStatus={connectionStatus}
        socketError={socketError || undefined}
        translations={{
          connected: translations.connected,
          connecting: translations.connecting,
          disconnected: translations.disconnected,
        }}
        settings={settings}
        onSettingsChange={setSettings}
        onSettingsOpen={() => setSettingsOpen(true)}
        onRetryConnection={retryConnection}
      />

      {showStudyTools && (
        <StudyToolsSelector
          studyTools={translatedStudyTools}
          selectedTool={selectedStudyTool}
          onToolChange={handleStudyToolChange}
          disabled={!isConnected || (useSocket && !hasChapterSelected)}
          placeholder={
            !isConnected 
              ? translations.connecting 
              : useSocket && !hasChapterSelected
              ? translations.selectChapterFirst
              : translations.selectStudyTool
          }
        />
      )}

      <ChatMessages
        messages={displayMessages}
        settings={settings}
        useSocket={useSocket}
        hasChapterSelected={hasChapterSelected}
        isConnected={isConnected}
        isLoading={isLoading}
        socketIsTyping={socketIsTyping}
        translations={{
          selectChapterFirst: translations.selectChapterFirst,
          initialMessageNoChapter: translations.initialMessageNoChapter,
          aiTyping: translations.aiTyping,
          thinking: translations.thinking,
        }}
        copiedMessageId={copiedMessageId}
        playingMessageId={playingMessageId}
        loadingTtsMessageId={loadingTtsMessageId}
        preparedAudioRefs={preparedAudioRefs}
        autoPlayedMessageIds={autoPlayedMessageIds}
        onMessageComplete={handleMessageComplete}
        onCopy={handleCopyMessage}
        onPlayTTS={handlePlayTTS}
        onDownloadPDF={handleDownloadPDF}
        onFeedback={setShowFeedback}
        onPlayPreparedAudio={playPreparedAudio}
        messagesEndRef={messagesEndRef}
      />

      <ChatInput
        inputMessage={inputMessage}
        onInputChange={setInputMessage}
        onSend={handleSend}
        canSendMessage={canSendMessage}
        isConnected={isConnected}
        hasChapterSelected={hasChapterSelected}
        useSocket={useSocket}
        translations={{
          connectingToServer: translations.connectingToServer,
          selectChapterFirst: translations.selectChapterFirst,
          askQuestionPlaceholder: translations.askQuestionPlaceholder,
        }}
        disclaimer={effectiveDisclaimer}
      />

      <ChatSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {pendingToolId && (
        <StudyToolDialog
          open={studyToolDialogOpen}
          onOpenChange={(open) => {
            setStudyToolDialogOpen(open);
            if (!open) {
              setPendingToolId(null);
              setSelectedStudyTool("");
            }
          }}
          toolId={pendingToolId}
          toolLabel={
            translatedStudyTools.find((tool) => tool.id === pendingToolId)?.label ||
            pendingToolId
          }
          onSubmit={handleStudyToolDialogSubmit}
        />
      )}
    </div>
  );
}
