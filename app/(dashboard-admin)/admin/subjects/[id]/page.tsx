"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminSubjectDetailRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.id as string;

  useEffect(() => {
    router.replace(`/general-pages/subjects/${subjectId}`);
  }, [subjectId, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>
  );
}

