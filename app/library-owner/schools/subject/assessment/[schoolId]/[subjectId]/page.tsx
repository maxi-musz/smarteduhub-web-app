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
import { ArrowLeft } from "lucide-react";
import { useLibrarySchoolAssessments } from "../../hooks/use-library-school-assessments";
import { AssessmentList } from "../../components/AssessmentList";
import type { AssessmentStatus, AssessmentType } from "../../hooks/use-library-school-assessments";

const STATUS_OPTIONS: { label: string; value?: string }[] = [
  { label: "All", value: undefined },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Active", value: "ACTIVE" },
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
  const [status, setStatus] = useState<AssessmentStatus | undefined>(undefined);
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

  const assessments = data?.assessments ?? [];
  const pagination = data?.pagination;
  const subjectName = assessments[0]?.subject?.name ?? schoolData?.details?.subjects?.list?.find((s) => s.id === subjectId)?.name ?? "Subject";

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
        <div className="flex items-center gap-2">
          <span className="text-sm text-brand-light-accent-1">Status</span>
          <Select value={status ?? "all"} onValueChange={(v) => setStatus(v === "all" ? undefined : (v as AssessmentStatus))}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.label} value={o.value ?? "all"}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
