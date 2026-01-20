"use client";

import { BookOpen } from "lucide-react";
import type { TeacherSubject } from "@/hooks/teacher/use-teacher-subjects";
import { SubjectCard } from "./SubjectCard";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface SubjectListProps {
  subjects: TeacherSubject[];
  isLoading: boolean;
  pagination?: PaginationMeta;
  totalSubjects?: number;
  searchQuery?: string;
  onAIClick?: (subjectName: string) => void;
  onSubjectClick?: (subjectId: string) => void;
}

export const SubjectList = ({
  subjects,
  isLoading,
  pagination,
  totalSubjects,
  searchQuery,
  onAIClick,
  onSubjectClick,
}: SubjectListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border rounded-lg p-4 space-y-4 animate-pulse"
          >
            <div className="h-2 w-full bg-gray-200 rounded" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (subjects.length === 0) {
    // Check if there are subjects in total but not on this page
    const hasSubjectsTotal = totalSubjects !== undefined && totalSubjects > 0;
    const hasSearchFilter = searchQuery && searchQuery.trim().length > 0;
    const isOnWrongPage = pagination && pagination.page > 1;

    let message = "No subjects found";
    let description = "Try adjusting your search criteria";

    if (hasSubjectsTotal && hasSearchFilter) {
      message = "No subjects match your search";
      description = `No subjects found matching "${searchQuery}". Try a different search term.`;
    } else if (hasSubjectsTotal && isOnWrongPage) {
      message = "No subjects on this page";
      description = "Navigate to the first page to see subjects.";
    } else if (hasSubjectsTotal) {
      message = "No subjects to display";
      description = "There are subjects in the system, but none are available on this page.";
    } else {
      message = "No subjects found";
      description = "You don't have any subjects assigned yet.";
    }

    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">{message}</h3>
        <p className="text-gray-500">{description}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onAIClick={onAIClick}
          onClick={onSubjectClick ? () => onSubjectClick(subject.id) : undefined}
        />
      ))}
    </div>
  );
};

