"use client";

import React from "react";
import { BookOpen, FileText } from "lucide-react";
import type { GeneralMaterialChapter, GeneralMaterialDetail } from "@/hooks/general-materials/use-general-material-detail";

interface BookDetailPdfViewerProps {
  material: GeneralMaterialDetail;
  selectedChapter: GeneralMaterialChapter | null;
  hasChapters: boolean;
}

export function BookDetailPdfViewer({
  material,
  selectedChapter,
  hasChapters,
}: BookDetailPdfViewerProps) {
  if (!hasChapters) {
    return (
      <div className="flex-1 border-r border-brand-border bg-white overflow-hidden">
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-xl font-semibold text-brand-heading mb-2">
              No Chapters Available
            </h3>
            <p className="text-sm text-brand-light-accent-1 mb-4">
              This book doesn&apos;t have any chapters uploaded yet. Please add a chapter to start reading and chatting with the AI assistant.
            </p>
            <p className="text-xs text-brand-light-accent-1">
              Use the &quot;Add Chapter&quot; button in the header to create your first chapter.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedChapter) {
    return (
      <div className="flex-1 border-r border-brand-border bg-white overflow-hidden">
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-brand-primary" />
            </div>
            <h3 className="text-xl font-semibold text-brand-heading mb-2">
              Select a Chapter
            </h3>
            <p className="text-sm text-brand-light-accent-1">
              Please select a chapter from the dropdown above to view its content and start chatting with the AI assistant.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 border-r border-brand-border bg-white overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-brand-heading mb-2">
              {selectedChapter.title}
            </h2>
            {selectedChapter.description && (
              <p className="text-sm text-brand-light-accent-1 mb-4">
                {selectedChapter.description}
              </p>
            )}
            {selectedChapter.pageStart && selectedChapter.pageEnd && (
              <p className="text-xs text-brand-light-accent-1 mb-4">
                Pages {selectedChapter.pageStart} - {selectedChapter.pageEnd}
              </p>
            )}
          </div>

          {/* PDF Viewer */}
          <div className="w-full h-full min-h-[600px] border border-brand-border rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={`${material.url}#page=${selectedChapter.pageStart || 1}`}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

