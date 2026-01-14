"use client";

import { useParams } from "next/navigation";
import { SubjectDetailPage } from "@/components/explore/subject/SubjectDetailPage";

export default function TeacherSubjectDetailPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  return <SubjectDetailPage subjectId={subjectId} basePath="/teacher" />;
}
