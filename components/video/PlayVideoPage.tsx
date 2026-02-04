"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePlayVideo, type VideoPlaybackData } from "@/hooks/video/use-play-video";
import { useTrackWatchProgress } from "@/hooks/video/use-track-watch-progress";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Loader2,
  Clock,
  Eye,
  CheckCircle2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  AlertCircle,
} from "lucide-react";
import Hls from "hls.js";

export const PlayVideoPage = () => {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIdRef = useRef<string>(`session-${Date.now()}`);
  const isTrackingRef = useRef<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [bufferingEvents, setBufferingEvents] = useState(0);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [startedFromBeginning, setStartedFromBeginning] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isHlsReady, setIsHlsReady] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<{ height: number; bitrate: number; index: number }[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showQualityFeatureTooltip, setShowQualityFeatureTooltip] = useState(false);

  const { data: videoData, isLoading, error } = usePlayVideo(videoId);
  const trackProgress = useTrackWatchProgress();
  
  // Type assertion to ensure videoData is properly typed
  const video = videoData as VideoPlaybackData | undefined;
  
  // Debug: log when isHlsReady changes
  useEffect(() => {
    console.log("[Video Player] isHlsReady changed to:", isHlsReady);
  }, [isHlsReady]);

  // Feature discovery tooltip for quality selector
  useEffect(() => {
    if (qualityLevels.length === 0) return; // Only show when quality levels are available
    
    const STORAGE_KEY = "smarteduhub_quality_feature_tooltip";
    const MAX_SHOWS = 3;
    const MIN_INTERVAL_MS = 20 * 60 * 1000; // 20 minutes
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : { showCount: 0, lastShown: 0 };
      
      const now = Date.now();
      const timeSinceLastShow = now - data.lastShown;
      
      // Show if: shown less than 3 times AND (never shown OR 20+ mins since last show)
      if (data.showCount < MAX_SHOWS && (data.lastShown === 0 || timeSinceLastShow >= MIN_INTERVAL_MS)) {
        // Delay showing to let the player load first
        const timer = setTimeout(() => {
          setShowQualityFeatureTooltip(true);
          
          // Update localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            showCount: data.showCount + 1,
            lastShown: now
          }));
        }, 2000); // Show after 2 seconds
        
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("[Video Player] Error reading feature tooltip storage:", e);
    }
  }, [qualityLevels.length]);

  // Initialize video player (supports both HLS and MP4)
  const initializePlayer = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !video) {
      console.log("[Video Player] initializePlayer called but missing:", { 
        hasVideoElement: !!videoElement, 
        hasVideoData: !!video 
      });
      return;
    }

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      console.log("[Video Player] Destroying previous HLS instance");
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setVideoError(null);
    setIsHlsReady(false);

    console.log("[Video Player] ========== INITIALIZING ==========");
    console.log("[Video Player] Original Video URL:", video.videoUrl);
    console.log("[Video Player] Streaming Type from API:", video.streamingType);

    // Use video URL directly - CloudFront should have CORS configured
    const videoUrl = video.videoUrl;
    console.log("[Video Player] Using video URL:", videoUrl);

    // Determine if this is HLS content
    const isHls = video.streamingType === "hls" || videoUrl?.endsWith(".m3u8");
    console.log("[Video Player] Detected as HLS:", isHls);
    console.log("[Video Player] HLS.js supported:", Hls.isSupported());

    if (isHls) {
      if (Hls.isSupported()) {
        console.log("[Video Player] Using HLS.js");
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
          debug: false, // Disable debug logs in production
        });
        
        // Log all HLS events for debugging
        hls.on(Hls.Events.MEDIA_ATTACHING, () => {
          console.log("[Video Player] HLS: MEDIA_ATTACHING");
        });
        
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log("[Video Player] HLS: MEDIA_ATTACHED");
        });
        
        hls.on(Hls.Events.MANIFEST_LOADING, () => {
          console.log("[Video Player] HLS: MANIFEST_LOADING");
        });
        
        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          console.log("[Video Player] HLS: MANIFEST_LOADED");
        });
        
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log("[Video Player] HLS: MANIFEST_PARSED, levels:", data.levels.length);
          
          // Extract quality levels for manual selection
          const levels = data.levels.map((level, index) => ({
            height: level.height,
            bitrate: level.bitrate,
            index,
          }));
          // Sort by height (quality) descending
          levels.sort((a, b) => b.height - a.height);
          setQualityLevels(levels);
          console.log("[Video Player] Available quality levels:", levels);
          
          setIsHlsReady(true);
        });
        
        // Track when quality level changes (for Auto mode display)
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          console.log("[Video Player] HLS: LEVEL_SWITCHED to", data.level);
          if (currentQuality === -1) {
            // In auto mode, just log the switch
            const level = hls.levels[data.level];
            if (level) {
              console.log("[Video Player] Auto quality:", level.height + "p");
            }
          }
        });
        
        hls.on(Hls.Events.LEVEL_LOADED, () => {
          console.log("[Video Player] HLS: LEVEL_LOADED");
        });
        
        hls.on(Hls.Events.FRAG_LOADED, () => {
          console.log("[Video Player] HLS: FRAG_LOADED");
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("[Video Player] HLS ERROR:", data.type, data.details, data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setVideoError(`Network error: ${data.details}`);
                console.error("[Video Player] Fatal network error, trying to recover...");
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("[Video Player] Fatal media error, trying to recover...");
                hls.recoverMediaError();
                break;
              default:
                setVideoError(`Failed to load HLS stream: ${data.details}`);
                hls.destroy();
                break;
            }
          }
        });

        console.log("[Video Player] Calling hls.loadSource() with:", videoUrl);
        hls.loadSource(videoUrl);
        console.log("[Video Player] Calling hls.attachMedia()");
        hls.attachMedia(videoElement);
        
        hlsRef.current = hls;
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari has native HLS support
        console.log("[Video Player] Using native HLS support (Safari)");
        videoElement.src = videoUrl;
        setIsHlsReady(true);
      } else {
        console.error("[Video Player] HLS not supported in this browser");
        setVideoError("Your browser does not support HLS video playback.");
      }
    } else {
      // MP4 or other direct video - use regular src
      console.log("[Video Player] Loading as MP4/direct video");
      videoElement.src = videoUrl;
      // For non-HLS, we still wait for canplay event, but set a fallback
      console.log("[Video Player] Setting isHlsReady=true for non-HLS video");
      setIsHlsReady(true);
    }

    // Set initial volume
    videoElement.volume = volume;
    videoElement.muted = isMuted;

    // Set playback rate
    videoElement.playbackRate = playbackRate;
    
    console.log("[Video Player] ========== INIT COMPLETE ==========");
  }, [video, volume, isMuted, playbackRate]);

  // Initialize video when data loads
  useEffect(() => {
    console.log("[Video Player] Init useEffect triggered:", {
      hasVideo: !!video,
      hasVideoRef: !!videoRef.current,
      hasInitialized,
      videoUrl: video?.videoUrl
    });
    
    if (video && videoRef.current && !hasInitialized) {
      console.log("[Video Player] Calling initializePlayer()");
      initializePlayer();
      setHasInitialized(true); // Set immediately to prevent re-initialization

      // Show resume dialog if video was previously watched
      if (video.hasViewedBefore && video.lastWatchPosition > 0 && !video.isCompleted) {
        setShowResumeDialog(true);
      }
    }
    // NOTE: Cleanup moved to separate effect to prevent HLS destruction on re-render
  }, [video?.id, video?.videoUrl, hasInitialized, video, initializePlayer]);

  // Separate cleanup effect - only runs on unmount or video ID change
  useEffect(() => {
    const currentVideoId = video?.id;
    return () => {
      console.log("[Video Player] Cleanup effect running for video:", currentVideoId);
      if (hlsRef.current) {
        console.log("[Video Player] Destroying HLS instance on unmount/video change");
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [video?.id]); // Only cleanup when video ID changes or component unmounts

  // Attach event listeners to video element
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Update duration when metadata loads
    const handleLoadedMetadata = () => {
      if (videoElement.duration) {
        setDuration(videoElement.duration);
      }
    };

    // Video is ready to play - use as fallback for isHlsReady
    const handleCanPlay = () => {
      console.log("[Video Player] EVENT: canplay fired");
      setIsHlsReady(true);
    };
    
    // Additional debug events
    const handleLoadStart = () => {
      console.log("[Video Player] EVENT: loadstart");
    };
    
    const handleProgress = () => {
      console.log("[Video Player] EVENT: progress - buffered:", videoElement.buffered.length > 0 ? videoElement.buffered.end(0) : 0);
    };
    
    const handleError = (e: Event) => {
      const target = e.target as HTMLVideoElement;
      console.error("[Video Player] EVENT: error", target.error);
      if (target.error) {
        setVideoError(`Video error: ${target.error.message} (code: ${target.error.code})`);
      }
    };

    // Track time updates
    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      // Also update duration if not set yet
      if (!duration && videoElement.duration) {
        setDuration(videoElement.duration);
      }
    };

    // Track buffering
    const handleWaiting = () => {
      setBufferingEvents((prev) => prev + 1);
    };

    // Track play/pause - sync with actual video state
    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      // Track progress when user pauses
      if (video && videoElement) {
        const watchDurationSeconds = Math.floor(videoElement.currentTime);
        const lastWatchPosition = Math.floor(videoElement.currentTime);

        const isMobile = /Mobile|Android/i.test(navigator.userAgent);
        const isTablet = /Tablet|iPad/i.test(navigator.userAgent);
        const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

        const platform = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? "ios"
          : /Android/i.test(navigator.userAgent)
          ? "android"
          : "web";

        console.log("[Video Player] Tracking progress on pause:", {
          videoId: video.id,
          lastWatchPosition,
          watchDurationSeconds,
        });

        trackProgress.mutate({
          videoId: video.id,
          progress: {
            watchDurationSeconds,
            lastWatchPosition,
            deviceType,
            platform,
            referrerSource: "direct",
            videoQuality: "720p",
            playbackSpeed: videoElement.playbackRate,
            bufferingEvents,
            sessionId: sessionIdRef.current,
            userAgent: navigator.userAgent,
          },
        });
      }
    };

    // Track fullscreen changes (handler kept for potential future use)
    const handleFullscreenChange = () => {
      // Fullscreen change detected - can be used for UI updates if needed
      void document.fullscreenElement;
    };

    // Sync initial playing state
    if (videoElement.readyState >= 2) {
      // If metadata is already loaded
      if (videoElement.duration) {
        setDuration(videoElement.duration);
      }
      setIsPlaying(!videoElement.paused);
    }

    videoElement.addEventListener("loadstart", handleLoadStart);
    videoElement.addEventListener("progress", handleProgress);
    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("canplay", handleCanPlay);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("waiting", handleWaiting);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("playing", handlePlay);
    videoElement.addEventListener("error", handleError);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    console.log("[Video Player] Event listeners attached");

    return () => {
      videoElement.removeEventListener("loadstart", handleLoadStart);
      videoElement.removeEventListener("progress", handleProgress);
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("canplay", handleCanPlay);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("waiting", handleWaiting);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("playing", handlePlay);
      videoElement.removeEventListener("error", handleError);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [video, duration, trackProgress, bufferingEvents]);

  // Track watch progress periodically (every 10 seconds) while video is playing
  useEffect(() => {
    if (!video || !videoRef.current) {
      // Clear interval if video is not available
      if (progressIntervalRef.current) {
        console.log("[Video Player] Clearing interval - video not available");
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    const videoElement = videoRef.current;
    const videoId = video.id;
    
    // Function to track progress
    const trackWatchProgress = () => {
      // Double check video element still exists and is playing
      if (!videoRef.current || !video) {
        return;
      }

      const currentVideoElement = videoRef.current;
      if (currentVideoElement.paused || !isTrackingRef.current) {
        return;
      }

      const watchDurationSeconds = Math.floor(currentVideoElement.currentTime);
      const lastWatchPosition = Math.floor(currentVideoElement.currentTime);

      // Detect device type
      const isMobile = /Mobile|Android/i.test(navigator.userAgent);
      const isTablet = /Tablet|iPad/i.test(navigator.userAgent);
      const deviceType = isMobile
        ? "mobile"
        : isTablet
        ? "tablet"
        : "desktop";

      // Detect platform
      const platform = /iPhone|iPad|iPod/i.test(navigator.userAgent)
        ? "ios"
        : /Android/i.test(navigator.userAgent)
        ? "android"
        : "web";

      // Estimate video quality (simplified)
      const videoQuality = "720p"; // Could be enhanced to detect actual quality

      console.log("[Video Player] Calling backend to track progress:", {
        videoId,
        lastWatchPosition,
        watchDurationSeconds,
        isPaused: currentVideoElement.paused,
        endpoint: `/video/${videoId}/watch-progress`,
      });

      trackProgress.mutate({
        videoId,
        progress: {
          watchDurationSeconds,
          lastWatchPosition,
          deviceType,
          platform,
          referrerSource: "direct",
          videoQuality,
          playbackSpeed: currentVideoElement.playbackRate,
          bufferingEvents,
          sessionId: sessionIdRef.current,
          userAgent: navigator.userAgent,
        },
      });
    };

    // Start interval when video starts playing
    const startTracking = () => {
      if (isTrackingRef.current) {
        console.log("[Video Player] Already tracking, skipping");
        return;
      }

      // Clear any existing interval first
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      
      // Start new interval
      console.log("[Video Player] Starting progress tracking interval");
      isTrackingRef.current = true;
      const interval = setInterval(() => {
        trackWatchProgress();
      }, 10000); // Every 10 seconds
      progressIntervalRef.current = interval;
    };

    // Stop interval when video pauses
    const stopTracking = () => {
      console.log("[Video Player] Stopping progress tracking interval");
      isTrackingRef.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    // Check initial state and set up listeners
    if (!videoElement.paused) {
      startTracking();
    }

    // Listen to play/pause events to start/stop tracking
    videoElement.addEventListener("play", startTracking);
    videoElement.addEventListener("playing", startTracking);
    videoElement.addEventListener("pause", stopTracking);

    return () => {
      console.log("[Video Player] Cleaning up progress tracking");
      videoElement.removeEventListener("play", startTracking);
      videoElement.removeEventListener("playing", startTracking);
      videoElement.removeEventListener("pause", stopTracking);
      isTrackingRef.current = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  // Track final progress when component unmounts or video ends
  useEffect(() => {
    const currentVideo = video;
    const currentVideoRef = videoRef.current;
    const currentSessionId = sessionIdRef.current;
    const currentBufferingEvents = bufferingEvents;

    return () => {
      if (currentVideo && currentVideoRef) {
        const videoId = currentVideo.id;
        const lastWatchPosition = Math.floor(currentVideoRef.currentTime);
        const watchDurationSeconds = Math.floor(currentVideoRef.currentTime);

        const isMobile = /Mobile|Android/i.test(navigator.userAgent);
        const isTablet = /Tablet|iPad/i.test(navigator.userAgent);
        const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

        const platform = /iPhone|iPad|iPod/i.test(navigator.userAgent)
          ? "ios"
          : /Android/i.test(navigator.userAgent)
          ? "android"
          : "web";

        trackProgress.mutate({
          videoId,
          progress: {
            watchDurationSeconds,
            lastWatchPosition,
            deviceType,
            platform,
            referrerSource: "direct",
            videoQuality: "720p",
            playbackSpeed: currentVideoRef.playbackRate,
            bufferingEvents: currentBufferingEvents,
            sessionId: currentSessionId,
            userAgent: navigator.userAgent,
          },
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // Check if HLS is ready before attempting to play
        if (!isHlsReady) {
          console.log("[Video Player] Waiting for HLS to be ready...");
          return;
        }
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
          // Don't show error for AbortError as it's usually a race condition
          if (err.name !== "AbortError") {
            setVideoError(`Failed to play video: ${err.message}`);
          }
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      // -1 means Auto (let HLS.js decide)
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
      setShowQualityMenu(false);
      
      if (levelIndex === -1) {
        console.log("[Video Player] Quality set to Auto");
      } else {
        const level = hlsRef.current.levels[levelIndex];
        console.log("[Video Player] Quality set to", level?.height + "p");
      }
    }
  };

  const getQualityLabel = (height: number): string => {
    if (height >= 2160) return "4K";
    if (height >= 1440) return "1440p";
    if (height >= 1080) return "1080p";
    if (height >= 720) return "720p";
    if (height >= 480) return "480p";
    if (height >= 360) return "360p";
    return height + "p";
  };

  const handleBack = () => {
    // Navigate back - router.back() preserves URL state including topicId
    router.back();
  };

  const handleResume = () => {
    if (video && videoRef.current) {
      videoRef.current.currentTime = video.lastWatchPosition;
      setShowResumeDialog(false);
      setHasInitialized(true);
      setStartedFromBeginning(false);
    }
  };

  const handleStartFromBeginning = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setShowResumeDialog(false);
      setHasInitialized(true);
      setStartedFromBeginning(true); // Track that user chose to start from beginning
    }
  };

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }, []);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    let errorMessage = "Failed to load video";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 404) {
        errorMessage = "Video not found or not published";
      } else {
        errorMessage = error.message;
      }
    }

    return (
      <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Resume Dialog */}
      <AlertDialog open={showResumeDialog} onOpenChange={setShowResumeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume Watching?</AlertDialogTitle>
            <AlertDialogDescription>
              You were watching this video. Would you like to resume from{" "}
              <span className="font-semibold">
                {video ? formatTime(video.lastWatchPosition) : "0:00"}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStartFromBeginning}>
              Start from Beginning
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResume}>Resume</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {video?.isCompleted && (
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )}
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Video Player */}
        <Card>
          <CardContent className="p-0">
            <div
              className="relative bg-black group"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
              onMouseMove={() => setShowControls(true)}
            >
              {/* HLS Loading Overlay */}
              {!isHlsReady && !videoError && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-white mx-auto mb-2" />
                    <p className="text-white text-sm mb-3">Loading video stream...</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("[Video Player] User clicked Skip Loading");
                        setIsHlsReady(true);
                      }}
                      className="text-xs"
                    >
                      Skip Loading
                    </Button>
                    {video?.videoUrl && (
                      <p className="text-xs text-gray-400 mt-2 max-w-md break-all">
                        URL: {video.videoUrl}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* Video Error Overlay */}
              {videoError && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90">
                  <div className="text-center p-6 max-w-lg">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-white mb-2 font-medium">Video Playback Error</p>
                    <p className="text-gray-300 text-sm mb-4 break-all">{videoError}</p>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setVideoError(null);
                          initializePlayer();
                        }}
                        className="w-full"
                      >
                        Retry
                      </Button>
                      <p className="text-xs text-gray-400">
                        Try opening the video URL directly in your browser to test if it&apos;s accessible.
                      </p>
                      {video?.videoUrl && (
                        <div className="mt-2 p-2 bg-black/50 rounded border border-gray-600">
                          <p className="text-xs text-gray-400 mb-1">Video URL:</p>
                          <p className="text-xs text-blue-400 break-all select-all cursor-text">
                            {video.videoUrl}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <video
                ref={videoRef}
                className="w-full aspect-video"
                playsInline
                onClick={() => {
                  setShowQualityMenu(false);
                  handlePlayPause();
                }}
                onEnded={() => {
                  setIsPlaying(false);
                  // Track final progress when video ends
                  if (video && videoRef.current) {
                    const videoElement = videoRef.current;
                    const watchDurationSeconds = Math.floor(videoElement.duration);
                    const lastWatchPosition = Math.floor(videoElement.duration);

                    const isMobile = /Mobile|Android/i.test(navigator.userAgent);
                    const isTablet = /Tablet|iPad/i.test(navigator.userAgent);
                    const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

                    const platform = /iPhone|iPad|iPod/i.test(navigator.userAgent)
                      ? "ios"
                      : /Android/i.test(navigator.userAgent)
                      ? "android"
                      : "web";

                    trackProgress.mutate({
                      videoId: video.id,
                      progress: {
                        watchDurationSeconds,
                        lastWatchPosition,
                        deviceType,
                        platform,
                        referrerSource: "direct",
                        videoQuality: "720p",
                        playbackSpeed: videoElement.playbackRate,
                        bufferingEvents,
                        sessionId: sessionIdRef.current,
                        userAgent: navigator.userAgent,
                      },
                    });
                  }
                }}
              />

              {/* Video Overlay Controls */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity pointer-events-none ${showControls ? "opacity-100" : "opacity-0"}`}>
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 pointer-events-auto">
                  {/* Progress Bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-primary pointer-events-auto"
                    style={{
                      background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progressPercentage}%, #4B5563 ${progressPercentage}%, #4B5563 100%)`,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between relative">
                    {/* Feature Discovery Tooltip for Quality Selector */}
                    {showQualityFeatureTooltip && qualityLevels.length > 0 && (
                      <div 
                        className="absolute bottom-full right-0 mb-3 z-[100] animate-in fade-in slide-in-from-bottom-2 duration-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="bg-gradient-to-r from-brand-primary to-purple-600 text-white rounded-xl px-4 py-3 shadow-xl w-[260px] relative">
                          {/* Close button */}
                          <button
                            onClick={() => setShowQualityFeatureTooltip(false)}
                            className="absolute -top-2 -right-2 bg-white text-gray-700 hover:text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md hover:scale-110 transition-transform"
                          >
                            ×
                          </button>
                          
                          {/* Content */}
                          <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">✨</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm">New Feature!</p>
                              <p className="text-xs text-white/90 mt-1 leading-relaxed">
                                You can now change video quality! Tap the quality button below to switch between {qualityLevels.length} quality options.
                              </p>
                            </div>
                          </div>
                          
                          {/* Arrow pointing down to quality button */}
                          <div className="absolute -bottom-2 right-8 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-purple-600"></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayPause();
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>

                      <div className="flex items-center gap-2 text-white text-sm">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMuteToggle();
                        }}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </Button>

                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Quality Selector */}
                      {qualityLevels.length > 0 && (
                        <div className="relative">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowQualityMenu(!showQualityMenu);
                              setShowQualityFeatureTooltip(false); // Hide tooltip when menu is opened
                            }}
                          >
                            <span className="text-xs font-medium">
                              {currentQuality === -1 
                                ? "Auto" 
                                : getQualityLabel(qualityLevels.find(l => l.index === currentQuality)?.height || 0)}
                            </span>
                          </Button>
                          {showQualityMenu && (
                            <div 
                              className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-2 min-w-[140px] z-50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <p className="text-white text-xs px-2 py-1 font-semibold border-b border-gray-700 mb-1">Quality</p>
                              <button
                                onClick={() => handleQualityChange(-1)}
                                className={`w-full text-left text-white text-xs px-2 py-1.5 rounded hover:bg-white/20 flex items-center justify-between ${
                                  currentQuality === -1 ? "bg-brand-primary" : ""
                                }`}
                              >
                                <span>Auto</span>
                                {currentQuality === -1 && <span className="text-green-400">✓</span>}
                              </button>
                              {qualityLevels.map((level) => (
                                <button
                                  key={level.index}
                                  onClick={() => handleQualityChange(level.index)}
                                  className={`w-full text-left text-white text-xs px-2 py-1.5 rounded hover:bg-white/20 flex items-center justify-between ${
                                    currentQuality === level.index ? "bg-brand-primary" : ""
                                  }`}
                                >
                                  <span>{getQualityLabel(level.height)}</span>
                                  {currentQuality === level.index && <span className="text-green-400">✓</span>}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Settings (Playback Speed) */}
                      <div className="relative group/settings">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Settings className="h-5 w-5" />
                        </Button>
                        <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg p-2 opacity-0 invisible group-hover/settings:opacity-100 group-hover/settings:visible transition-all">
                          <div className="space-y-1 min-w-[120px]">
                            <p className="text-white text-xs px-2 py-1">Playback Speed</p>
                            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => handlePlaybackRateChange(rate)}
                                className={`w-full text-left text-white text-xs px-2 py-1 rounded hover:bg-white/20 ${
                                  playbackRate === rate ? "bg-brand-primary" : ""
                                }`}
                              >
                                {rate}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFullscreen();
                        }}
                      >
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-brand-heading mb-2 capitalize">
                  {video.title}
                </h1>
                {video.description && (
                  <p className="text-brand-light-accent-1 mb-4">{video.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm text-brand-light-accent-1">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {video.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(video.durationSeconds || 0)}
                  </span>
                  {video.size && <span>{video.size}</span>}
                  {video.isCompleted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {video.hasViewedBefore && video.lastWatchPosition > 0 && !startedFromBeginning && (
                    <Badge variant="outline">
                      Resumed from {formatTime(video.lastWatchPosition)}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Topic/Subject Info */}
            {(video.topic || video.subject) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-brand-heading mb-4">About</h3>
                  <div className="space-y-3">
                    {video.topic && (
                      <div>
                        <p className="text-sm text-brand-light-accent-1 mb-1">Topic</p>
                        <p className="font-medium capitalize">{video.topic.title}</p>
                        {video.topic.description && (
                          <p className="text-sm text-brand-light-accent-1 mt-1">
                            {video.topic.description}
                          </p>
                        )}
                      </div>
                    )}
                    {video.subject && (
                      <div>
                        <p className="text-sm text-brand-light-accent-1 mb-1">Subject</p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: video.subject.color }}
                          />
                          <p className="font-medium capitalize">
                            {video.subject.name} ({video.subject.code})
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-brand-heading mb-4">Video Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-brand-light-accent-1 mb-1">Type</p>
                    <Badge variant="outline" className="capitalize">
                      {video.videoType}
                    </Badge>
                  </div>
                  {video.platform && (
                    <div>
                      <p className="text-brand-light-accent-1 mb-1">Platform</p>
                      <p className="font-medium">{video.platform.name}</p>
                    </div>
                  )}
                  {video.school && (
                    <div>
                      <p className="text-brand-light-accent-1 mb-1">School</p>
                      <p className="font-medium">{video.school.school_name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-brand-light-accent-1 mb-1">Uploaded</p>
                    <p className="font-medium">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

