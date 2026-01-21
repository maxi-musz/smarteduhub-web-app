"use client";

import React, { useState } from "react";
import { useGeneralMaterialsList } from "@/hooks/general-materials/use-general-materials";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import {
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateGeneralMaterialChapterModal } from "../components/CreateGeneralMaterialChapterModal";
import { ChapterFileUploadFromTableModal } from "../components/ChapterFileUploadFromTableModal";
import { ChaptersDropdown } from "../components/ChaptersDropdown";

const AllAiBooksPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  
  // Determine base path based on current route
  const getBasePath = () => {
    if (pathname.startsWith("/library-owner")) return "/library-owner";
    if (pathname.startsWith("/teacher")) return "/teacher";
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname.startsWith("/student")) return "/student";
    return "/general-pages";
  };
  
  const basePath = getBasePath();
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [isAiEnabled, setIsAiEnabled] = useState<string>("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBookForChapter, setSelectedBookForChapter] = useState<string | null>(null);
  const [selectedBookForFile, setSelectedBookForFile] = useState<{
    bookId: string;
    chapterId: string;
    chapterTitle: string;
  } | null>(null);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: materials,
    isLoading,
    error,
    refetch: refetchList,
  } = useGeneralMaterialsList({
    page,
    limit,
    search: debouncedSearch || undefined,
    isAiEnabled:
      isAiEnabled === "all" ? undefined : isAiEnabled === "true",
  });

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6 space-y-4">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage =
      "An unexpected error occurred while loading AI Books.";

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (error.statusCode === 404) {
        errorMessage =
          "The requested resource was not found. Please check your connection.";
      } else {
        const rawMessage = error.message || "";
        if (
          rawMessage.includes("Cannot GET") ||
          rawMessage.includes("Cannot POST")
        ) {
          errorMessage =
            "Unable to connect to the server. Please check your connection and try again.";
        } else {
          errorMessage = rawMessage;
        }
      }
    }

    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading AI Books
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">
                  {errorMessage}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      refetchList();
                    }}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  const totalPages = materials?.meta.totalPages || 1;
  const currentPage = materials?.meta.currentPage || 1;
  const totalItems = materials?.meta.totalItems || 0;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="px-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
            <h1 className="text-2xl font-bold text-brand-heading">
              All AI Books
            </h1>
            <p className="text-brand-light-accent-1 mt-1">
              Browse and manage all AI Books with search and filters
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6">
        <div className="bg-white rounded-lg border border-brand-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
              <Input
                placeholder="Search by title, author, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-brand-light-accent-1" />
              <Select
                value={isAiEnabled}
                onValueChange={setIsAiEnabled}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="AI Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Materials</SelectItem>
                  <SelectItem value="true">AI Enabled</SelectItem>
                  <SelectItem value="false">AI Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {materials && (
        <div className="px-6">
          <div className="bg-white rounded-lg border border-brand-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
              <h2 className="text-lg font-semibold text-brand-heading">
                All AI Books
              </h2>
              <p className="text-xs text-brand-light-accent-1">
                {totalItems} materials found
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-brand-bg/60">
                  <tr className="text-left text-xs text-brand-light-accent-1">
                    <th className="px-4 py-2 font-medium">Book</th>
                    <th className="px-4 py-2 font-medium">AI</th>
                    <th className="px-4 py-2 font-medium">Chapters</th>
                    <th className="px-4 py-2 font-medium">Views</th>
                    <th className="px-4 py-2 font-medium">Downloads</th>
                    <th className="px-4 py-2 font-medium">Uploaded By</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-brand-border/60 hover:bg-gray-50"
                    >
                      <td 
                        className="px-4 py-2 text-brand-heading max-w-xs cursor-pointer"
                        onClick={() => router.push(`${basePath}/general-materials/${item.id}`)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-20 rounded-md overflow-hidden border border-brand-border bg-gray-100 flex-shrink-0">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="56px"
                                unoptimized={item.thumbnailUrl.includes(
                                  "s3.amazonaws.com"
                                )}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-brand-primary/10 text-brand-primary text-xs font-semibold text-center px-1">
                                {item.title.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium line-clamp-2">
                              {item.title}
                            </div>
                            <div className="text-xs text-brand-light-accent-1 line-clamp-1">
                              {item.author || "Unknown author"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-brand-light-accent-1">
                        {item.isAiEnabled ? "Enabled" : "Disabled"}
                      </td>
                      <td className="px-4 py-2 text-brand-light-accent-1">
                        <ChaptersDropdown
                          materialId={item.id}
                          chapterCount={item.chapterCount}
                        />
                      </td>
                      <td className="px-4 py-2 text-brand-light-accent-1">
                        {item.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-brand-light-accent-1">
                        {item.downloads.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-brand-light-accent-1">
                        {item.uploadedBy
                          ? `${item.uploadedBy.first_name} ${item.uploadedBy.last_name}`
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-brand-light-accent-1">
                        {item.status}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`${basePath}/general-materials/${item.id}`);
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              AI Chat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBookForChapter(item.id);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Chapter
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBookForFile({
                                  bookId: item.id,
                                  chapterId: "",
                                  chapterTitle: "",
                                });
                              }}
                            >
                              <BookOpen className="h-4 w-4 mr-2" />
                              Upload Chapter File
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {materials.items.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-brand-light-accent-1"
                      >
                        No AI Books found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-brand-border">
                <div className="text-sm text-brand-light-accent-1">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, totalItems)} of {totalItems}{" "}
                  materials
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="text-sm text-brand-light-accent-1">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedBookForChapter && (
        <CreateGeneralMaterialChapterModal
          isOpen={!!selectedBookForChapter}
          onClose={() => setSelectedBookForChapter(null)}
          materialId={selectedBookForChapter}
          onSuccess={() => {
            setSelectedBookForChapter(null);
            refetchList();
          }}
        />
      )}

      {selectedBookForFile && (
        <ChapterFileUploadFromTableModal
          isOpen={!!selectedBookForFile}
          onClose={() => setSelectedBookForFile(null)}
          bookId={selectedBookForFile.bookId}
          onSuccess={() => {
            setSelectedBookForFile(null);
            refetchList();
          }}
        />
      )}
    </div>
  );
};

export default AllAiBooksPage;

