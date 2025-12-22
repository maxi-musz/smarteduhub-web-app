"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChapterFileUploadModal } from "./ChapterFileUploadModal";
import { useGeneralMaterialDetail } from "@/hooks/general-materials/use-general-material-detail";
import { Loader2 } from "lucide-react";
import type { GeneralMaterialDetailResponse } from "@/hooks/general-materials/use-general-material-detail";

interface ChapterFileUploadFromTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  onSuccess?: () => void;
}

export const ChapterFileUploadFromTableModal = ({
  isOpen,
  onClose,
  bookId,
  onSuccess,
}: ChapterFileUploadFromTableModalProps) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  const {
    data: bookData,
    isLoading,
    error,
  } = useGeneralMaterialDetail(bookId);

  const typedBookData: GeneralMaterialDetailResponse | undefined = bookData
    ? (bookData as unknown as GeneralMaterialDetailResponse)
    : undefined;

  const selectedChapter = typedBookData?.chapters.find(
    (ch) => ch.id === selectedChapterId
  );

  const handleFileUploadSuccess = () => {
    setSelectedChapterId(null);
    onClose();
    onSuccess?.();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload File to Chapter</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-red-600 mb-4">
              Failed to load chapters. Please try again.
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        ) : !typedBookData || typedBookData.chapters.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-brand-light-accent-1 mb-4">
              This book doesn't have any chapters yet. Please create a chapter first.
            </p>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        ) : !selectedChapterId ? (
          <div className="py-4">
            <p className="text-sm text-brand-light-accent-1 mb-4">
              Select a chapter to upload a file to:
            </p>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {typedBookData.chapters.map((chapter) => (
                <Button
                  key={chapter.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => setSelectedChapterId(chapter.id)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-brand-heading">
                      {chapter.title}
                    </div>
                    {chapter.description && (
                      <div className="text-xs text-brand-light-accent-1 mt-1">
                        {chapter.description}
                      </div>
                    )}
                    <div className="text-xs text-brand-light-accent-1 mt-1">
                      {chapter.files.length} file(s) uploaded
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : selectedChapter ? (
          <ChapterFileUploadModal
            isOpen={true}
            onClose={() => {
              setSelectedChapterId(null);
              onClose();
            }}
            materialId={bookId}
            chapterId={selectedChapter.id}
            chapterTitle={selectedChapter.title}
            onSuccess={handleFileUploadSuccess}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

