"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateAssessmentButtonProps {
  subjectId: string;
}

export const CreateAssessmentButton = ({ subjectId }: CreateAssessmentButtonProps) => {
  const router = useRouter();

  const handleCreate = () => {
    router.push(`/student/assessments/create?subject_id=${subjectId}`);
  };

  return (
    <Button onClick={handleCreate}>
      <Plus className="h-4 w-4 mr-2" />
      Create Assessment
    </Button>
  );
};


