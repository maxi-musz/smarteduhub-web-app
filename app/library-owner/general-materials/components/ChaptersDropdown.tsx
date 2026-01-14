"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, BookOpen, Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { useMaterialChapters, type MaterialChapter } from "@/hooks/general-materials/use-material-chapters";

interface ChaptersDropdownProps {
  materialId: string;
  chapterCount?: number;
}

export function ChaptersDropdown({
  materialId,
  chapterCount,
}: ChaptersDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: chapters,
    isLoading,
    error,
  } = useMaterialChapters(isOpen ? materialId : null);

  const handleChapterClick = (chapterId: string) => {
    setIsOpen(false);
    router.push(`/library-owner/general-materials/${materialId}?chapter=${chapterId}`);
  };

  const displayCount = chapterCount !== undefined ? chapterCount.toLocaleString() : "-";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-brand-light-accent-1 hover:text-brand-heading"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="mr-1">{displayCount}</span>
          {chapterCount !== undefined && chapterCount > 0 && (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-w-md max-h-[400px] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="px-4 py-3 flex items-center gap-2 text-sm text-brand-light-accent-1">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading chapters...
          </div>
        )}

        {error && (
          <div className="px-4 py-3 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4" />
            Failed to load chapters
          </div>
        )}

        {!isLoading && !error && chapters && (chapters as MaterialChapter[]).length === 0 && (
          <div className="px-4 py-3 text-sm text-brand-light-accent-1">
            No chapters available
          </div>
        )}

        {!isLoading && !error && chapters && (chapters as MaterialChapter[]).length > 0 && (
          <>
            <div className="px-4 py-2 border-b border-brand-border">
              <p className="text-xs font-semibold text-brand-heading">
                Chapters ({(chapters as MaterialChapter[]).length})
              </p>
            </div>
            {(chapters as MaterialChapter[]).map((chapter) => (
              <DropdownMenuItem
                key={chapter.id}
                className="flex flex-col items-start gap-1 px-4 py-3 cursor-pointer hover:bg-brand-bg"
                onSelect={(e) => {
                  e.preventDefault();
                  handleChapterClick(chapter.id);
                }}
              >
                <div className="flex items-start gap-2 w-full">
                  <BookOpen className="h-4 w-4 text-brand-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-brand-heading line-clamp-2">
                        {chapter.title}
                      </p>
                      <MessageSquare className="h-3 w-3 text-brand-primary flex-shrink-0" />
                    </div>
                    {chapter.description && (
                      <p className="text-xs text-brand-light-accent-1 mt-1 line-clamp-2">
                        {chapter.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-xs text-brand-light-accent-1">
                      {chapter.pageStart && chapter.pageEnd && (
                        <span>Pages {chapter.pageStart}-{chapter.pageEnd}</span>
                      )}
                      <span>{chapter.files.length} file{chapter.files.length !== 1 ? 's' : ''}</span>
                      {chapter.isProcessed && (
                        <span className="text-green-600">AI Processed</span>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

