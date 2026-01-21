"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function StudentSubjectsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/general-pages/subjects");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>
  );
}
