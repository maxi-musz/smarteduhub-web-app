"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SchoolAccessManagerContent } from "../../components/SchoolAccessManagerContent";
import { useLibraryOwnerSchools } from "@/hooks/library-owner/use-library-owner-schools";

export default function SchoolAccessManagerPage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params.schoolId as string;

  const { data: schoolsData } = useLibraryOwnerSchools();
  const schools = (schoolsData as { schools?: Array<{ id: string; school_name: string }> })?.schools ?? [];
  const school = schools.find((s) => s.id === schoolId);
  const schoolName = school?.school_name ?? "School";

  return (
    <div className="py-6 space-y-6 bg-brand-bg min-h-screen">
      <div className="px-4 sm:px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/library-owner/access-control")}
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
            <p className="text-muted-foreground">{schoolName}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Grant access at subject level; all topics, videos, and materials under that subject are on by default. Use the switches under each subject to turn off or on individual resources for this school. Explore (school users) only shows resources that are not turned off.
        </p>
      </div>

      <div className="px-4 sm:px-6">
        <SchoolAccessManagerContent schoolId={schoolId} />
      </div>
    </div>
  );
}
