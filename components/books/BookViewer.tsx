"use client";

import React, { useState, useEffect, useRef } from "react";
import { BookDetailHeader } from "./BookDetailHeader";
import { BookDetailPdfViewer } from "./BookDetailPdfViewer";
import { BookDetailChat } from "./BookDetailChat";
import { BookDetailLoading } from "./BookDetailLoading";
import { BookDetailError } from "./BookDetailError";
import { BookDetailNotFound } from "./BookDetailNotFound";
import type {
  GeneralMaterialDetail,
  GeneralMaterialChapter,
} from "@/hooks/general-materials/use-general-material-detail";

export interface BookViewerData {
  material: GeneralMaterialDetail;
  chapters: GeneralMaterialChapter[];
}

interface BookViewerProps {
  bookId: string;
  data: BookViewerData | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  onAddChapter?: (bookId: string) => void;
  showAddChapter?: boolean;
  onUploadFile?: (chapterId: string) => void;
  showUploadFile?: boolean;
  onBack?: () => void;
  initialChapterId?: string;
}

export function BookViewer({
  bookId,
  data,
  isLoading,
  error,
  onRetry,
  onAddChapter,
  showAddChapter = false,
  onUploadFile,
  showUploadFile = false,
  onBack,
  initialChapterId,
}: BookViewerProps) {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(
    initialChapterId || null
  );
  const [hasInitialized, setHasInitialized] = useState(false);
  const selectedChapterIdRef = useRef<string | null>(initialChapterId || null);

  // Update ref when selectedChapterId changes
  useEffect(() => {
    selectedChapterIdRef.current = selectedChapterId;
  }, [selectedChapterId]);

  // Set default chapter when book data loads (only once, or when data changes)
  useEffect(() => {
    if (data && data.chapters.length > 0) {
      if (!hasInitialized) {
        // First time initialization
        if (initialChapterId) {
          // Check if the initial chapter ID exists in the chapters
          const chapterExists = data.chapters.some((ch) => ch.id === initialChapterId);
          if (chapterExists) {
            setSelectedChapterId(initialChapterId);
            selectedChapterIdRef.current = initialChapterId;
          } else {
            // If initial chapter doesn't exist, fall back to first chapter
            setSelectedChapterId(data.chapters[0].id);
            selectedChapterIdRef.current = data.chapters[0].id;
          }
        } else {
          // No initial chapter ID, use first chapter
          setSelectedChapterId(data.chapters[0].id);
          selectedChapterIdRef.current = data.chapters[0].id;
        }
        setHasInitialized(true);
      } else {
        // After initialization, only check if the currently selected chapter still exists
        // This prevents resetting when user manually changes chapters
        const currentChapterId = selectedChapterIdRef.current;
        if (currentChapterId) {
          const currentChapterExists = data.chapters.some((ch) => ch.id === currentChapterId);
          if (!currentChapterExists) {
            // Current chapter no longer exists, reset to first chapter
            setSelectedChapterId(data.chapters[0].id);
            selectedChapterIdRef.current = data.chapters[0].id;
          }
        } else {
          // No chapter selected, set to first chapter
          setSelectedChapterId(data.chapters[0].id);
          selectedChapterIdRef.current = data.chapters[0].id;
        }
      }
    }
  }, [data, initialChapterId, hasInitialized]);

  if (isLoading) {
    return <BookDetailLoading />;
  }

  if (error) {
    return <BookDetailError error={error} onRetry={onRetry} />;
  }

  if (!data) {
    return <BookDetailNotFound />;
  }

  const selectedChapter = data.chapters.find(
    (ch) => ch.id === selectedChapterId
  ) || null;

  return (
    <div className="min-h-screen bg-brand-bg">
      <BookDetailHeader
        material={data.material}
        chapters={data.chapters}
        selectedChapterId={selectedChapterId}
        onChapterChange={setSelectedChapterId}
        onAddChapter={showAddChapter && onAddChapter ? () => onAddChapter(bookId) : undefined}
        onBack={onBack}
      />

      {/* Main Content - Split View */}
      <div className="flex h-[calc(100vh-80px)]">
        <BookDetailPdfViewer
          material={data.material}
          selectedChapter={selectedChapter}
          hasChapters={data.chapters.length > 0}
          onUploadFile={showUploadFile && onUploadFile ? onUploadFile : undefined}
        />
        <BookDetailChat
          selectedChapter={selectedChapter}
          hasChapters={data.chapters.length > 0}
          materialId={bookId}
        />
      </div>
    </div>
  );
}

