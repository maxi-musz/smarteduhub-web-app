"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLibraryOwnerSchool } from "@/hooks/library-owner/use-library-owner-school";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useLibrarySchoolAssessments } from "../../hooks/use-library-school-assessments";
import { AssessmentList } from "../../components/AssessmentList";
import type { AssessmentStatus, AssessmentType } from "../../hooks/use-library-school-assessments";

// Order: Active first, then All, then the rest
const STATUS_PILLS: { label: string; value: AssessmentStatus | "all" }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "All", value: "all" },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Archived", value: "ARCHIVED" },
];

const TYPE_OPTIONS: { label: string; value?: string }[] = [
  { label: "All types", value: undefined },
  { label: "CBT", value: "CBT" },
  { label: "Exam", value: "EXAM" },
];

export default function SubjectAssessmentsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const subjectId = params.subjectId as string;
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AssessmentStatus | undefined>("ACTIVE");
  const [type, setType] = useState<AssessmentType | undefined>(undefined);

  const { data: schoolData } = useLibraryOwnerSchool(schoolId);
  const { data, isLoading } = useLibrarySchoolAssessments({
    schoolId,
    subject_id: subjectId,
    status,
    assessment_type: type,
    page,
    limit: 10,
  });
  const { data: allData } = useLibrarySchoolAssessments({
    schoolId,
    subject_id: subjectId,
    status: undefined,
    assessment_type: type,
    page: 1,
    limit: 1,
  });

  const assessments = data?.assessments ?? [];
  const pagination = data?.pagination;
  const counts = data?.counts;
  const totalCount = allData?.pagination?.total;
  const allCounts = allData?.counts;
  const subjectName = assessments[0]?.subject?.name ?? schoolData?.details?.subjects?.list?.find((s) => s.id === subjectId)?.name ?? "Subject";

  const getStatusCount = (pill: { value: AssessmentStatus | "all" }): number | undefined => {
    if (pill.value === "all") {
      if (counts) return Object.values(counts).reduce((s, n) => s + n, 0);
      if (status === undefined && typeof pagination?.total === "number") return pagination.total;
      if (typeof totalCount === "number") return totalCount;
      return undefined;
    }
    if (counts && typeof counts[pill.value] === "number") return counts[pill.value];
    if (allCounts && typeof allCounts[pill.value] === "number") return allCounts[pill.value];
    if (status === pill.value && typeof pagination?.total === "number") return pagination.total;
    return undefined;
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">Assessments</h1>
            <p className="text-sm text-brand-light-accent-1">{subjectName}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/library-owner/schools/subject/assessment/${schoolId}/${subjectId}/create`}>
            Create assessment
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_PILLS.map((pill) => {
            const value = pill.value === "all" ? undefined : pill.value;
            const isSelected = (status === undefined && pill.value === "all") || (status !== undefined && status === pill.value);
            const count = getStatusCount(pill);
            return (
              <button
                key={pill.value}
                type="button"
                onClick={() => {
                  setStatus(value);
                  setPage(1);
                }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  isSelected
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-brand-light-accent-1 hover:bg-gray-200 hover:text-brand-heading"
                )}
              >
                {pill.label}
                {count !== undefined && <span className="opacity-90">({count})</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-light-accent-1">Type</span>
          <Select value={type ?? "all"} onValueChange={(v) => setType(v === "all" ? undefined : (v as AssessmentType))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((o) => (
                <SelectItem key={o.label} value={o.value ?? "all"}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <AssessmentList
        schoolId={schoolId}
        subjectId={subjectId}
        subjectName={subjectName}
        assessments={assessments}
        isLoading={isLoading}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={!pagination.hasPrevious} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-brand-light-accent-1">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={!pagination.hasNext} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
