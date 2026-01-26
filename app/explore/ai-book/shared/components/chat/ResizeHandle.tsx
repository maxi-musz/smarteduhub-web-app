"use client";

import { GripVertical } from "lucide-react";

interface ResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
}

export function ResizeHandle({ onMouseDown }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute left-0 top-0 bottom-0 w-2 cursor-col-resize bg-brand-primary/20 hover:bg-brand-primary/40 border-l-2 border-brand-primary/50 hover:border-brand-primary transition-all z-10 group"
      style={{ marginLeft: "-4px" }}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 transition-opacity">
        <GripVertical className="h-6 w-6 text-brand-primary drop-shadow-sm" />
      </div>
      {/* Additional visual indicator dots */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary/60"></div>
      <div className="absolute left-1/2 bottom-1/3 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary/60"></div>
    </div>
  );
}
