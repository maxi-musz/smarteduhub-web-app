"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useLibraryOwnerSchool } from "@/hooks/library-owner/use-library-owner-school";
import { useCreateLibrarySchoolAssessment } from "../../../hooks/use-library-school-assessments";
import { CreateAssessmentForm } from "../../../components/CreateAssessmentForm";

export default function CreateAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;
  const subjectId = params.subjectId as string;
  const { data: schoolData } = useLibraryOwnerSchool(schoolId);
  const subjectName = schoolData?.details?.subjects?.list?.find((s) => s.id === subjectId)?.name ?? "Subject";
  const createMutation = useCreateLibrarySchoolAssessment(schoolId);

  const handleSubmit = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    const result = await createMutation.mutateAsync(data);
    if (result) {
      router.push(`/library-owner/schools/subject/assessment/${schoolId}/${subjectId}/${result.id}`);
    }
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {createMutation.isPending && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
            <p className="text-lg font-medium text-brand-heading">Creating assessment...</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">Create assessment</h1>
            <p className="text-sm text-brand-light-accent-1">New assessment for this subject</p>
          </div>
        </div>
      </div>

      <CreateAssessmentForm
        subjectId={subjectId}
        subjectName={subjectName}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}
