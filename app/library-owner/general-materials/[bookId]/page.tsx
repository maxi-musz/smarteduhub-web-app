"use client";

import React, { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  useGeneralMaterialDetail,
  type GeneralMaterialDetailResponse,
} from "@/hooks/general-materials/use-general-material-detail";
import { BookViewer, type BookViewerData } from "@/components/books/BookViewer";
import { CreateGeneralMaterialChapterModal } from "../components/CreateGeneralMaterialChapterModal";
import { ChapterFileUploadModal } from "../components/ChapterFileUploadModal";

export default function BookDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookId = params.bookId as string;
  const chapterIdFromUrl = searchParams.get("chapter");
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [fileUploadState, setFileUploadState] = useState<{
    isOpen: boolean;
    chapterId: string;
    chapterTitle: string;
  } | null>(null);

  const {
    data: bookData,
    isLoading: isBookLoading,
    error: bookError,
    refetch: refetchBook,
  } = useGeneralMaterialDetail(bookId);

  // Type guard to ensure bookData is the correct type
  const typedBookData: GeneralMaterialDetailResponse | undefined = bookData
    ? (bookData as unknown as GeneralMaterialDetailResponse)
    : undefined;

  // Transform data for BookViewer
  const viewerData: BookViewerData | undefined = typedBookData
    ? {
        material: typedBookData.material,
        chapters: typedBookData.chapters,
      }
    : undefined;

  const handleChapterCreated = () => {
    setIsAddChapterModalOpen(false);
    refetchBook();
  };

  const handleFileUpload = (chapterId: string) => {
    const chapter = typedBookData?.chapters.find((ch) => ch.id === chapterId);
    if (chapter) {
      setFileUploadState({
        isOpen: true,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
      });
    }
  };

  const handleFileUploadSuccess = () => {
    setFileUploadState(null);
    refetchBook();
  };

  return (
    <>
      <BookViewer
        bookId={bookId}
        data={viewerData}
        isLoading={isBookLoading}
        error={bookError}
        onRetry={refetchBook}
        onAddChapter={() => setIsAddChapterModalOpen(true)}
        showAddChapter={true}
        onUploadFile={handleFileUpload}
        showUploadFile={true}
        initialChapterId={chapterIdFromUrl || undefined}
      />

      <CreateGeneralMaterialChapterModal
        isOpen={isAddChapterModalOpen}
        onClose={() => setIsAddChapterModalOpen(false)}
        materialId={bookId}
        onSuccess={handleChapterCreated}
      />

      {fileUploadState && (
        <ChapterFileUploadModal
          isOpen={fileUploadState.isOpen}
          onClose={() => setFileUploadState(null)}
          materialId={bookId}
          chapterId={fileUploadState.chapterId}
          chapterTitle={fileUploadState.chapterTitle}
          onSuccess={handleFileUploadSuccess}
        />
      )}
    </>
  );
}
