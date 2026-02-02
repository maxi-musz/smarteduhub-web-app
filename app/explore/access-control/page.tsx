"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { canManageAccessControl } from "@/lib/role-permissions";
import { SchoolAccessControlView } from "./components/SchoolAccessControlView";
import { TeacherAccessControlView } from "./components/TeacherAccessControlView";
import { Loader2 } from "lucide-react";

export default function ExploreAccessControlPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = session?.user?.role;

  useEffect(() => {
    if (status === "loading") return;
    if (!canManageAccessControl(role)) {
      router.replace("/explore");
    }
  }, [role, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!canManageAccessControl(role)) {
    return null; // Will redirect
  }

  const isSchoolDirector = role === "school_director";

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {isSchoolDirector ? (
        <SchoolAccessControlView />
      ) : (
        <TeacherAccessControlView />
      )}
    </div>
  );
}
