"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AIBookHeader } from "./components/AIBookHeader";
import { MyBooksSection } from "./components/MyBooksSection";
import { FilterPanel } from "./components/FilterPanel";
import { BooksGrid } from "./components/BooksGrid";
import { useAIBooksLandingPage } from "@/hooks/explore/use-ai-books-landing";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

const DEFAULT_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 400;

export default function AIBookPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [classId, setClassId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [classId]);

  const { data, isLoading, error, refetch } = useAIBooksLandingPage({
    page,
    limit: DEFAULT_LIMIT,
    search: debouncedSearch || undefined,
    classId: classId || undefined,
  });

  const handleClearFilters = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setClassId("");
    setPage(1);
  }, []);

  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalItems ?? 0;
  const currentPage = pagination?.page ?? 1;
  const limit = pagination?.limit ?? DEFAULT_LIMIT;
  const hasNext = pagination?.hasNextPage ?? false;
  const hasPrev = pagination?.hasPreviousPage ?? false;

  if (error) {
    let errorMessage = "Failed to load AI Books";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else {
        errorMessage = error.message || errorMessage;
      }
    }

    return (
      <div className="min-h-screen bg-brand-bg">
        <AIBookHeader platform={null} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{errorMessage}</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <AIBookHeader platform={data?.platform} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MyBooksSection />
        <FilterPanel
          search={search}
          classId={classId}
          classes={data?.classes ?? []}
          onSearchChange={setSearch}
          onClassChange={setClassId}
          onClearFilters={handleClearFilters}
        />
        {isLoading && !data ? (
          <div className="flex items-center justify-center min-h-[320px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
              <p className="text-brand-light-accent-1">Loading AI Books...</p>
            </div>
          </div>
        ) : (
          <>
            <BooksGrid
              books={data?.books ?? []}
              totalItems={totalItems}
              platform={data?.platform}
            />
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-brand-border">
                <p className="text-sm text-brand-light-accent-1">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, totalItems)} of {totalItems} books
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={!hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm text-brand-light-accent-1 px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={!hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
