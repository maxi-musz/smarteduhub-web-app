"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, X, Loader2 } from "lucide-react";
import type { ResultRow, DashboardSubject, ResultsPagination } from "../hooks/use-library-school-results";

interface ResultsTableProps {
  results: ResultRow[] | null;
  resultMessage: string | null;
  subjects: DashboardSubject[];
  pagination: ResultsPagination | null;
  sessionId: string | null;
  page: number;
  onPageChange: (page: number) => void;
  onReleaseStudent: (studentId: string) => void;
  onUnreleaseStudent: (studentId: string) => void;
  onReleaseSelected: (studentIds: string[]) => void;
  onUnreleaseSelected: (studentIds: string[]) => void;
  releaseStudentMutation: { isPending: boolean };
  unreleaseStudentMutation: { isPending: boolean };
  releaseStudentsMutation: { isPending: boolean };
  unreleaseStudentsMutation: { isPending: boolean };
  isLoading?: boolean;
}

export function ResultsTable({
  results,
  resultMessage,
  subjects,
  pagination,
  sessionId,
  page,
  onPageChange,
  onReleaseStudent,
  onUnreleaseStudent,
  onReleaseSelected,
  onUnreleaseSelected,
  releaseStudentMutation,
  unreleaseStudentMutation,
  releaseStudentsMutation,
  unreleaseStudentsMutation,
  isLoading,
}: ResultsTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (!results || results.length === 0) return;
    const allIds = results.map((r) => r.student.id);
    const allSelected = allIds.every((id) => selectedIds.has(id));
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(allIds));
  };

  const selectedList = Array.from(selectedIds);
  const anyReleased = selectedList.some((id) => results?.find((r) => r.student.id === id)?.isReleased);
  const anyUnreleased = selectedList.some((id) => results?.find((r) => r.student.id === id) && !results?.find((r) => r.student.id === id)?.isReleased);

  if (isLoading) {
    return (
      <div className="rounded-md border border-brand-border">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-light-accent-1" />
        </div>
      </div>
    );
  }

  if (resultMessage && (!results || results.length === 0)) {
    return (
      <div className="rounded-md border border-brand-border bg-gray-50 p-8 text-center">
        <p className="text-brand-light-accent-1">{resultMessage}</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="rounded-md border border-brand-border bg-gray-50 p-8 text-center">
        <p className="text-brand-light-accent-1">No results to display. Select a session and class to view results.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedList.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-brand-light-accent-1">
            {selectedList.length} selected
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={releaseStudentsMutation.isPending || !anyUnreleased}
            onClick={() => onReleaseSelected(selectedList)}
          >
            {releaseStudentsMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            Release selected
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={unreleaseStudentsMutation.isPending || !anyReleased}
            onClick={() => onUnreleaseSelected(selectedList)}
          >
            {unreleaseStudentsMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <X className="h-4 w-4 mr-1" />
            )}
            Unrelease selected
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedIds(new Set())}
          >
            Clear selection
          </Button>
        </div>
      )}

      <div className="overflow-x-auto rounded-md border border-brand-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={results.length > 0 && results.every((r) => selectedIds.has(r.student.id))}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="font-medium">Student</TableHead>
              <TableHead className="font-medium text-right">Position</TableHead>
              {subjects.map((s) => (
                <TableHead key={s.id} className="text-right font-medium min-w-[80px]">
                  {s.name}
                </TableHead>
              ))}
              <TableHead className="text-right font-medium">Total</TableHead>
              <TableHead className="text-right font-medium">%</TableHead>
              <TableHead className="text-right font-medium">Grade</TableHead>
              <TableHead className="text-center font-medium">Released</TableHead>
              <TableHead className="w-32 text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.student.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(row.student.id)}
                    onCheckedChange={() => toggleSelect(row.student.id)}
                    aria-label={`Select ${row.student.firstName} ${row.student.lastName}`}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-brand-heading">
                      {row.student.firstName} {row.student.lastName}
                    </p>
                    <p className="text-xs text-brand-light-accent-1">
                      {row.student.studentNumber || row.student.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">{row.position}</TableCell>
                {subjects.map((subj) => {
                  const score = row.subjectScores[subj.id];
                  if (!score) return <TableCell key={subj.id} className="text-right">—</TableCell>;
                  const text = score.isAvailable
                    ? score.obtained != null && score.obtainable != null
                      ? `${score.obtained}/${score.obtainable}`
                      : "—"
                    : "—";
                  return (
                    <TableCell key={subj.id} className="text-right text-sm">
                      {text}
                      {score.grade && <span className="ml-1 text-brand-light-accent-1">({score.grade})</span>}
                    </TableCell>
                  );
                })}
                <TableCell className="text-right">
                  {row.totalObtained}/{row.totalObtainable}
                </TableCell>
                <TableCell className="text-right">{row.percentage}%</TableCell>
                <TableCell className="text-right">{row.grade}</TableCell>
                <TableCell className="text-center">
                  {row.isReleased ? (
                    <Badge className="bg-green-100 text-green-800">Yes</Badge>
                  ) : (
                    <Badge variant="secondary">No</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {row.isReleased ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-brand-light-accent-1 hover:text-brand-heading"
                      disabled={unreleaseStudentMutation.isPending}
                      onClick={() => onUnreleaseStudent(row.student.id)}
                    >
                      {unreleaseStudentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <X className="h-4 w-4 mr-1" /> Unrelease
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-brand-light-accent-1 hover:text-brand-heading"
                      disabled={releaseStudentMutation.isPending}
                      onClick={() => onReleaseStudent(row.student.id)}
                    >
                      {releaseStudentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-1" /> Release
                        </>
                      )}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrev}
            onClick={() => onPageChange(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-brand-light-accent-1">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNext}
            onClick={() => onPageChange(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
