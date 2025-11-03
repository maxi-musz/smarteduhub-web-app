import { useState, useEffect, useRef, useCallback } from "react";

interface UseScrollTabsOptions {
  totalTabs: number;
  lockDuration?: number;
  scrollThreshold?: number;
  enabled?: boolean;
}

interface UseScrollTabsReturn {
  currentTab: number;
  isLocked: boolean;
  setCurrentTab: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isInView: boolean;
}

export function useScrollTabs({
  totalTabs,
  lockDuration = 800,
  scrollThreshold = 50,
  enabled = true,
}: UseScrollTabsOptions): UseScrollTabsReturn {
  const [currentTab, setCurrentTab] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef(0);
  const lastScrollTime = useRef(0);
  const scrollAccumulator = useRef(0); // Accumulate small scroll movements

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const actualLockDuration = prefersReducedMotion ? 0 : lockDuration;

  // Lock scrolling temporarily
  const lockScroll = useCallback(() => {
    setIsLocked(true);
    setTimeout(() => setIsLocked(false), actualLockDuration);
  }, [actualLockDuration]);

  // Navigate to next tab
  const goToNextTab = useCallback(() => {
    if (currentTab < totalTabs - 1 && !isLocked) {
      setCurrentTab((prev) => prev + 1);
      lockScroll();
      return true;
    }
    return false;
  }, [currentTab, totalTabs, isLocked, lockScroll]);

  // Navigate to previous tab
  const goToPrevTab = useCallback(() => {
    if (currentTab > 0 && !isLocked) {
      setCurrentTab((prev) => prev - 1);
      lockScroll();
      return true;
    }
    return false;
  }, [currentTab, isLocked, lockScroll]);

  // Handle wheel events (mouse scroll)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only handle if enabled and in view
      if (!enabled || !isInView) {
        return;
      }

      // Accumulate scroll delta for smoother detection
      scrollAccumulator.current += e.deltaY;

      console.log("Wheel event:", {
        deltaY: e.deltaY,
        accumulated: scrollAccumulator.current,
        threshold: scrollThreshold,
        isLocked,
        currentTab,
        isInView,
      });

      // Throttle scroll events - reduced to 50ms for better responsiveness
      const now = Date.now();
      if (now - lastScrollTime.current < 50) {
        console.log("Throttled - too fast");
        return;
      }

      if (!isLocked && Math.abs(scrollAccumulator.current) > scrollThreshold) {
        lastScrollTime.current = now;
        const scrollingDown = scrollAccumulator.current > 0;

        // Reset accumulator
        scrollAccumulator.current = 0;

        if (scrollingDown) {
          const handled = goToNextTab();
          console.log("Scroll down handled:", handled);
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
        } else {
          const handled = goToPrevTab();
          console.log("Scroll up handled:", handled);
          if (handled) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      } else {
        console.log("Not handling yet:", {
          reason: isLocked ? "locked" : "accumulating",
          threshold: scrollThreshold,
          accumulated: Math.abs(scrollAccumulator.current),
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      console.log("Attaching wheel listener to container, isInView:", isInView);
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        console.log("Removing wheel listener");
        scrollAccumulator.current = 0; // Reset on cleanup
        container.removeEventListener("wheel", handleWheel);
      };
    }
  }, [
    enabled,
    isInView,
    isLocked,
    goToNextTab,
    goToPrevTab,
    scrollThreshold,
    currentTab,
  ]);

  // Handle touch events (mobile)
  useEffect(() => {
    if (!enabled || !isInView) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isLocked) return;

      const touchEnd = e.touches[0].clientY;
      const diff = touchStartRef.current - touchEnd;

      if (Math.abs(diff) > scrollThreshold) {
        if (diff > 0) {
          const handled = goToNextTab();
          if (handled) {
            e.preventDefault();
            touchStartRef.current = touchEnd;
          }
        } else {
          const handled = goToPrevTab();
          if (handled) {
            e.preventDefault();
            touchStartRef.current = touchEnd;
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      return () => {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [enabled, isInView, isLocked, goToNextTab, goToPrevTab, scrollThreshold]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!enabled || !isInView) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        const handled = goToNextTab();
        if (handled) e.preventDefault();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        const handled = goToPrevTab();
        if (handled) e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, isInView, isLocked, goToNextTab, goToPrevTab]);

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        // Debug log
        console.log("Section in view:", entry.isIntersecting);
      },
      {
        threshold: 0.3, // Section must be 30% visible (more lenient)
        rootMargin: "0px", // No buffer for better detection
      }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
      return () => observer.unobserve(container);
    }
  }, [enabled]);

  return {
    currentTab,
    isLocked,
    setCurrentTab,
    containerRef,
    isInView,
  };
}
