"use client";

import { RefreshCw } from "lucide-react";

interface Class {
  id: string;
  name: string;
}

interface ClassSelectorProps {
  classes: Class[];
  selectedClass: string;
  isLoading: boolean;
  isLoadingSchedule: boolean;
  onClassChange: (classId: string) => void;
}

export const ClassSelector = ({
  classes,
  selectedClass,
  isLoading,
  isLoadingSchedule,
  onClassChange,
}: ClassSelectorProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-brand-light-accent-1">
        <RefreshCw className="w-4 h-4 animate-spin" />
        Loading classes...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      {classes.map((cls) => (
        <button
          key={cls.id}
          type="button"
          disabled={isLoadingSchedule}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors relative
            ${
              selectedClass === cls.id
                ? "bg-brand-primary text-white"
                : "border border-brand-border bg-white text-brand-light-accent-1 cursor-pointer hover:bg-gray-50"
            }
            ${isLoadingSchedule ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onClick={() => onClassChange(cls.id)}
        >
          {cls.name}
          {isLoadingSchedule && selectedClass === cls.id && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

