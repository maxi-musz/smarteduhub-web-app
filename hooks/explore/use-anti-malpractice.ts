import { useEffect, useRef, useState, useCallback } from "react";

export interface MalpracticeViolation {
  type: "tab_switch" | "window_blur" | "fullscreen_exit" | "copy" | "paste" | "context_menu" | "print" | "devtools";
  timestamp: Date;
  count: number;
}

export interface UseAntiMalpracticeOptions {
  onViolation?: (violation: MalpracticeViolation) => void;
  maxViolations?: number;
  enableFullscreen?: boolean;
  enableTabDetection?: boolean;
  enableCopyPaste?: boolean;
  enableContextMenu?: boolean;
  enablePrint?: boolean;
  enableDevTools?: boolean;
}

export function useAntiMalpractice(options: UseAntiMalpracticeOptions = {}) {
  const {
    onViolation,
    maxViolations = 3,
    enableFullscreen = true,
    enableTabDetection = true,
    enableCopyPaste = true,
    enableContextMenu = true,
    enablePrint = true,
    enableDevTools = true,
  } = options;

  const [violations, setViolations] = useState<MalpracticeViolation[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [violationCounts, setViolationCounts] = useState<Record<string, number>>({});
  const violationCountsRef = useRef<Record<string, number>>({});

  // Track violation
  const trackViolation = useCallback(
    (type: MalpracticeViolation["type"]) => {
      const count = (violationCountsRef.current[type] || 0) + 1;
      violationCountsRef.current[type] = count;
      setViolationCounts((prev) => ({ ...prev, [type]: count }));

      const violation: MalpracticeViolation = {
        type,
        timestamp: new Date(),
        count,
      };

      setViolations((prev) => [...prev, violation]);
      onViolation?.(violation);
    },
    [onViolation]
  );

  // Fullscreen detection
  useEffect(() => {
    if (!enableFullscreen) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      if (!isCurrentlyFullscreen && isFullscreen) {
        trackViolation("fullscreen_exit");
      }
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [enableFullscreen, isFullscreen, trackViolation]);

  // Tab/window blur detection
  useEffect(() => {
    if (!enableTabDetection) return;

    const handleBlur = () => {
      trackViolation("window_blur");
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackViolation("tab_switch");
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enableTabDetection, trackViolation]);

  // Copy/Paste prevention
  useEffect(() => {
    if (!enableCopyPaste) return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      trackViolation("copy");
      return false;
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      trackViolation("paste");
      return false;
    };

    const handleCut = (e: ClipboardEvent) => {
      e.preventDefault();
      trackViolation("copy");
      return false;
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("cut", handleCut);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("cut", handleCut);
    };
  }, [enableCopyPaste, trackViolation]);

  // Context menu prevention
  useEffect(() => {
    if (!enableContextMenu) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      trackViolation("context_menu");
      return false;
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enableContextMenu, trackViolation]);

  // Print prevention
  useEffect(() => {
    if (!enablePrint) return;

    const handleBeforePrint = (e: Event) => {
      e.preventDefault();
      trackViolation("print");
      return false;
    };

    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, [enablePrint, trackViolation]);

  // DevTools detection (basic)
  useEffect(() => {
    if (!enableDevTools) return;

    let devtools = { open: false };
    const element = new Image();
    Object.defineProperty(element, "id", {
      get: function () {
        devtools.open = true;
        trackViolation("devtools");
        return "";
      },
    });

    const checkDevTools = setInterval(() => {
      devtools.open = false;
      console.log(element);
      console.clear();
      if (devtools.open) {
        trackViolation("devtools");
      }
    }, 1000);

    return () => {
      clearInterval(checkDevTools);
    };
  }, [enableDevTools, trackViolation]);

  // Keyboard shortcuts prevention
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+P
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && (e.key === "u" || e.key === "s" || e.key === "p" || e.key === "P"))
      ) {
        e.preventDefault();
        if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J"))) {
          trackViolation("devtools");
        }
        if (e.ctrlKey && e.key === "p") {
          trackViolation("print");
        }
        return false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [trackViolation]);

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if ((element as any).webkitRequestFullscreen) {
        await (element as any).webkitRequestFullscreen();
      } else if ((element as any).mozRequestFullScreen) {
        await (element as any).mozRequestFullScreen();
      } else if ((element as any).msRequestFullscreen) {
        await (element as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error("Failed to exit fullscreen:", error);
    }
  }, []);

  const totalViolations = violations.length;
  const hasExceededMax = totalViolations >= maxViolations;

  return {
    violations,
    violationCounts,
    totalViolations,
    hasExceededMax,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
  };
}

