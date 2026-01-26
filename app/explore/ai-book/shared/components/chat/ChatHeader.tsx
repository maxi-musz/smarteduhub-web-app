"use client";

import { CheckCircle2, AlertCircle, Loader2, RefreshCw, Settings, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatSettingsData } from "../ChatSettings";
import { saveStoredSettings } from "../ChatSettings";

interface ChatHeaderProps {
  bookTitle?: string;
  chapterTitle?: string;
  connectionStatus: "connected" | "connecting" | "error" | "disconnected";
  socketError?: string | null;
  translations: {
    connected: string;
    connecting: string;
    disconnected: string;
  };
  settings: ChatSettingsData;
  onSettingsChange: (settings: ChatSettingsData) => void;
  onSettingsOpen: () => void;
  onRetryConnection?: () => void;
}

export function ChatHeader({
  bookTitle,
  chapterTitle,
  connectionStatus,
  socketError,
  translations,
  settings,
  onSettingsChange,
  onSettingsOpen,
  onRetryConnection,
}: ChatHeaderProps) {
  const handleAutoPlayToggle = () => {
    const newSettings = { ...settings, autoPlayTTS: !settings.autoPlayTTS };
    onSettingsChange(newSettings);
    saveStoredSettings(newSettings);
  };

  return (
    <div className="px-4 py-3 border-b border-brand-border bg-gradient-to-r from-brand-primary/5 to-brand-primary/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-brand-heading text-lg">iBookGPT®</h2>
          <button
            onClick={handleAutoPlayToggle}
            className={`flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-200 ${
              settings.autoPlayTTS
                ? "bg-brand-primary text-white shadow-md hover:bg-brand-primary-hover hover:shadow-lg"
                : "bg-white border-2 border-brand-border text-brand-light-accent-1 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-bg"
            }`}
            title={settings.autoPlayTTS ? "Disable auto-play TTS" : "Enable auto-play TTS"}
          >
            {settings.autoPlayTTS ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* Connection Status Indicator */}
          {connectionStatus === "connected" && (
            <>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-50 border border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">{translations.connected}</span>
              </div>
              <Button
                onClick={onSettingsOpen}
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-brand-bg"
                title="Chat Settings"
              >
                <Settings className="h-4 w-4 text-brand-light-accent-1" />
              </Button>
            </>
          )}
          {connectionStatus === "connecting" && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 border border-amber-200">
              <Loader2 className="h-4 w-4 text-amber-600 animate-spin" />
              <span className="text-xs font-medium text-amber-700">{translations.connecting}</span>
            </div>
          )}
          {connectionStatus === "error" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-50 border border-red-200" title={socketError || "Connection failed"}>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-xs font-medium text-red-700">{translations.disconnected}</span>
              </div>
              {onRetryConnection && (
                <Button
                  onClick={onRetryConnection}
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                  title="Retry connection"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          )}
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
      {connectionStatus === "error" && socketError && (
        <p className="text-xs text-red-600 mt-1.5 font-medium">
          {socketError}
        </p>
      )}
    </div>
  );
}
