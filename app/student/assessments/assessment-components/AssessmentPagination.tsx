"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AssessmentPagination as PaginationType } from "@/hooks/teacher/use-teacher-assessments";

interface AssessmentPaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export const AssessmentPagination = ({
  pagination,
  onPageChange,
}: AssessmentPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} assessments
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={!pagination.hasPrevious}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="text-sm text-gray-600">
          Page {pagination.page} of {pagination.totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={!pagination.hasNext}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};


