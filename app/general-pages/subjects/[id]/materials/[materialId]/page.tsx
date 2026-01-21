"use client";

import React from "react";
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTopicContent } from "@/hooks/subjects/use-topic-content";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { BookViewer, type BookViewerData } from "@/components/books/BookViewer";
import type {
  GeneralMaterialDetail,
  GeneralMaterialChapter,
} from "@/hooks/general-materials/use-general-material-detail";

const MaterialViewPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const materialId = params.materialId as string;
  const subjectId = params.id as string;
  const topicId = searchParams.get("topicId");

  const { data: topicContent, isLoading, error } = useTopicContent(topicId || null);

  // Find the material from topic content
  const material = topicContent?.materials.find((m) => m.id === materialId);

  // Determine base path for navigation
  const getBasePath = () => {
    if (pathname.startsWith("/teacher")) return "/teacher";
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname.startsWith("/student")) return "/student";
    return "/general-pages";
  };

  const basePath = getBasePath();

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading material...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !material) {
    let errorMessage = "Failed to load material";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 404) {
        errorMessage = "Material not found";
      } else {
        errorMessage = error.message;
      }
    }

    return (
      <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  // Convert topic material to BookViewer format
  // Create a "virtual" general material from the topic material
  const adaptedMaterial: GeneralMaterialDetail = {
    id: material.id,
    title: material.title,
    description: material.description || null,
    author: null,
    isbn: null,
    publisher: null,
    materialType: material.url?.split(".").pop()?.toUpperCase() || "PDF",
    url: material.url || "",
    s3Key: "",
    sizeBytes: null,
    pageCount: null,
    thumbnailUrl: null,
    thumbnailS3Key: null,
    isAvailable: true,
    isAiEnabled: true, // Enable AI chat for topic materials
    status: "published",
    views: 0,
    downloads: material.downloads || 0,
    createdAt: material.createdAt || new Date().toISOString(),
    updatedAt: material.updatedAt || new Date().toISOString(),
    class: null,
    subject: null,
    uploadedBy: {
      id: "",
      email: "",
      first_name: "",
      last_name: "",
    },
    chapters: [],
  };

  // Create a single chapter from the material file
  const adaptedChapter: GeneralMaterialChapter = {
    id: `chapter-${material.id}`,
    title: material.title,
    description: material.description || null,
    pageStart: null,
    pageEnd: null,
    order: 1,
    isProcessed: true, // Assume processed for AI chat
    chunkCount: 0,
    createdAt: material.createdAt || new Date().toISOString(),
    updatedAt: material.updatedAt || new Date().toISOString(),
    files: [
      {
        id: `file-${material.id}`,
        fileName: material.url?.split("/").pop() || material.title,
        fileType: material.url?.split(".").pop()?.toUpperCase() || "PDF",
        url: material.url || "",
        sizeBytes: null,
        title: material.title,
        description: material.description || null,
        order: 1,
        createdAt: material.createdAt || new Date().toISOString(),
      },
    ],
  };

  // Add the chapter to the material
  adaptedMaterial.chapters = [adaptedChapter];

  const viewerData: BookViewerData = {
    material: adaptedMaterial,
    chapters: [adaptedChapter],
  };

  const handleBack = () => {
    router.push(`${basePath}/subjects/${subjectId}`);
  };

  return (
    <BookViewer
      bookId={material.id}
      data={viewerData}
      isLoading={false}
      error={null}
      onRetry={() => {}}
      onAddChapter={undefined}
      showAddChapter={false}
      onUploadFile={undefined}
      showUploadFile={false}
      onBack={handleBack}
      initialChapterId={adaptedChapter.id}
    />
  );
};

export default MaterialViewPage;
