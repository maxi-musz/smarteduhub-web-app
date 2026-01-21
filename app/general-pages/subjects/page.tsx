"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSubjects } from "@/hooks/subjects/use-subjects";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { AIAgentModal } from "@/components/AIAgentModal";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  SubjectHeader,
  SubjectFilters,
  SubjectStatsCards,
  SubjectList,
  SubjectPagination,
} from "@/app/teacher/subjects/subject-components";
import { AddSubjectModal } from "@/app/(dashboard-admin)/admin/subjects/subject-components/AddSubjectModal";
import { getRolePermissions } from "@/lib/role-permissions";

const SubjectsPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<"name" | "code" | "createdAt" | "updatedAt">("name");
  const [sortOrder] = useState<"asc" | "desc">("asc");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);

  // Get role permissions
  const role = session?.user?.role as "teacher" | "school_director" | "student" | undefined;
  const permissions = getRolePermissions(role);

  const { data, isLoading, error } = useSubjects({
    page,
    limit,
    search: searchQuery || undefined,
    sortBy,
    sortOrder,
  });

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return error.message;
      }
    }

    return error instanceof Error ? error.message : "An unexpected error occurred while loading subjects data.";
  }, [error]);

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  // Determine base path based on current route
  const getBasePath = () => {
    if (pathname.startsWith("/teacher")) return "/teacher";
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname.startsWith("/student")) return "/student";
    return "/general-pages"; // Fallback
  };

  const handleSubjectClick = (subjectId: string) => {
    const basePath = getBasePath();
    router.push(`${basePath}/subjects/${subjectId}`);
  };

  const subjects = useMemo(() => data?.data || [], [data?.data]);
  const meta = data?.meta;

  // Get academic session from first subject (all subjects have the same session)
  const academicSession = useMemo(() => {
    if (subjects.length > 0 && subjects[0]?.academicSession) {
      return subjects[0].academicSession;
    }
    return null;
  }, [subjects]);

  // Calculate stats from subjects
  const stats = useMemo(() => {
    const subjectsList = data?.data || [];
    if (!subjectsList.length) {
      return {
        totalSubjects: 0,
        totalVideos: 0,
        totalMaterials: 0,
        totalClasses: 0,
      };
    }

    return {
      totalSubjects: data?.meta?.total || subjectsList.length,
      totalVideos: 0, // Will be populated when viewing individual subjects
      totalMaterials: 0, // Will be populated when viewing individual subjects
      totalClasses: 0, // Will be populated when viewing individual subjects
    };
  }, [data]);

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        <SubjectHeader />

        {errorMessage && (
          <div className="text-center py-8 text-red-600">{errorMessage}</div>
        )}

        <SubjectStatsCards 
          stats={stats} 
          isLoading={isLoading} 
          academicSession={academicSession}
        />

        <SubjectFilters
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
        />

        <div className="flex items-center justify-end mb-4">
          {permissions.canCreate && (
            <Button onClick={() => setIsAddSubjectModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Subject
            </Button>
          )}
        </div>

        <SubjectList
          subjects={subjects}
          isLoading={isLoading}
          pagination={meta}
          totalSubjects={stats.totalSubjects}
          searchQuery={searchQuery}
          onAIClick={handleAIClick}
          onSubjectClick={handleSubjectClick}
        />

        <SubjectPagination
          pagination={meta}
          onPageChange={setPage}
        />
      </div>

      <AIAgentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        subject={selectedSubject}
      />

      {permissions.canCreate && (
        <AddSubjectModal
          open={isAddSubjectModalOpen}
          onOpenChange={setIsAddSubjectModalOpen}
        />
      )}
    </>
  );
};

export default SubjectsPage;

