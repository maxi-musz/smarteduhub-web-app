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
} from "lucide-react";

export const PlayVideoPage = () => {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;

  const videoRef = useRef<HTMLVideoElement>(null);
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

  const { data: videoData, isLoading, error } = usePlayVideo(videoId);
  const trackProgress = useTrackWatchProgress();
  
  // Type assertion to ensure videoData is properly typed
  const video = videoData as VideoPlaybackData | undefined;

  // Initialize video when data loads
  useEffect(() => {
    if (video && videoRef.current && !hasInitialized) {
      const videoElement = videoRef.current;
      videoElement.src = video.videoUrl;

      // Set initial volume
      videoElement.volume = volume;
      videoElement.muted = isMuted;

      // Set playback rate
      videoElement.playbackRate = playbackRate;

      // Show resume dialog if video was previously watched
      if (video.hasViewedBefore && video.lastWatchPosition > 0 && !video.isCompleted) {
        setShowResumeDialog(true);
      } else {
        setHasInitialized(true);
      }
    }
  }, [video?.id, video?.videoUrl, volume, isMuted, playbackRate, hasInitialized, video]);

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

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("waiting", handleWaiting);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);
    videoElement.addEventListener("playing", handlePlay); // Also listen to 'playing' event
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("waiting", handleWaiting);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      videoElement.removeEventListener("playing", handlePlay);
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
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err);
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
              <video
                ref={videoRef}
                className="w-full aspect-video"
                onClick={handlePlayPause}
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
                  <div className="flex items-center justify-between">
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

