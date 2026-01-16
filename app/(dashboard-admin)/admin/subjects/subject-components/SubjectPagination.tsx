"use client";

import { Button } from "@/components/ui/button";

interface SubjectPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export const SubjectPagination = ({
  page,
  limit,
  total,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}: SubjectPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of{" "}
        {total} subjects
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={!hasPrev}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={!hasNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

