"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  BookOpen,
  FileText,
  Lightbulb,
  SquareRadical,
  Square,
  ThumbsUp,
  ThumbsDown,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface StudyTool {
  id: string;
  label: string;
  iconColor: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface ChatInterfaceProps {
  bookTitle?: string;
  chapterTitle?: string;
  initialMessage?: string;
  messages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  studyTools?: StudyTool[];
  showStudyTools?: boolean;
  onStudyToolClick?: (toolId: string) => void;
  disclaimer?: string;
}

const defaultStudyTools: StudyTool[] = [
  {
    id: "chapter-summary",
    label: "Chapter Summary",
    iconColor: "text-blue-500",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "important-notes",
    label: "Important Notes for Exams",
    iconColor: "text-amber-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "revision-notes",
    label: "Revision Notes",
    iconColor: "text-green-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "common-mistakes",
    label: "Common Mistakes",
    iconColor: "text-red-500",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "study-tricks",
    label: "Study Tricks",
    iconColor: "text-purple-500",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "create-definitions",
    label: "Create Definitions / Concepts",
    iconColor: "text-indigo-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "create-question-paper",
    label: "Create Question Paper",
    iconColor: "text-orange-500",
    icon: <FileText className="h-4 w-4" />,
  },
];

const MIN_WIDTH = 350;
const MAX_WIDTH = 900;
const DEFAULT_WIDTH = 600;

export function ChatInterface({
  bookTitle,
  chapterTitle,
  initialMessage = "Hello! How can I assist you with the chapter today? Feel free to ask any questions you have.",
  messages = [],
  onSendMessage,
  isLoading = false,
  studyTools = defaultStudyTools,
  showStudyTools = true,
  onStudyToolClick,
  disclaimer = "iBookGPT's answers are based on the provided book and might have errors.",
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [selectedStudyTool, setSelectedStudyTool] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    if (inputMessage.trim() && onSendMessage && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStudyToolChange = (toolId: string) => {
    setSelectedStudyTool(toolId);
    onStudyToolClick?.(toolId);
    // Auto-send a message based on the tool
    if (onSendMessage) {
      const toolMessages: Record<string, string> = {
        "chapter-summary": "Please provide a summary of this chapter.",
        "important-notes": "What are the important notes for exams in this chapter?",
        "revision-notes": "Generate revision notes for this chapter.",
        "common-mistakes": "What are common mistakes students make in this chapter?",
        "study-tricks": "Share some study tricks for this chapter.",
        "create-definitions": "Create definitions and key concepts for this chapter.",
        "create-question-paper": "Create a question paper based on this chapter.",
      };
      const message = toolMessages[toolId] || `Help me with ${toolId}`;
      onSendMessage(message);
      setSelectedStudyTool(""); // Reset after sending
    }
  };

  const displayMessages = messages.length > 0 ? messages : [
    {
      id: "initial",
      role: "assistant" as const,
      content: initialMessage,
      timestamp: new Date(),
    },
  ];

  return (
    <div
      className="flex flex-col bg-white border-l border-brand-border h-full relative"
      style={{ width: `${width}px`, minWidth: `${MIN_WIDTH}px`, maxWidth: `${MAX_WIDTH}px` }}
    >
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        onMouseDown={handleMouseDown}
        className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize bg-brand-primary/20 hover:bg-brand-primary/40 border-l-2 border-brand-primary/50 hover:border-brand-primary transition-all z-10 group"
        style={{ marginLeft: "-4px" }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity">
          <GripVertical className="h-6 w-6 text-brand-primary drop-shadow-sm" />
        </div>
        {/* Additional visual indicator dots */}
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary/60"></div>
        <div className="absolute left-1/2 bottom-1/3 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary/60"></div>
      </div>

      {/* Header */}
      <div className="px-4 py-3 border-b border-brand-border bg-gradient-to-r from-brand-primary/5 to-brand-primary/10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-brand-heading text-lg">iBookGPT®</h2>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-brand-primary/20 flex items-center justify-center border border-brand-primary/30">
              <span className="text-xs font-semibold text-brand-primary">U</span>
            </div>
          </div>
        </div>
        {(bookTitle || chapterTitle) && (
          <p className="text-xs text-brand-light-accent-1 mt-1.5 font-medium">
            {chapterTitle || bookTitle}
          </p>
        )}
      </div>

      {/* Study Tools Dropdown */}
      {showStudyTools && (
        <div className="border-b border-brand-border bg-white px-4 py-3">
          <label className="block text-xs font-semibold text-brand-heading mb-2 uppercase tracking-wide">
            ✨ Study Tools
          </label>
          <Select value={selectedStudyTool} onValueChange={handleStudyToolChange}>
            <SelectTrigger className="w-full bg-brand-bg border-brand-border hover:bg-white focus:ring-2 focus:ring-brand-primary">
              <SelectValue placeholder="Select a study tool..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              {studyTools.map((tool) => (
                <SelectItem
                  key={tool.id}
                  value={tool.id}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex-shrink-0 ${tool.iconColor}`}>
                      {tool.icon}
                    </div>
                    <span className="text-sm">{tool.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Chat Messages Area */}
      <div
        ref={chatEndRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-white to-brand-bg/30"
      >
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2.5 shadow-sm ${
                message.role === "user"
                  ? "bg-gradient-to-br from-brand-primary to-brand-primary/90 text-white"
                  : "bg-white border border-brand-border/50 text-brand-heading"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              {message.role === "assistant" && message.id !== "initial" && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-brand-border/30">
                  <button
                    onClick={() => setShowFeedback(message.id)}
                    className="p-1.5 hover:bg-brand-bg rounded-md transition-colors group"
                    title="Helpful"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-brand-light-accent-1 group-hover:text-green-500 transition-colors" />
                  </button>
                  <button
                    onClick={() => setShowFeedback(message.id)}
                    className="p-1.5 hover:bg-brand-bg rounded-md transition-colors group"
                    title="Not helpful"
                  >
                    <ThumbsDown className="h-3.5 w-3.5 text-brand-light-accent-1 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-brand-border/50 rounded-lg px-4 py-2.5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs text-brand-light-accent-1 font-medium">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-brand-border bg-white p-4 space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              className="p-2 hover:bg-brand-bg rounded-md transition-colors group"
              title="Math equation"
            >
              <SquareRadical className="h-4 w-4 text-brand-light-accent-1 group-hover:text-brand-primary transition-colors" />
            </button>
            <button
              className="p-2 hover:bg-brand-bg rounded-md transition-colors group"
              title="Attach"
            >
              <Square className="h-4 w-4 text-brand-light-accent-1 group-hover:text-brand-primary transition-colors" />
            </button>
          </div>
          <Input
            type="text"
            placeholder="Ask any question about the chapter..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1 bg-brand-bg border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
          <Button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            className="flex-shrink-0 bg-gradient-to-br from-brand-primary to-brand-primary/90 hover:from-brand-primary-hover hover:to-brand-primary shadow-md"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {disclaimer && (
          <p className="text-xs text-brand-light-accent-1 text-center italic">
            {disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}
