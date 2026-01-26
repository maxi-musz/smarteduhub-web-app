"use client";

interface LoadingIndicatorProps {
  text: string;
}

export function LoadingIndicator({ text }: LoadingIndicatorProps) {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-brand-border/50 rounded-lg px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="h-2 w-2 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-xs text-brand-light-accent-1 font-medium">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
