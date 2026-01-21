"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TeacherMaterialRedirectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const materialId = params.materialId as string;
  const subjectId = params.id as string;
  const topicId = searchParams.get("topicId");

  useEffect(() => {
    const queryString = topicId ? `?topicId=${topicId}` : "";
    // Use push instead of replace to ensure navigation happens
    router.push(`/general-pages/subjects/${subjectId}/materials/${materialId}${queryString}`);
  }, [materialId, subjectId, topicId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>
  );
}

