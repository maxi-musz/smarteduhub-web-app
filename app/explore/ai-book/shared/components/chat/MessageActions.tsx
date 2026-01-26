"use client";

import { Copy, Check, Volume2, VolumeX, FileDown, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";

interface MessageActionsProps {
  messageId: string;
  content: string;
  copiedMessageId: string | null;
  playingMessageId: string | null;
  loadingTtsMessageId: string | null;
  onCopy: (messageId: string, content: string) => void;
  onPlayTTS: (messageId: string, content: string) => void;
  onDownloadPDF: (messageId: string, content: string) => void;
  onFeedback: (messageId: string) => void;
}

export function MessageActions({
  messageId,
  content,
  copiedMessageId,
  playingMessageId,
  loadingTtsMessageId,
  onCopy,
  onPlayTTS,
  onDownloadPDF,
  onFeedback,
}: MessageActionsProps) {
  return (
    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-brand-border/30">
      <button
        onClick={() => onCopy(messageId, content)}
        className="p-1.5 hover:bg-brand-bg rounded-md transition-colors group"
        title="Copy response"
      >
        {copiedMessageId === messageId ? (
          <Check className="h-3.5 w-3.5 text-green-500 transition-colors" />
        ) : (
          <Copy className="h-3.5 w-3.5 text-brand-light-accent-1 group-hover:text-brand-primary transition-colors" />
        )}
      </button>
      <button
        onClick={() => onPlayTTS(messageId, content)}
        disabled={loadingTtsMessageId === messageId}
        className="p-1.5 hover:bg-brand-bg rounded-md transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
        title={
          playingMessageId === messageId
            ? "Stop audio"
            : loadingTtsMessageId === messageId
            ? "Generating audio..."
            : "Play audio"
        }
      >
        {loadingTtsMessageId === messageId ? (
          <Loader2 className="h-3.5 w-3.5 text-brand-primary animate-spin" />
        ) : playingMessageId === messageId ? (
          <VolumeX className="h-3.5 w-3.5 text-brand-primary transition-colors" />
        ) : (
          <Volume2 className="h-3.5 w-3.5 text-brand-light-accent-1 group-hover:text-brand-primary transition-colors" />
        )}
      </button>
      <button
        onClick={() => onDownloadPDF(messageId, content)}
        className="p-1.5 hover:bg-brand-bg rounded-md transition-colors group"
        title="Download as PDF"
      >
        <FileDown className="h-3.5 w-3.5 text-brand-light-accent-1 group-hover:text-brand-primary transition-colors" />
      </button>
      <button
        onClick={() => onFeedback(messageId)}
        className="p-1.5 hover:bg-brand-bg rounded-md transition-colors group"
        title="Helpful"
      >
        <ThumbsUp className="h-3.5 w-3.5 text-brand-light-accent-1 group-hover:text-green-500 transition-colors" />
      </button>
      <button
        onClick={() => onFeedback(messageId)}
        className="p-1.5 hover:bg-brand-bg rounded-md transition-colors group"
        title="Not helpful"
      >
        <ThumbsDown className="h-3.5 w-3.5 text-brand-light-accent-1 group-hover:text-red-500 transition-colors" />
      </button>
    </div>
  );
}
