"use client";

import { useParams } from "next/navigation";
import { AssessmentPage } from "@/components/explore/assessment/AssessmentPage";

export default function AdminAssessmentPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;

  return <AssessmentPage assessmentId={assessmentId} basePath="/admin" />;
}
