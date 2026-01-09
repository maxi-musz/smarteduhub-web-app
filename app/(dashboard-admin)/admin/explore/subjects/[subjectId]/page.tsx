"use client";

import { useParams } from "next/navigation";
import { SubjectDetailPage } from "@/components/explore/SubjectDetailPage";

export default function AdminSubjectDetailPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  return <SubjectDetailPage subjectId={subjectId} basePath="/admin" />;
}
