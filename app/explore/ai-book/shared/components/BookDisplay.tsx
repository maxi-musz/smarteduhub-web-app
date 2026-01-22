"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Maximize2, X, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface BookChapter {
  id: string;
  title: string;
  order: number;
}

export interface BookDisplayProps {
  bookTitle: string;
  chapters?: BookChapter[];
  selectedChapterId?: string;
  onChapterChange?: (chapterId: string) => void;
  onBack?: () => void;
  onFullScreen?: () => void;
  currentPage?: number;
  totalPages?: number;
  readingProgress?: number;
  showConnectionWarning?: boolean;
  onDismissConnectionWarning?: () => void;
  // PDF viewing props
  pdfUrl?: string | null; // URL to the PDF file
  chapterPageStart?: number; // Starting page for the selected chapter
  chapterPageEnd?: number; // Ending page for the selected chapter
  children?: React.ReactNode; // For custom content rendering (used if pdfUrl is not provided)
}

export function BookDisplay({
  bookTitle,
  chapters = [],
  selectedChapterId,
  onChapterChange,
  onBack,
  onFullScreen,
  currentPage = 1,
  totalPages = 1,
  readingProgress = 0,
  showConnectionWarning = false,
  onDismissConnectionWarning,
  pdfUrl,
  chapterPageStart,
  children,
}: BookDisplayProps) {
  const [isConnectionWarningDismissed, setIsConnectionWarningDismissed] = useState(false);

  const selectedChapter = chapters.find((ch) => ch.id === selectedChapterId);
  const displayTitle = selectedChapter?.title || bookTitle;
  const showWarning = showConnectionWarning && !isConnectionWarningDismissed;

  // Debug: Log chapters
  useEffect(() => {
    console.log("[BookDisplay] Chapters:", chapters);
    console.log("[BookDisplay] Selected Chapter ID:", selectedChapterId);
    console.log("[BookDisplay] Selected Chapter:", selectedChapter);
  }, [chapters, selectedChapterId, selectedChapter]);

  const handleDismissWarning = () => {
    setIsConnectionWarningDismissed(true);
    onDismissConnectionWarning?.();
  };

  return (
    <div className="flex-1 flex flex-col bg-white border-r border-red-200 overflow-hidden">
      {/* Navigation Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-brand-border">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="flex-shrink-0 h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {chapters.length > 0 ? (
              <Select
                value={selectedChapterId || ""}
                onValueChange={(value) => onChapterChange?.(value)}
              >
                <SelectTrigger className="w-full max-w-md border border-brand-border bg-white hover:bg-brand-bg focus:ring-2 focus:ring-brand-primary font-semibold text-brand-heading">
                  <SelectValue placeholder="Select a chapter...">
                    {selectedChapter ? (
                      <span className="truncate">{selectedChapter.title}</span>
                    ) : (
                      <span className="text-brand-light-accent-1">Select a chapter...</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <h2 className="font-semibold text-brand-heading truncate">{displayTitle}</h2>
            )}
          </div>
        </div>
        {onFullScreen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onFullScreen}
            className="flex-shrink-0 text-brand-light-accent-1 hover:text-brand-heading"
          >
            <Maximize2 className="h-4 w-4 mr-1.5" />
            Full Screen
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white">
        {/* Connection Warning Banner */}
        {showWarning && (
          <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 font-medium">
                Your internet connection is slow.
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismissWarning}
              className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Book Content */}
        {pdfUrl ? (
          /* PDF Viewer */
          <div className="h-full w-full">
            <iframe
              src={
                chapterPageStart
                  ? `${pdfUrl}#page=${chapterPageStart}`
                  : currentPage
                    ? `${pdfUrl}#page=${currentPage}`
                    : pdfUrl
              }
              className="w-full h-full border-0"
              title="Book PDF Viewer"
            />
          </div>
        ) : (
          /* Custom Content or Placeholder */
          <div className="p-6 max-w-4xl mx-auto">
            {children || (
              <div className="space-y-6">
                {/* Chapter Title */}
                {selectedChapter && (
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-brand-heading mb-2">
                      CHAPTER {selectedChapter.order}
                    </h1>
                    <h2 className="text-3xl font-bold text-brand-heading">
                      {selectedChapter.title.toUpperCase()}
                    </h2>
                  </div>
                )}

                {/* Placeholder Content */}
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="font-semibold text-blue-900 mb-2">Performance Objectives</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                      <li>Understand the key concepts of this chapter</li>
                      <li>Apply the knowledge to solve problems</li>
                      <li>Demonstrate mastery through practice</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h3 className="font-semibold text-blue-900 mb-2">Teaching and Learning Materials</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                      <li>Related resources and materials</li>
                      <li>Supplementary learning aids</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-3 border-t border-brand-border bg-white">
        <div className="flex items-center justify-between text-sm text-brand-light-accent-1">
          <span>
            Page {currentPage} of {totalPages} • {readingProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}
