"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, BookOpen, Loader2, AlertCircle, MessageSquare, CheckCircle2, FileText, Archive, RefreshCw } from "lucide-react";
import { useMaterialChapters, type MaterialChapter } from "@/hooks/general-materials/use-material-chapters";
import { useRetryProcessing } from "@/hooks/general-materials/use-general-material-mutations";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const {
    data: chapters,
    isLoading,
    error,
  } = useMaterialChapters(isOpen ? materialId : null);
  const retryProcessing = useRetryProcessing();
  
  // Track which chapter is currently being processed
  const processingChapterId = retryProcessing.isPending && retryProcessing.variables?.chapterId 
    ? retryProcessing.variables.chapterId 
    : null;

  const basePath = "/library-owner";

  const handleChapterClick = (chapterId: string) => {
    setIsOpen(false);
    router.push(`${basePath}/general-materials/${materialId}?chapter=${chapterId}`);
  };

  const handleRetryProcessing = useCallback(async (e: React.MouseEvent, chapterId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Log for debugging
    console.log("[ChaptersDropdown] Retrying processing for chapter:", chapterId);
    
    try {
      const result = await retryProcessing.mutateAsync({ 
        chapterId: chapterId 
      });
      
      if (result.status === "COMPLETED") {
        toast({
          title: "Processing Completed",
          description: `Successfully processed ${result.processedChunks} chunks in ${(result.processingTime / 1000).toFixed(1)}s`,
        });
      } else if (result.status === "FAILED") {
        toast({
          title: "Processing Failed",
          description: result.errorMessage || "Failed to process document",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to retry processing",
        variant: "destructive",
      });
    }
  }, [retryProcessing, toast]);

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
                    {/* File Processing Status */}
                    {chapter.files.length > 0 && (() => {
                      // Filter files that have processingStatus
                      const filesWithStatus = chapter.files.filter(f => f.processingStatus);
                      
                      if (filesWithStatus.length === 0) {
                        // If no files have processingStatus, show chat readiness based on isProcessed
                        return (
                          <div className="flex items-center gap-2 mt-1.5">
                            {chapter.isProcessed ? (
                              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium bg-green-50 text-green-700 border-green-200">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                <span>Ready for Chat</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
                                  <FileText className="h-3 w-3 text-gray-600" />
                                  <span>Not Processed</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => handleRetryProcessing(e, chapter.id)}
                                  disabled={processingChapterId === chapter.id}
                                  title="Retry AI processing for this chapter"
                                >
                                  {processingChapterId === chapter.id ? (
                                    <>
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="h-3 w-3 mr-1" />
                                      Retry
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      // Get unique statuses
                      const uniqueStatuses = Array.from(new Set(filesWithStatus.map(f => f.processingStatus)));
                      
                      // If all files have the same status, show one badge
                      // Otherwise, show individual statuses
                      const filesToShow = uniqueStatuses.length === 1 
                        ? [filesWithStatus[0]] // Show first file if all have same status
                        : filesWithStatus; // Show all if different statuses
                      
                      const getStatusConfig = (status: string) => {
                        switch (status) {
                          case "published":
                            return {
                              label: "Published",
                              icon: CheckCircle2,
                              className: "bg-green-50 text-green-700 border-green-200",
                              iconClassName: "text-green-600",
                              chatReady: chapter.isProcessed,
                            };
                          case "draft":
                            return {
                              label: "Draft",
                              icon: FileText,
                              className: "bg-amber-50 text-amber-700 border-amber-200",
                              iconClassName: "text-amber-600",
                              chatReady: false,
                            };
                          case "archived":
                            return {
                              label: "Archived",
                              icon: Archive,
                              className: "bg-gray-50 text-gray-700 border-gray-200",
                              iconClassName: "text-gray-600",
                              chatReady: false,
                            };
                          default:
                            return {
                              label: status || "Unknown",
                              icon: FileText,
                              className: "bg-gray-50 text-gray-700 border-gray-200",
                              iconClassName: "text-gray-600",
                              chatReady: false,
                            };
                        }
                      };
                      
                      return (
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          {filesToShow.map((file) => {
                            const statusConfig = getStatusConfig(file.processingStatus || "");
                            const StatusIcon = statusConfig.icon;
                            const fileCount = filesWithStatus.filter(f => f.processingStatus === file.processingStatus).length;
                            
                            return (
                              <div key={file.id} className="flex items-center gap-2 flex-wrap">
                                <div
                                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium ${statusConfig.className}`}
                                  title={
                                    uniqueStatuses.length === 1
                                      ? `All ${filesWithStatus.length} file(s) are ${statusConfig.label}`
                                      : `File: ${file.fileName} - ${statusConfig.label}`
                                  }
                                >
                                  <StatusIcon className={`h-3 w-3 ${statusConfig.iconClassName}`} />
                                  <span>
                                    {statusConfig.label}
                                    {uniqueStatuses.length === 1 && filesWithStatus.length > 1 && (
                                      <span className="ml-1 opacity-75">({filesWithStatus.length})</span>
                                    )}
                                  </span>
                                </div>
                                {/* Show chat readiness indicator */}
                                {statusConfig.chatReady && (
                                  <div
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium bg-blue-50 text-blue-700 border-blue-200"
                                    title="This file is processed and ready for AI chat"
                                  >
                                    <MessageSquare className="h-3 w-3 text-blue-600" />
                                    <span>Chat Ready</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
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

