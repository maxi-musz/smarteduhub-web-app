"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { markdownToPlainText } from "./utils";
import type { ChatSettingsData } from "../ChatSettings";

interface PreparedAudio {
  audio: HTMLAudioElement;
  url: string;
}

export function useTTS(settings: ChatSettingsData) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [loadingTtsMessageId, setLoadingTtsMessageId] = useState<string | null>(null);
  const [autoPlayedMessageIds, setAutoPlayedMessageIds] = useState<Set<string>>(new Set());
  const [preparedAudioRefs, setPreparedAudioRefs] = useState<Map<string, PreparedAudio>>(new Map());
  const [preparingTtsMessageIds, setPreparingTtsMessageIds] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  // Prepare TTS audio (call API immediately, but don't play yet)
  const prepareTTSAudio = async (messageId: string, content: string) => {
    // Prevent duplicate calls
    if (preparedAudioRefs.has(messageId) || preparingTtsMessageIds.has(messageId)) {
      console.log('[useTTS] TTS already prepared or preparing for message:', messageId);
      return;
    }

    setPreparingTtsMessageIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(messageId);
      return newSet;
    });

    try {
      setLoadingTtsMessageId(messageId);
      
      const plainText = markdownToPlainText(content);
      const textToSpeak = plainText.length > 4096 ? plainText.substring(0, 4096) : plainText;

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      const endpoint = backendUrl.includes('/api/v1') 
        ? '/explore/chat/tts/speak'
        : '/api/v1/explore/chat/tts/speak';
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToSpeak,
          voice: settings.ttsVoice || "alloy",
          speed: settings.ttsSpeed || 1.0,
          language: settings.language || "en",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "TTS request failed" }));
        throw new Error(errorData.message || `TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      
      if (audioBlob.size === 0) {
        throw new Error('Received empty audio blob');
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      setPreparedAudioRefs((prev) => {
        const newMap = new Map(prev);
        newMap.set(messageId, { audio, url: audioUrl });
        return newMap;
      });

      setLoadingTtsMessageId(null);
      console.log('[useTTS] TTS audio prepared for message:', messageId);
    } catch (error) {
      console.error("TTS preparation error:", error);
      setLoadingTtsMessageId(null);
    } finally {
      setPreparingTtsMessageIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  // Play prepared TTS audio
  const playPreparedAudio = async (messageId: string) => {
    const prepared = preparedAudioRefs.get(messageId);
    if (!prepared) {
      console.warn('[useTTS] No prepared audio found for message:', messageId);
      return;
    }

    // Stop any currently playing audio FIRST
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      audioRef.current = null;
    }
    
    // Also stop any other prepared audio that might be playing
    preparedAudioRefs.forEach(({ audio: otherAudio }, otherId) => {
      if (otherId !== messageId && !otherAudio.paused) {
        otherAudio.pause();
        otherAudio.currentTime = 0;
      }
    });

    const { audio, url } = prepared;

    try {
      audioRef.current = audio;

      audio.onplay = () => {
        setPlayingMessageId(messageId);
      };

      audio.onended = () => {
        setPlayingMessageId(null);
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
        setPreparedAudioRefs((prev) => {
          const newMap = new Map(prev);
          newMap.delete(messageId);
          return newMap;
        });
        audioRef.current = null;
      };

      audio.onerror = (error) => {
        console.error("Audio playback error:", error);
        setPlayingMessageId(null);
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
        setPreparedAudioRefs((prev) => {
          const newMap = new Map(prev);
          newMap.delete(messageId);
          return newMap;
        });
        audioRef.current = null;
      };

      audioUrlRef.current = url;
      await audio.play();
      console.log('[useTTS] Playing prepared TTS audio for message:', messageId);
    } catch (error) {
      console.error("Error playing prepared audio:", error);
      setPlayingMessageId(null);
    }
  };

  // Handle TTS playback (manual or fallback)
  const handlePlayTTS = async (messageId: string, content: string) => {
    // If already playing this message, stop it
    if (playingMessageId === messageId && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayingMessageId(null);
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      audioRef.current = null;
      return;
    }

    // Stop any currently playing audio FIRST
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      audioRef.current = null;
    }
    
    // Also stop any prepared audio that might be playing
    preparedAudioRefs.forEach(({ audio: otherAudio }, otherId) => {
      if (otherId !== messageId && !otherAudio.paused) {
        otherAudio.pause();
        otherAudio.currentTime = 0;
      }
    });

    try {
      setLoadingTtsMessageId(messageId);
      
      const plainText = markdownToPlainText(content);
      const textToSpeak = plainText.length > 4096 ? plainText.substring(0, 4096) : plainText;

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      if (!session?.user?.accessToken) {
        throw new Error("Authentication required");
      }

      const endpoint = backendUrl.includes('/api/v1') 
        ? '/explore/chat/tts/speak'
        : '/api/v1/explore/chat/tts/speak';
      
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textToSpeak,
          voice: settings.ttsVoice || "alloy",
          speed: settings.ttsSpeed || 1.0,
          language: settings.language || "en",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "TTS request failed" }));
        throw new Error(errorData.message || `TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      
      if (audioBlob.size === 0) {
        throw new Error('Received empty audio blob');
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setLoadingTtsMessageId(null);
        setPlayingMessageId(messageId);
      };

      audio.onended = () => {
        setPlayingMessageId(null);
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
        audioRef.current = null;
      };

      audio.onerror = (error) => {
        console.error("Audio playback error:", error);
        setLoadingTtsMessageId(null);
        setPlayingMessageId(null);
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
          audioUrlRef.current = null;
        }
        audioRef.current = null;
        toast({
          title: "Playback Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      };

      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setLoadingTtsMessageId(null);
      setPlayingMessageId(null);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to generate speech";
      toast({
        title: "TTS Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setPreparedAudioRefs((prev) => {
      prev.forEach(({ audio, url }) => {
        audio.pause();
        audio.currentTime = 0;
        URL.revokeObjectURL(url);
      });
      return new Map();
    });
    setPreparingTtsMessageIds(new Set());
    setPlayingMessageId(null);
    setAutoPlayedMessageIds(new Set());
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  return {
    playingMessageId,
    loadingTtsMessageId,
    autoPlayedMessageIds,
    preparedAudioRefs,
    setAutoPlayedMessageIds,
    prepareTTSAudio,
    playPreparedAudio,
    handlePlayTTS,
    cleanup,
  };
}
