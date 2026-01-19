"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { SubjectsDashboardPagination } from "@/hooks/use-teacher-data";

interface SubjectPaginationProps {
  pagination: SubjectsDashboardPagination | undefined;
  onPageChange: (page: number) => void;
}

export const SubjectPagination = ({
  pagination,
  onPageChange,
}: SubjectPaginationProps) => {
  if (!pagination) return null;

  const { current_page, total_pages, has_next, has_previous } = pagination;

  if (total_pages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (has_previous) {
                onPageChange(current_page - 1);
              }
            }}
            className={!has_previous ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {Array.from({ length: total_pages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === current_page}
              className="cursor-pointer"
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (has_next) {
                onPageChange(current_page + 1);
              }
            }}
            className={!has_next ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};


