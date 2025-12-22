"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, BookOpen, Plus } from "lucide-react";
import type {
  GeneralMaterialDetail,
  GeneralMaterialChapter,
} from "@/hooks/general-materials/use-general-material-detail";

interface BookDetailHeaderProps {
  material: GeneralMaterialDetail;
  chapters: GeneralMaterialChapter[];
  selectedChapterId: string | null;
  onChapterChange: (chapterId: string) => void;
  onAddChapter: () => void;
}

export function BookDetailHeader({
  material,
  chapters,
  selectedChapterId,
  onChapterChange,
  onAddChapter,
}: BookDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-brand-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="-ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-brand-heading line-clamp-1">
              {material.title}
            </h1>
            {material.author && (
              <p className="text-sm text-brand-light-accent-1">
                by {material.author}
              </p>
            )}
          </div>
        </div>

        {/* Chapter Selector and Add Chapter Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-brand-light-accent-1" />
            <Select
              value={selectedChapterId || undefined}
              onValueChange={onChapterChange}
              disabled={chapters.length === 0}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue 
                  placeholder={chapters.length === 0 ? "No chapters yet" : "Select a chapter"} 
                />
              </SelectTrigger>
              <SelectContent>
                {chapters.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onAddChapter}
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Chapter
          </Button>
        </div>
      </div>
    </div>
  );
}

