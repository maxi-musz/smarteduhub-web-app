"use client";

import React from "react";
import { MessageSquare, BookOpen, FileText } from "lucide-react";
import type { GeneralMaterialChapter } from "@/hooks/general-materials/use-general-material-detail";

interface BookDetailChatProps {
  selectedChapter: GeneralMaterialChapter | null;
  hasChapters: boolean;
  materialId?: string;
}

export function BookDetailChat({ selectedChapter, hasChapters }: BookDetailChatProps) {
  // ============================================
  // AI CHAT TEMPORARILY DISABLED FOR PRODUCTION
  // ============================================
  // All socket.io connections and API calls have been commented out
  // This will be re-enabled after first production release
  // ============================================

  // /* ========== ORIGINAL IMPORTS (COMMENTED OUT) ========== */
  // import React, { useState, useEffect, useRef, useCallback } from "react";
  // import { Button } from "@/components/ui/button";
  // import { Send, MessageSquare, Loader2, BookOpen, FileText, AlertCircle, Wifi, WifiOff, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
  // import { useSession } from "next-auth/react";
  // import { io, Socket } from "socket.io-client";
  // import ReactMarkdown from "react-markdown";
  // import type { GeneralMaterialChapter } from "@/hooks/general-materials/use-general-material-detail";

  // /* ========== ORIGINAL STATE AND REFS (COMMENTED OUT) ========== */
  // const chatEndRef = useRef<HTMLDivElement>(null);
  // const socketRef = useRef<Socket | null>(null);
  // const conversationIdRef = useRef<string | null>(null);
  // const hasLoadedHistoryRef = useRef(false);
  // const previousChapterRef = useRef<string | null>(null);
  // const accessTokenRef = useRef<string | null>(null);
  // const isConnectingRef = useRef(false);
  // const selectedChapterRef = useRef<GeneralMaterialChapter | null>(null);
  // const { data: session } = useSession();
  
  // const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  // const [inputMessage, setInputMessage] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);
  // const [isConnected, setIsConnected] = useState(false);
  // const [connectionError, setConnectionError] = useState<string | null>(null);
  // const [messageError, setMessageError] = useState<string | null>(null);
  // const [showDebugInfo, setShowDebugInfo] = useState(false);
  // const [isRetrying, setIsRetrying] = useState(false);
  // const [debugInfo, setDebugInfo] = useState<{
  //   backendUrl?: string;
  //   hasToken?: boolean;
  //   tokenLength?: number;
  //   socketId?: string;
  //   lastError?: string;
  // }>({});

  // /* ========== ORIGINAL SOCKET CONNECTION SETUP (COMMENTED OUT) ========== */
  // const setupSocketConnection = useCallback((forceReconnect = false) => {
  //   // ... all socket.io connection logic commented out
  // }, [session]);

  // /* ========== ORIGINAL USEEFFECTS (COMMENTED OUT) ========== */
  // useEffect(() => {
  //   // ... all socket connection and cleanup logic commented out
  // }, [session?.user?.accessToken, setupSocketConnection]);

  // /* ========== ORIGINAL MESSAGE HANDLERS (COMMENTED OUT) ========== */
  // const handleSendMessage = useCallback(() => {
  //   // ... all message sending logic commented out
  // }, [inputMessage, isLoading, selectedChapter]);

  // /* ========== ORIGINAL RENDER LOGIC (COMMENTED OUT) ========== */
  // // Full chat interface with messages, input, etc. commented out

  // ============================================
  // TEMPORARY "COMING SOON" UI
  // ============================================

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

  // ============================================
  // COMING SOON MESSAGE
  // ============================================
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
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-brand-primary" />
          </div>
          <h3 className="text-xl font-semibold text-brand-heading mb-3">
            AI Chat Coming Soon
          </h3>
          <p className="text-sm text-brand-light-accent-1 leading-relaxed mb-2">
            We&apos;re working on bringing you an amazing AI-powered study assistant that will help you chat with materials and get professional tutorials.
          </p>
          <p className="text-sm text-brand-light-accent-1 leading-relaxed">
            This feature will be available in a future update. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
