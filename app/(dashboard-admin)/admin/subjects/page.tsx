"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  SubjectFilters,
  SubjectStatsCards,
  SubjectList,
  SubjectGroupedByClass,
  SubjectPagination,
  AddSubjectModal,
  EditSubjectModal,
  ViewSubjectModal,
  DeleteSubjectModal,
} from "@/app/(dashboard-admin)/admin/subjects/subject-components";
import { SubjectHeader } from "@/app/teacher/subjects/subject-components";
import {
  useSubjects,
  type SubjectsResponse,
  type SubjectsGroupedByClassResponse,
  type SubjectsListResponse,
} from "@/hooks/use-subjects-data";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function isGroupedResponse(
  data: SubjectsResponse | undefined
): data is SubjectsGroupedByClassResponse {
  return !!data && "groupedByClass" in data && data.groupedByClass === true;
}

export default function AdminSubjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [groupByClass, setGroupByClass] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewSubjectId, setViewSubjectId] = useState<string | null>(null);
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);

  const { data, isLoading, error } = useSubjects({
    page: groupByClass ? undefined : page,
    limit: groupByClass ? undefined : limit,
    search: searchQuery || undefined,
    classId: selectedClass === "all" ? undefined : selectedClass,
    groupByClass,
  });

  useEffect(() => {
    if (groupByClass) setPage(1);
  }, [groupByClass]);

  const errorMessage = useMemo(() => {
    if (!error) return null;
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401)
        return "Your session has expired. Please login again.";
      if (error.statusCode === 403)
        return "You don't have permission to access this data.";
      return error.message;
    }
    const err = error as Error;
    return err?.message ?? "An unexpected error occurred.";
  }, [error]);

  const availableClasses = useMemo(() => {
    if (!data) return [];
    return "availableClasses" in data ? data.availableClasses : [];
  }, [data]);

  const totalSubjects = useMemo(() => {
    if (!data) return 0;
    if (isGroupedResponse(data)) return data.totalSubjects;
    return (data as SubjectsListResponse).pagination?.total ?? 0;
  }, [data]);

  const listData = data as SubjectsListResponse | undefined;
  const pagination = listData?.pagination;
  const subjects = isGroupedResponse(data) ? [] : (listData?.subjects ?? []);

  const handleViewSubject = (subjectId: string) => {
    router.push(`/admin/subjects/${subjectId}`);
  };

  const handleEditSubject = (subjectId: string) => {
    setEditSubjectId(subjectId);
    setViewSubjectId(null);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setDeleteSubjectId(subjectId);
  };

  const handleConfirmDelete = () => {
    if (!deleteSubjectId) return;
    queryClient.invalidateQueries({ queryKey: ["subjects"] });
    toast({
      title: "Subject deletion",
      description: "Delete subject API can be wired here when available.",
    });
    setDeleteSubjectId(null);
  };

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        <SubjectHeader subtitle="Manage subjects by class or list view" />

        {errorMessage && (
          <div className="text-center py-8 text-red-600">{errorMessage}</div>
        )}

        <SubjectStatsCards totalSubjects={totalSubjects} isLoading={isLoading} />

        <SubjectFilters
          searchQuery={searchQuery}
          selectedClass={selectedClass}
          groupByClass={groupByClass}
          onSearchChange={(v) => {
            setSearchQuery(v);
            setPage(1);
          }}
          onClassChange={(v) => {
            setSelectedClass(v);
            setPage(1);
          }}
          onViewToggle={setGroupByClass}
          availableClasses={availableClasses.map((c) => ({
            id: c.id,
            name: c.name,
          }))}
        />

        <div className="flex items-center justify-end mb-4">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Subject
          </Button>
        </div>

        {groupByClass && isGroupedResponse(data) ? (
          <SubjectGroupedByClass
            classes={data.classes}
            isLoading={isLoading}
            onViewSubject={handleViewSubject}
          />
        ) : (
          <>
            <SubjectList
              subjects={subjects}
              isLoading={isLoading}
              onViewSubject={handleViewSubject}
              onEditSubject={handleEditSubject}
              onDeleteSubject={handleDeleteSubject}
            />
            {pagination && pagination.totalPages > 1 && (
              <SubjectPagination
                page={pagination.page}
                limit={pagination.limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      <AddSubjectModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      <EditSubjectModal
        open={!!editSubjectId}
        onOpenChange={(open) => !open && setEditSubjectId(null)}
        subjectId={editSubjectId}
      />

      <ViewSubjectModal
        open={!!viewSubjectId}
        onOpenChange={(open) => !open && setViewSubjectId(null)}
        subjectId={viewSubjectId}
        onEdit={handleEditSubject}
      />

      <DeleteSubjectModal
        open={!!deleteSubjectId}
        onOpenChange={(open) => !open && setDeleteSubjectId(null)}
        subjectId={deleteSubjectId}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
