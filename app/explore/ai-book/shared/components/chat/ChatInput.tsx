"use client";

import { Send, SquareRadical, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  canSendMessage: boolean;
  isConnected: boolean;
  hasChapterSelected: boolean;
  useSocket: boolean;
  translations: {
    connectingToServer: string;
    selectChapterFirst: string;
    askQuestionPlaceholder: string;
  };
  disclaimer?: string;
}

export function ChatInput({
  inputMessage,
  onInputChange,
  onSend,
  canSendMessage,
  isConnected,
  hasChapterSelected,
  useSocket,
  translations,
  disclaimer,
}: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
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
          placeholder={
            !isConnected
              ? translations.connectingToServer
              : !hasChapterSelected && useSocket
              ? translations.selectChapterFirst
              : translations.askQuestionPlaceholder
          }
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={!canSendMessage}
          className="flex-1 bg-brand-bg border-brand-border focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <Button
          onClick={onSend}
          disabled={!inputMessage.trim() || !canSendMessage}
          size="icon"
          className="flex-shrink-0 bg-gradient-to-br from-brand-primary to-brand-primary/90 hover:from-brand-primary-hover hover:to-brand-primary shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          title={!isConnected ? "Please wait for connection..." : undefined}
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
  );
}
