import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface UseScrollTabsOptions {
  totalTabs: number;
  enabled?: boolean;
}

interface UseScrollTabsReturn {
  currentTab: number;
  setCurrentTab: (index: number) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

export function useScrollTabs({
  totalTabs,
  enabled = true,
}: UseScrollTabsOptions): UseScrollTabsReturn {
  const [currentTab, setCurrentTab] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const isManualScrolling = useRef(false); // Track manual scrolling

  // Manual tab change handler (for clicking tabs)
  const handleSetCurrentTab = useCallback(
    (index: number) => {
      console.log("[Manual Tab Change] Clicked", {
        requestedIndex: index,
        isValid: index >= 0 && index < totalTabs,
      });
      if (index >= 0 && index < totalTabs) {
        // Immediately update the tab state
        setCurrentTab(index);

        // Mark as manual scrolling to disable snap temporarily
        isManualScrolling.current = true;

        // Scroll to the corresponding position
        if (scrollTriggerRef.current) {
          const targetProgress = index / (totalTabs - 1);
          const scrollDistance =
            scrollTriggerRef.current.end - scrollTriggerRef.current.start;
          const targetScroll =
            scrollTriggerRef.current.start + scrollDistance * targetProgress;

          console.log("[Manual Scroll] Details", {
            targetTab: index,
            targetProgress: targetProgress.toFixed(4),
            scrollStart: scrollTriggerRef.current.start,
            scrollEnd: scrollTriggerRef.current.end,
            scrollDistance,
            targetScroll,
          });

          // Use GSAP to scroll to the target position
          gsap.to(window, {
            scrollTo: {
              y: targetScroll,
              autoKill: false,
            },
            duration: 0.8,
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => {
              // Re-enable snapping after manual scroll completes
              setTimeout(() => {
                isManualScrolling.current = false;
                console.log("[Manual Scroll] Complete, snapping re-enabled");
              }, 100);
            },
          });
        }
      }
    },
    [totalTabs]
  );

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Setup GSAP ScrollTrigger
  useEffect(() => {
    if (!enabled || !containerRef.current || prefersReducedMotion) return;

    const container = containerRef.current;

    console.log("[ScrollTabs] Initializing ScrollTrigger", {
      totalTabs,
      enabled,
      prefersReducedMotion,
    });

    // Create a ScrollTrigger that:
    // 1. Pins the section when it comes into view
    // 2. Allows scrolling through tabs
    // 3. Unpins when all tabs are viewed
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: container,
      start: "top -50px", // Pin when top of container hits 30px above viewport top
      end: `+=${totalTabs * 100}%`, // Each tab gets 100vh of scroll
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 1, // Smooth scrubbing effect
      snap: {
        snapTo: (value) => {
          // Don't snap during manual scrolling
          if (isManualScrolling.current) {
            console.log("[Snap] Skipped - manual scrolling");
            return value; // Return current value, don't snap
          }

          // Create snap points for each tab
          const snapPoints = Array.from(
            { length: totalTabs },
            (_, i) => i / (totalTabs - 1)
          );

          // Find the closest snap point
          const snappedValue = snapPoints.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
          );

          // Calculate which tab index this corresponds to
          const tabIndex = Math.round(snappedValue * (totalTabs - 1));

          console.log("[Snap] Calculating snap point", {
            inputValue: value.toFixed(4),
            snapPoints: snapPoints.map((p) => p.toFixed(4)),
            snappedValue: snappedValue.toFixed(4),
            correspondingTab: tabIndex,
          });

          return snappedValue;
        },
        duration: 0.4,
        delay: 0.15, // Increased delay to give more scroll control
        ease: "power1.inOut",
      },
      onUpdate: (self) => {
        // Calculate which tab should be active based on scroll progress
        const progress = self.progress;
        // Use rounding instead of floor for better accuracy
        const newTab = Math.round(progress * (totalTabs - 1));
        const clampedTab = Math.max(0, Math.min(newTab, totalTabs - 1));

        const logDetails = {
          progress: progress.toFixed(4),
          progressRaw: progress,
          direction: self.direction,
          isActive: self.isActive,
          calculation: `${progress.toFixed(4)} * ${totalTabs - 1} = ${(
            progress *
            (totalTabs - 1)
          ).toFixed(4)}`,
          newTab,
          clampedTab,
        };

        // Extra logging for tab 3 (index 2)
        if (clampedTab === 2 || newTab === 2) {
          console.log("[Tab 3 Debug]", logDetails);
        }

        console.log("[ScrollTrigger] Update", logDetails);

        // Use functional update to avoid dependency on currentTab
        setCurrentTab((prevTab) => {
          if (clampedTab !== prevTab) {
            console.log("[Tab Change]", {
              from: prevTab,
              to: clampedTab,
              progress: progress.toFixed(4),
              expectedSnapPoint: (clampedTab / (totalTabs - 1)).toFixed(4),
            });
            return clampedTab;
          }
          return prevTab;
        });
      },
      onEnter: () => {
        console.log("[ScrollTrigger] Enter - Section pinned");
      },
      onLeave: () => {
        console.log("[ScrollTrigger] Leave - Section unpinned");
      },
      onEnterBack: () => {
        console.log("[ScrollTrigger] Enter Back");
      },
      onLeaveBack: () => {
        console.log("[ScrollTrigger] Leave Back");
      },
    });

    console.log("[ScrollTrigger] Created", {
      start: scrollTriggerRef.current.start,
      end: scrollTriggerRef.current.end,
      pin: scrollTriggerRef.current.pin,
    });

    return () => {
      console.log("[ScrollTrigger] Cleanup - Killing ScrollTrigger");
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, [enabled, totalTabs, prefersReducedMotion]); // REMOVED currentTab from dependencies!

  // Refresh ScrollTrigger on window resize
  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [enabled, prefersReducedMotion]);

  return {
    currentTab,
    setCurrentTab: handleSetCurrentTab,
    containerRef,
    contentRef,
  };
}
