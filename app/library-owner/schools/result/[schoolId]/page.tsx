"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLibraryOwnerSchool } from "@/hooks/library-owner/use-library-owner-school";
import {
  useResultsDashboard,
  useReleaseResultsSchool,
  useReleaseResultsStudent,
  useReleaseResultsClass,
  useReleaseResultsStudents,
  useUnreleaseResultsSchool,
  useUnreleaseResultsStudent,
  useUnreleaseResultsStudents,
  useUnreleaseResultsClass,
} from "../hooks/use-library-school-results";
import { ResultsDashboardFilters } from "../components/ResultsDashboardFilters";
import { ResultsTable } from "../components/ResultsTable";
import { ReleaseUnreleaseBulkActions } from "../components/ReleaseUnreleaseBulkActions";

export default function SchoolResultsPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [classId, setClassId] = useState<string | null>(null);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: schoolData } = useLibraryOwnerSchool(schoolId);
  const { data: dashboard, isLoading } = useResultsDashboard({
    schoolId,
    session_id: sessionId,
    class_id: classId,
    subject_id: subjectId,
    page,
    limit: 20,
  });

  const releaseSchool = useReleaseResultsSchool(schoolId);
  const releaseStudent = useReleaseResultsStudent(schoolId);
  const releaseClass = useReleaseResultsClass(schoolId);
  const releaseStudents = useReleaseResultsStudents(schoolId);
  const unreleaseSchool = useUnreleaseResultsSchool(schoolId);
  const unreleaseStudent = useUnreleaseResultsStudent(schoolId);
  const unreleaseStudents = useUnreleaseResultsStudents(schoolId);
  const unreleaseClass = useUnreleaseResultsClass(schoolId);

  const handleReleaseStudent = useCallback(
    (studentId: string) => {
      releaseStudent.mutate({ studentId, sessionId });
    },
    [releaseStudent, sessionId]
  );

  const handleUnreleaseStudent = useCallback(
    (studentId: string) => {
      unreleaseStudent.mutate({ studentId, sessionId });
    },
    [unreleaseStudent, sessionId]
  );

  const handleReleaseSelected = useCallback(
    (studentIds: string[]) => {
      releaseStudents.mutate({ studentIds, sessionId });
    },
    [releaseStudents, sessionId]
  );

  const handleUnreleaseSelected = useCallback(
    (studentIds: string[]) => {
      unreleaseStudents.mutate({ studentIds, sessionId });
    },
    [unreleaseStudents, sessionId]
  );

  const schoolName = schoolData?.school?.school_name ?? "School";

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">Results</h1>
            <p className="text-sm text-brand-light-accent-1">{schoolName}</p>
          </div>
        </div>
      </div>

      <ResultsDashboardFilters
        sessions={dashboard?.academic_sessions ?? []}
        currentSession={dashboard?.current_session ?? null}
        classes={dashboard?.classes ?? []}
        subjects={dashboard?.subjects ?? []}
        selectedSessionId={sessionId}
        selectedClassId={classId}
        selectedSubjectId={subjectId}
        onSessionChange={setSessionId}
        onClassChange={(id) => {
          setClassId(id);
          setPage(1);
        }}
        onSubjectChange={(id) => {
          setSubjectId(id);
          setPage(1);
        }}
      />

      <ReleaseUnreleaseBulkActions
        sessionId={sessionId}
        selectedClassId={classId}
        classes={dashboard?.classes ?? []}
        onReleaseSchool={() => releaseSchool.mutate()}
        onUnreleaseSchool={unreleaseSchool.mutate}
        onReleaseClass={releaseClass.mutate}
        onUnreleaseClass={unreleaseClass.mutate}
        releaseSchoolMutation={releaseSchool}
        unreleaseSchoolMutation={unreleaseSchool}
        releaseClassMutation={releaseClass}
        unreleaseClassMutation={unreleaseClass}
      />

      <ResultsTable
        results={dashboard?.results ?? null}
        resultMessage={dashboard?.result_message ?? null}
        subjects={dashboard?.subjects ?? []}
        pagination={dashboard?.pagination ?? null}
        sessionId={sessionId}
        page={page}
        onPageChange={setPage}
        onReleaseStudent={handleReleaseStudent}
        onUnreleaseStudent={handleUnreleaseStudent}
        onReleaseSelected={handleReleaseSelected}
        onUnreleaseSelected={handleUnreleaseSelected}
        releaseStudentMutation={releaseStudent}
        unreleaseStudentMutation={unreleaseStudent}
        releaseStudentsMutation={releaseStudents}
        unreleaseStudentsMutation={unreleaseStudents}
        isLoading={isLoading}
      />
    </div>
  );
}
