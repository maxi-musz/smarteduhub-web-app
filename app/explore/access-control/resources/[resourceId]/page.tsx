"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SchoolResourceAccessManager } from "./SchoolResourceAccessManager";

export default function SchoolResourceManageAccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resourceId = params.resourceId as string;

  const subjectId = searchParams.get("subjectId") ?? "";
  const subjectName = searchParams.get("subjectName") ?? "Resource";
  const resourceType = (searchParams.get("resourceType") ?? "SUBJECT") as "SUBJECT" | "TOPIC" | "VIDEO" | "MATERIAL" | "ASSESSMENT" | "ALL";
  const platformName = searchParams.get("platformName") ?? "";
  const description = searchParams.get("description") ?? "";

  return (
    <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
      <div className="px-4 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/explore/access-control")}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Access Control
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-brand-primary/10">
            <ShieldCheck className="h-6 w-6 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">Manage Access</h1>
            <p className="text-muted-foreground">{subjectName}</p>
            {platformName && (
              <p className="text-xs text-muted-foreground mt-0.5">{platformName}</p>
            )}
          </div>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      <div className="px-4 sm:px-6">
        <SchoolResourceAccessManager
          libraryResourceAccessId={resourceId}
          subjectId={subjectId}
          resourceType={resourceType}
          subjectName={subjectName}
        />
      </div>
    </div>
  );
}
