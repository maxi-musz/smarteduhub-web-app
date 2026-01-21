"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Loader2, BookOpen } from "lucide-react";
import type { GeneralMaterialChapter } from "@/hooks/general-materials/use-general-material-detail";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface BookDetailChatProps {
  selectedChapter: GeneralMaterialChapter | null;
  hasChapters: boolean;
}

export function BookDetailChat({ selectedChapter, hasChapters }: BookDetailChatProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Reset chat and initialize with chapter-specific message when chapter changes
  useEffect(() => {
    if (selectedChapter) {
      setChatMessages([
        {
          id: "1",
          role: "assistant",
          content: `Hello! I'm your AI study assistant for "${selectedChapter.title}". I can help you understand concepts, answer questions, and provide explanations about this chapter. How can I assist you today?`,
          timestamp: new Date(),
        },
      ]);
      setInputMessage("");
    } else {
      setChatMessages([]);
      setInputMessage("");
    }
  }, [selectedChapter]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !selectedChapter) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${userMessage.content}". Based on the content from "${selectedChapter.title}", here's a helpful explanation... (This is a mock response. In production, this would connect to your AI service with the chapter's context.)`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

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
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-brand-primary text-white"
                  : "bg-brand-bg text-brand-heading"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">U</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-4 w-4 text-brand-primary" />
            </div>
            <div className="bg-brand-bg rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                <p className="text-sm text-brand-light-accent-1">
                  Thinking...
                </p>
              </div>
            </div>
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
            placeholder={`Ask a question about "${selectedChapter.title}"...`}
            className="flex-1 min-h-[60px] max-h-[120px] rounded-md border border-brand-border bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
            rows={2}
            disabled={!selectedChapter || isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || !selectedChapter}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-brand-light-accent-1 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

