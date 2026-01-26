"use client";

import { BookOpen } from "lucide-react";
import { ChatMessageItem } from "./ChatMessageItem";
import { LoadingIndicator } from "./LoadingIndicator";
import type { ChatMessage } from "./types";
import type { ChatSettingsData } from "../ChatSettings";

interface ChatMessagesProps {
  messages: ChatMessage[];
  settings: ChatSettingsData;
  useSocket: boolean;
  hasChapterSelected: boolean;
  isConnected: boolean;
  isLoading: boolean;
  socketIsTyping: boolean;
  translations: {
    selectChapterFirst: string;
    initialMessageNoChapter: string;
    aiTyping: string;
    thinking: string;
  };
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
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatMessages({
  messages,
  settings,
  useSocket,
  hasChapterSelected,
  isConnected,
  isLoading,
  socketIsTyping,
  translations,
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
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-white to-brand-bg/30">
      {/* Show message when no chapter is selected and using socket */}
      {useSocket && !hasChapterSelected && isConnected && (
        <div className="flex justify-center items-center h-full min-h-[200px]">
          <div className="text-center max-w-md">
            <BookOpen className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium text-brand-heading mb-2">
              {translations.selectChapterFirst}
            </p>
            <p className="text-xs text-brand-light-accent-1">
              {translations.initialMessageNoChapter}
            </p>
          </div>
        </div>
      )}
      {messages.map((message) => (
        <ChatMessageItem
          key={message.id}
          message={message}
          settings={settings}
          copiedMessageId={copiedMessageId}
          playingMessageId={playingMessageId}
          loadingTtsMessageId={loadingTtsMessageId}
          preparedAudioRefs={preparedAudioRefs}
          autoPlayedMessageIds={autoPlayedMessageIds}
          onMessageComplete={onMessageComplete}
          onCopy={onCopy}
          onPlayTTS={onPlayTTS}
          onDownloadPDF={onDownloadPDF}
          onFeedback={onFeedback}
          onPlayPreparedAudio={onPlayPreparedAudio}
        />
      ))}
      {(isLoading || socketIsTyping) && (
        <LoadingIndicator
          text={socketIsTyping ? translations.aiTyping : translations.thinking}
        />
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
