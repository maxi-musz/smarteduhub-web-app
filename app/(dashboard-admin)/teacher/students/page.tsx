"use client";

import { useState, useEffect, useMemo } from "react";
import { useStudentTab } from "@/hooks/use-teacher-data";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  StudentHeader,
  StudentStatsCards,
  StudentFilters,
  StudentTable,
  StudentPagination,
} from "./student-components";

export default function TeacherStudentsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [sortBy] = useState<"name" | "createdAt">("createdAt");
  const [sortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, error } = useStudentTab({
    page,
    limit,
    search: searchQuery || undefined,
    class_id: selectedClassId || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedClassId]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return error.message;
      }
    }

    return "An unexpected error occurred while loading students data.";
  }, [error]);

  return (
    <div className="py-6 space-y-6 min-h-screen bg-brand-bg">
      <div className="container mx-auto max-w-7xl">
        <StudentHeader />

        {errorMessage && (
          <div className="text-center py-8 text-red-600">
            {errorMessage}
          </div>
        )}

        <StudentStatsCards data={data} isLoading={isLoading} />

        <StudentFilters
          searchQuery={searchQuery}
          selectedClassId={selectedClassId}
          classes={data?.classes || []}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          onClassChange={(classId) => {
            setSelectedClassId(classId);
            setPage(1);
          }}
        />

        <StudentTable data={data} isLoading={isLoading} />

        <StudentPagination
          pagination={data?.students.pagination}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
