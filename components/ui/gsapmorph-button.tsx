"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import gsap from "gsap";

import { cn } from "@/lib/utils";

const gsapMorphButtonVariants = cva(
  "animated-button relative inline-flex items-center justify-center gap-2 border-0 p-0 font-semibold text-sm outline-none cursor-pointer bg-transparent transition-[filter] duration-400",
  {
    variants: {
      variant: {
        default:
          "[--background:var(--color-brand-primary)] [--background-hover:var(--color-brand-primary-hover)] [--shadow:rgba(79,70,229,0.3)] [--shadow-hover:rgba(79,70,229,0.5)] [--text:#fff]",
        outline:
          "[--background:#fff] [--background-hover:#fff] [--border:var(--color-brand-border)] [--text:var(--color-brand-heading)] [--shadow:rgba(226,232,240,0.3)] [--shadow-hover:rgba(226,232,240,0.5)] [--scale-y:1.025]",
      },
      size: {
        default: "h-11",
        sm: "h-9 text-xs",
        lg: "h-12 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface GsapMorphButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof gsapMorphButtonVariants> {
  children: string; // Only accept string children (no icons)
}

const GsapMorphButton = React.forwardRef<
  HTMLButtonElement,
  GsapMorphButtonProps
>(({ className, variant, size, children, ...props }, ref) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const pathRef = React.useRef<SVGPathElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const isInRef = React.useRef(false);

  React.useImperativeHandle(ref, () => buttonRef.current!);

  React.useEffect(() => {
    if (
      !buttonRef.current ||
      !contentRef.current ||
      typeof children !== "string"
    )
      return;

    const contentDiv = contentRef.current;
    const letters = children.trim().split("");

    if (letters.length === 0) return;

    contentDiv.innerHTML = "";

    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      const part = index >= letters.length / 2 ? -1 : 1;
      const position =
        index >= letters.length / 2
          ? letters.length / 2 - index + (letters.length / 2 - 1)
          : index;
      const move = position / (letters.length / 2);
      const rotate = 1 - move;

      span.innerHTML = !letter.trim() ? "&nbsp;" : letter;
      span.style.setProperty("--move", move.toString());
      span.style.setProperty("--rotate", rotate.toString());
      span.style.setProperty("--part", part.toString());
      span.style.display = "block";
      span.style.backfaceVisibility = "hidden";
      span.style.transform = "translateZ(0)";

      contentDiv.appendChild(span);
    });
  }, [children]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!pathRef.current || isInRef.current) {
      props.onMouseEnter?.(e);
      return;
    }

    isInRef.current = true;
    buttonRef.current?.classList.add("in");

    const path = pathRef.current;
    gsap.to(path, {
      attr: {
        d: "M0 12C0 12 60 8 100 8C140 8 200 12 200 12V56C200 56 140 52 100 52C60 52 0 56 0 56V12Z",
      },
      ease: "power1.out",
      duration: 0.265,
      onComplete: () => {
        gsap.to(path, {
          attr: {
            d: "M0 12C0 12 60 12 100 12C140 12 200 12 200 12V56C200 56 140 56 100 56C60 56 0 56 0 56V12Z",
          },
          ease: "elastic.out(1, 0.5)",
          duration: 0.715,
        });
      },
    });

    // Animate text
    const spans = contentRef.current?.querySelectorAll("span");
    spans?.forEach((span) => {
      span.style.animation = "move 0.75s linear forwards";
    });

    props.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!pathRef.current || !isInRef.current) {
      props.onMouseLeave?.(e);
      return;
    }

    buttonRef.current?.classList.add("out");

    const path = pathRef.current;
    gsap.to(path, {
      attr: {
        d: "M0 12C0 12 60 16 100 16C140 16 200 12 200 12V56C200 56 140 60 100 60C60 60 0 56 0 56V12Z",
      },
      ease: "power1.out",
      duration: 0.265,
      onComplete: () => {
        gsap.to(path, {
          attr: {
            d: "M0 12C0 12 60 12 100 12C140 12 200 12 200 12V56C200 56 140 56 100 56C60 56 0 56 0 56V12Z",
          },
          ease: "elastic.out(1, 0.5)",
          duration: 0.715,
          onComplete: () => {
            buttonRef.current?.classList.remove("in", "out");
            isInRef.current = false;
          },
        });
      },
    });

    // Animate text out
    const spans = contentRef.current?.querySelectorAll("span");
    spans?.forEach((span) => {
      span.style.animation = "move-out 0.75s linear forwards";
    });

    props.onMouseLeave?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={cn(gsapMorphButtonVariants({ variant, size, className }))}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={
        {
          color: "var(--text)",
          filter: "drop-shadow(0 2px 5px var(--s, var(--shadow)))",
          WebkitTapHighlightColor: "transparent",
          "--webkit-tap-highlight-color": "transparent",
          borderRadius: "10px",
          overflow: "hidden",
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Left edge */}
      <span
        className={cn(
          "block w-3 bg-[var(--b,var(--background))] transition-[background] duration-400",
          "origin-left scale-x-[1.04] scale-y-[var(--scale-y,1)]",
          variant === "outline" && "border border-[var(--border)] border-r-0"
        )}
        style={{
          height: size === "sm" ? "36px" : size === "lg" ? "48px" : "44px",
          borderTopLeftRadius: "10px",
          borderBottomLeftRadius: "10px",
        }}
      />

      {/* SVG morphing shape */}
      <svg
        preserveAspectRatio="none"
        viewBox="0 0 200 68"
        className="absolute pointer-events-none fill-[var(--b,var(--background))] transition-[fill] duration-400"
        style={{
          width: "calc(100% - 24px)",
          height: size === "sm" ? "60px" : size === "lg" ? "76px" : "68px",
          left: "12px",
          right: "12px",
          top: size === "sm" ? "-10px" : size === "lg" ? "-14px" : "-12px",
        }}
      >
        <path
          ref={pathRef}
          d="M0 12C0 12 60 12 100 12C140 12 200 12 200 12V56C200 56 140 56 100 56C60 56 0 56 0 56V12Z"
          className={cn(
            variant === "outline" && "stroke-[var(--border)] stroke-[1px]"
          )}
          style={
            variant === "outline" ? { strokeDasharray: "200 44" } : undefined
          }
        />
      </svg>

      {/* Button content */}
      <div
        ref={contentRef}
        className="relative z-10 flex px-4 items-center justify-center"
        style={{ lineHeight: "20px" }}
      />

      {/* Right edge */}
      <span
        className={cn(
          "block w-3 bg-[var(--b,var(--background))] transition-[background] duration-400",
          "origin-right scale-x-[1.04] scale-y-[var(--scale-y,1)]",
          variant === "outline" && "border border-[var(--border)] border-l-0"
        )}
        style={{
          height: size === "sm" ? "36px" : size === "lg" ? "48px" : "44px",
          borderTopRightRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      />

      <style jsx>{`
        @keyframes move {
          22%,
          36% {
            transform: translateY(calc(-6px * var(--move))) translateZ(0)
              rotate(calc(-13deg * var(--rotate) * var(--part)));
          }
          50% {
            transform: translateY(calc(3px * var(--move))) translateZ(0)
              rotate(calc(6deg * var(--rotate) * var(--part)));
          }
          70% {
            transform: translateY(calc(-2px * var(--move))) translateZ(0)
              rotate(calc(-3deg * var(--rotate) * var(--part)));
          }
        }

        @keyframes move-out {
          22%,
          36% {
            transform: translateY(calc(6px * var(--move))) translateZ(0)
              rotate(calc(13deg * var(--rotate) * var(--part)));
          }
          50% {
            transform: translateY(calc(-3px * var(--move))) translateZ(0)
              rotate(calc(-6deg * var(--rotate) * var(--part)));
          }
          70% {
            transform: translateY(calc(2px * var(--move))) translateZ(0)
              rotate(calc(3deg * var(--rotate) * var(--part)));
          }
        }

        .animated-button.in:not(.out) {
          --b: var(--background-hover);
          --s: var(--shadow-hover);
        }
      `}</style>
    </button>
  );
});

GsapMorphButton.displayName = "GsapMorphButton";

export { GsapMorphButton, gsapMorphButtonVariants };
