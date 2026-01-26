"use client";

import { MarkdownRenderer } from "../MarkdownRenderer";
import { TypewriterText } from "../TypewriterText";
import { MessageActions } from "./MessageActions";
import type { ChatMessage } from "./types";
import type { ChatSettingsData } from "../ChatSettings";

interface ChatMessageItemProps {
  message: ChatMessage;
  settings: ChatSettingsData;
  useSocketMessaging: boolean;
  copiedMessageId: string | null;
  playingMessageId: string | null;
  loadingTtsMessageId: string | null;
  preparedAudioRefs: Map<string, { audio: HTMLAudioElement; url: string }>;
  autoPlayedMessageIds: Set<string>;
  onMessageComplete: (messageId: string) => void;
  onCopy: (messageId: string, content: string) => void;
  onPlayTTS: (messageId: string, content: string) => void;
  onDownloadPDF: (messageId: string, content: string) => void;
  onFeedback: (messageId: string) => void;
  onPlayPreparedAudio: (messageId: string) => void;
}

export function ChatMessageItem({
  message,
  settings,
  useSocketMessaging,
  copiedMessageId,
  playingMessageId,
  loadingTtsMessageId,
  preparedAudioRefs,
  autoPlayedMessageIds,
  onMessageComplete,
  onCopy,
  onPlayTTS,
  onDownloadPDF,
  onFeedback,
  onPlayPreparedAudio,
}: ChatMessageItemProps) {
  const isUser = message.role === "user";
  const isInitial = message.id === "initial";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2.5 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-brand-primary to-brand-primary/90 text-white"
            : "bg-white border border-brand-border/50 text-brand-heading"
        }`}
      >
        {message.role === "assistant" ? (
          message.isTyping && !isInitial ? (
            <TypewriterText
              key={`typewriter-${message.id}`}
              text={message.content}
              speed={settings.typewriterSpeed || 20}
              showCursor={true}
              renderMarkdown={true}
              onComplete={() => {
                onMessageComplete(message.id);
                
                // Auto-play TTS when typewriter completes (if enabled and audio is prepared)
                if (
                  settings.autoPlayTTS && 
                  !autoPlayedMessageIds.has(message.id) &&
                  playingMessageId !== message.id
                ) {
                  // Check if audio is already prepared
                  const prepared = preparedAudioRefs.get(message.id);
                  if (prepared) {
                    // Play the prepared audio immediately
                    onPlayPreparedAudio(message.id);
                  } else {
                    // Fallback: if audio wasn't prepared, prepare and play now
                    setTimeout(() => {
                      onPlayTTS(message.id, message.content);
                    }, 300);
                  }
                }
              }}
            />
          ) : (
            <MarkdownRenderer content={message.content} />
          )
        ) : (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        )}
        {message.role === "assistant" && !isInitial && (
          <MessageActions
            messageId={message.id}
            content={message.content}
            copiedMessageId={copiedMessageId}
            playingMessageId={playingMessageId}
            loadingTtsMessageId={loadingTtsMessageId}
            onCopy={onCopy}
            onPlayTTS={onPlayTTS}
            onDownloadPDF={onDownloadPDF}
            onFeedback={onFeedback}
          />
        )}
      </div>
    </div>
  );
}
