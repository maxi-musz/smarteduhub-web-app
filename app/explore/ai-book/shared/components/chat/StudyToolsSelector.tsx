"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { StudyTool } from "./types";

interface StudyToolsSelectorProps {
  studyTools: StudyTool[];
  selectedTool: string;
  onToolChange: (toolId: string) => void;
  disabled?: boolean;
  placeholder: string;
}

export function StudyToolsSelector({
  studyTools,
  selectedTool,
  onToolChange,
  disabled = false,
  placeholder,
}: StudyToolsSelectorProps) {
  return (
    <div className="border-b border-brand-border bg-white px-4 py-3">
      <label className="block text-xs font-semibold text-brand-heading mb-2 uppercase tracking-wide">
        ✨ Study Tools
      </label>
      <Select value={selectedTool} onValueChange={onToolChange} disabled={disabled}>
        <SelectTrigger className="w-full bg-brand-bg border-brand-border hover:bg-white focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {studyTools.map((tool) => (
            <SelectItem
              key={tool.id}
              value={tool.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 ${tool.iconColor}`}>
                  {tool.icon}
                </div>
                <span className="text-sm">{tool.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
