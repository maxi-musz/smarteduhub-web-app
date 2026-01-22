"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MarkdownRenderer } from "./MarkdownRenderer";

export interface TypewriterTextProps {
  /**
   * The full text content to display with typewriter effect
   */
  text: string;
  /**
   * Typing speed in milliseconds per character (lower = faster)
   * Default: 20ms (50 chars/second)
   */
  speed?: number;
  /**
   * Whether to show a blinking cursor while typing
   * Default: true
   */
  showCursor?: boolean;
  /**
   * Callback fired when typing is complete
   */
  onComplete?: () => void;
  /**
   * Whether to render as markdown
   * Default: true
   */
  renderMarkdown?: boolean;
  /**
   * Custom className for the container
   */
  className?: string;
  /**
   * Whether to start typing immediately
   * Default: true
   */
  autoStart?: boolean;
  /**
   * Minimum delay between characters (for natural variation)
   * Default: 0 (no variation)
   */
  minDelay?: number;
  /**
   * Maximum delay between characters (for natural variation)
   * Default: 0 (no variation)
   */
  maxDelay?: number;
}

/**
 * Professional TypewriterText component that displays text with a typewriter effect
 * Similar to ChatGPT/Claude, with smooth character-by-character animation
 */
export function TypewriterText({
  text,
  speed = 20,
  showCursor = true,
  onComplete,
  renderMarkdown = true,
  className = "",
  autoStart = true,
  minDelay = 0,
  maxDelay = 0,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const textRef = useRef(text);
  const onCompleteRef = useRef(onComplete);
  
  // Keep refs in sync
  useEffect(() => {
    textRef.current = text;
    onCompleteRef.current = onComplete;
  }, [text, onComplete]);

  // Calculate delay with variation for natural typing feel
  const getDelay = useCallback(() => {
    const baseDelay = speed;
    if (minDelay === 0 && maxDelay === 0) {
      return baseDelay;
    }
    const variation = Math.random() * (maxDelay - minDelay) + minDelay;
    return baseDelay + variation;
  }, [speed, minDelay, maxDelay]);

  // Type the next character
  const typeNextCharacter = useCallback(() => {
    const currentText = textRef.current;
    if (!currentText || currentText.length === 0) {
      setIsTyping(false);
      onCompleteRef.current?.();
      return;
    }

    if (isPausedRef.current || currentIndexRef.current >= currentText.length) {
      if (currentIndexRef.current >= currentText.length) {
        setIsTyping(false);
        onCompleteRef.current?.();
      }
      return;
    }

    const nextChar = currentText[currentIndexRef.current];
    setDisplayedText((prev) => prev + nextChar);
    currentIndexRef.current += 1;

    const delay = getDelay();
    timeoutRef.current = setTimeout(() => {
      typeNextCharacter();
    }, delay);
  }, [getDelay]);

  // Auto-start when component mounts or text changes
  useEffect(() => {
    const currentText = textRef.current;
    if (!currentText || currentText.length === 0) {
      setDisplayedText("");
      onCompleteRef.current?.();
      return;
    }

    if (autoStart) {
      // Clean up any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Reset state
      setDisplayedText("");
      currentIndexRef.current = 0;
      setIsTyping(false);
      isPausedRef.current = false;
      
      // Start typing immediately (use requestAnimationFrame for better timing)
      requestAnimationFrame(() => {
        setIsTyping(true);
        typeNextCharacter();
      });
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, autoStart, typeNextCharacter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Ensure we always show something
  const contentToRender = displayedText;

  return (
    <div className={`typewriter-container ${className}`}>
      {contentToRender ? (
        renderMarkdown ? (
          <MarkdownRenderer content={contentToRender} />
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{contentToRender}</div>
        )
      ) : isTyping ? (
        // Show cursor even when no text yet (typing is starting)
        <span className="inline-block">
          <span
            className="inline-block w-0.5 h-4 bg-brand-primary animate-pulse align-middle"
            style={{ animationDuration: "1s" }}
            aria-hidden="true"
          />
        </span>
      ) : null}
      {showCursor && isTyping && contentToRender && (
        <span
          className="inline-block w-0.5 h-4 bg-brand-primary ml-0.5 animate-pulse align-middle"
          style={{ animationDuration: "1s" }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
