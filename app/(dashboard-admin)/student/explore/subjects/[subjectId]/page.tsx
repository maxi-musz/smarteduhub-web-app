"use client";

import { useParams } from "next/navigation";
import { SubjectDetailPage } from "@/components/explore/subject/SubjectDetailPage";

export default function StudentSubjectDetailPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  return <SubjectDetailPage subjectId={subjectId} basePath="/student" />;
}
