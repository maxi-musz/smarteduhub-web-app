"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, FileText, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneralMaterialChapter, GeneralMaterialDetail } from "@/hooks/general-materials/use-general-material-detail";

interface BookDetailPdfViewerProps {
  material: GeneralMaterialDetail;
  selectedChapter: GeneralMaterialChapter | null;
  hasChapters: boolean;
  onUploadFile?: (chapterId: string) => void;
}

export function BookDetailPdfViewer({
  material,
  selectedChapter,
  hasChapters,
  onUploadFile,
}: BookDetailPdfViewerProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  // Reset file index when chapter changes
  useEffect(() => {
    setSelectedFileIndex(0);
  }, [selectedChapter?.id]);
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
              This book doesn't have any chapters uploaded yet. Please add a chapter to start reading and chatting with the AI assistant.
            </p>
            <p className="text-xs text-brand-light-accent-1">
              Use the "Add Chapter" button in the header to create your first chapter.
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

  // Determine what to display
  const hasChapterFiles = selectedChapter && selectedChapter.files && selectedChapter.files.length > 0;
  const displayUrl = hasChapterFiles && selectedChapter.files[selectedFileIndex]
    ? selectedChapter.files[selectedFileIndex].url
    : material.url;
  const displayPage = hasChapterFiles
    ? undefined
    : selectedChapter?.pageStart || 1;

  return (
    <div className="flex-1 border-r border-brand-border bg-white overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-brand-heading mb-2">
                  {selectedChapter.title}
                </h2>
                {selectedChapter.description && (
                  <p className="text-sm text-brand-light-accent-1 mb-2">
                    {selectedChapter.description}
                  </p>
                )}
                {selectedChapter.pageStart && selectedChapter.pageEnd && (
                  <p className="text-xs text-brand-light-accent-1 mb-2">
                    Pages {selectedChapter.pageStart} - {selectedChapter.pageEnd}
                  </p>
                )}
              </div>
              {onUploadFile && (
                <Button
                  onClick={() => onUploadFile(selectedChapter.id)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add File
                </Button>
              )}
            </div>

            {/* Chapter Files List */}
            {hasChapterFiles && selectedChapter.files.length > 1 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                {selectedChapter.files.map((file, index) => (
                  <Button
                    key={file.id}
                    variant={selectedFileIndex === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFileIndex(index)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <FileText className="h-4 w-4" />
                    {file.title || file.fileName}
                  </Button>
                ))}
              </div>
            )}

            {/* No Files Message */}
            {selectedChapter && !hasChapterFiles && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      No files uploaded for this chapter
                    </p>
                    <p className="text-xs text-blue-700">
                      {onUploadFile
                        ? "Upload a file to display chapter-specific content, or the main book PDF will be shown with the chapter's page range."
                        : "The main book PDF is being displayed with the chapter's page range."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PDF Viewer */}
          <div className="w-full h-full min-h-[600px] border border-brand-border rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={displayPage ? `${displayUrl}#page=${displayPage}` : displayUrl}
              className="w-full h-full"
              title="PDF Viewer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

