"use client";

import React, { useState, useMemo, useEffect } from "react";
import { LibrarySubject } from "@/hooks/library-owner/use-library-subjects";
import { useLibraryOwnerResources, LibraryClass, Subject } from "@/hooks/library-owner/use-library-owner-resources";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { AIAgentModal } from "@/components/AIAgentModal";
import { useRouter } from "next/navigation";
import { ResourcesStatistics } from "@/app/library-owner/resources/components/ResourcesStatistics";
import { ResourcesBreakdown } from "@/app/library-owner/resources/components/ResourcesBreakdown";
import { ResourcesSkeleton } from "@/app/library-owner/resources/components/ResourcesSkeleton";
import { CreateSubjectModal } from "@/app/library-owner/resources/[classId]/components/CreateSubjectModal";
import {
  ClassSelectorModal,
  LibrarySubjectCard,
  EditSubjectModal,
  DeleteSubjectDialog,
} from "./components";
import { useDeleteSubject } from "@/hooks/subjects/use-delete-subject";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, BookOpen, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

// Helper to convert Subject to LibrarySubject
const toLibrarySubject = (
  subject: Subject,
  className: string,
  topics?: { id: string; title: string; order: number; is_active: boolean }[]
): LibrarySubject => ({
  id: subject.id,
  name: subject.name,
  code: subject.code,
  color: subject.color,
  description: null,
  classId: subject.classId,
  className,
  topicsCount: topics?.length || 0,
  topics: topics || [],
  totalVideos: subject.videosCount || 0,
  totalMaterials: subject.materialsCount || 0,
});

const LibraryOwnerSubjectsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  // Modal states
  const [isClassSelectorOpen, setIsClassSelectorOpen] = useState(false);
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LibraryClass | null>(null);
  const [subjectToEdit, setSubjectToEdit] = useState<LibrarySubject | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<LibrarySubject | null>(null);

  // Delete subject mutation
  const deleteSubject = useDeleteSubject();

  // Fetch resources dashboard data - this is the source of truth
  const {
    data: resourcesData,
    isLoading: isResourcesLoading,
    error,
  } = useLibraryOwnerResources();

  // Get sorted classes with subject counts
  const classesWithSubjects = useMemo(() => {
    if (!resourcesData?.libraryClasses) return [];

    return resourcesData.libraryClasses
      .map((libraryClass) => ({
        id: libraryClass.id,
        name: libraryClass.name,
        order: libraryClass.order,
        subjectsCount: libraryClass.subjects?.length || 0,
      }))
      .sort((a, b) => a.order - b.order);
  }, [resourcesData?.libraryClasses]);

  // Auto-select first class with subjects when data loads
  useEffect(() => {
    if (classesWithSubjects.length > 0 && !selectedClassId) {
      // Find first class with subjects, or just the first class
      const firstWithSubjects = classesWithSubjects.find((c) => c.subjectsCount > 0);
      setSelectedClassId(firstWithSubjects?.id || classesWithSubjects[0].id);
    }
  }, [classesWithSubjects, selectedClassId]);

  // Get subjects for the selected class
  const filteredSubjects = useMemo(() => {
    if (!resourcesData?.libraryClasses || !selectedClassId) return [];

    const selectedLibraryClass = resourcesData.libraryClasses.find(
      (c) => c.id === selectedClassId
    );
    if (!selectedLibraryClass) return [];

    const classSubjects = (selectedLibraryClass.subjects || []).map((subject) => {
      const subjectTopics = resourcesData.topics
        ? resourcesData.topics
            .filter((t) => t.subjectId === subject.id)
            .map((t) => ({
              id: t.id,
              title: t.title,
              order: t.order,
              is_active: t.is_active,
            }))
            .sort((a, b) => a.order - b.order)
        : [];

      return toLibrarySubject(subject, selectedLibraryClass.name, subjectTopics);
    });

    // Apply search filter
    if (searchQuery) {
      return classSubjects.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return classSubjects;
  }, [resourcesData, selectedClassId, searchQuery]);

  // Calculate total subjects across all classes
  const totalSubjects = useMemo(() => {
    if (!resourcesData?.libraryClasses) return 0;
    return resourcesData.libraryClasses.reduce(
      (sum, c) => sum + (c.subjects?.length || 0),
      0
    );
  }, [resourcesData?.libraryClasses]);

  // Get the selected class object
  const currentSelectedClass = useMemo(() => {
    return resourcesData?.libraryClasses?.find((c) => c.id === selectedClassId) || null;
  }, [resourcesData?.libraryClasses, selectedClassId]);

  const errorMessage = useMemo(() => {
    if (!error) return null;

    // Type guard for AuthenticatedApiError
    if (error && typeof error === "object" && "statusCode" in error) {
      const apiError = error as AuthenticatedApiError;
      if (apiError.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (apiError.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return apiError.message || "An error occurred";
      }
    }

    // Type guard for Error
    if (error && typeof error === "object" && "message" in error) {
      return (error as Error).message;
    }

    return "An unexpected error occurred while loading subjects data.";
  }, [error]);

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/library-owner/subjects/${subjectId}`);
  };

  // Handle class selection for creating a subject
  const handleClassSelect = (classItem: LibraryClass) => {
    setSelectedClass(classItem);
    setIsClassSelectorOpen(false);
    setIsCreateSubjectModalOpen(true);
  };

  // Handle edit subject
  const handleEditSubject = (subject: LibrarySubject) => {
    setSubjectToEdit(subject);
    setIsEditSubjectModalOpen(true);
  };

  // Handle close create subject modal and refresh data
  const handleCloseCreateSubjectModal = () => {
    setIsCreateSubjectModalOpen(false);
    setSelectedClass(null);
    // Force refresh the resources data
    queryClient.invalidateQueries({ queryKey: ["library-owner", "resources"] });
  };

  // Handle close edit subject modal and refresh data
  const handleCloseEditSubjectModal = () => {
    setIsEditSubjectModalOpen(false);
    setSubjectToEdit(null);
    // Force refresh the resources data
    queryClient.invalidateQueries({ queryKey: ["library-owner", "resources"] });
  };

  // Handle delete subject click
  const handleDeleteSubject = (subject: LibrarySubject) => {
    setSubjectToDelete(subject);
    setIsDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (!subjectToDelete) return;

    deleteSubject.mutate(subjectToDelete.id, {
      onSuccess: (data) => {
        toast.success(`Subject "${data.name}" deleted successfully`);
        setIsDeleteDialogOpen(false);
        setSubjectToDelete(null);
        // Force refresh the resources data
        queryClient.invalidateQueries({ queryKey: ["library-owner", "resources"] });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete subject");
      },
    });
  };

  // Handle close delete dialog
  const handleCloseDeleteDialog = () => {
    if (deleteSubject.isPending) return;
    setIsDeleteDialogOpen(false);
    setSubjectToDelete(null);
  };

  // Show skeleton loader while resources are loading
  if (isResourcesLoading) {
    return <ResourcesSkeleton />;
  }

  // Check if there are no classes to show a helpful message
  const hasClasses = resourcesData?.libraryClasses && resourcesData.libraryClasses.length > 0;

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        {/* Custom Header with Create Subject Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">Subjects</h1>
            <p className="text-brand-light-accent-1 text-sm">
              Manage your library subjects ({totalSubjects} total)
            </p>
          </div>
          <Button
            onClick={() => {
              if (currentSelectedClass) {
                setSelectedClass(currentSelectedClass);
                setIsCreateSubjectModalOpen(true);
              } else {
                setIsClassSelectorOpen(true);
              }
            }}
            className="flex items-center gap-2 w-full sm:w-auto"
            disabled={!hasClasses}
          >
            <Plus className="h-4 w-4" />
            Create Subject
          </Button>
        </div>

        {errorMessage && (
          <div className="text-center py-8 text-red-600">{errorMessage}</div>
        )}

        {/* Statistics Overview */}
        {resourcesData?.statistics && (
          <>
            <ResourcesStatistics statistics={resourcesData.statistics} />
            <ResourcesBreakdown statistics={resourcesData.statistics} />
          </>
        )}

        {/* Filters: Class Selector + Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Class Filter */}
          <div className="w-full sm:w-64">
            <Select
              value={selectedClassId}
              onValueChange={setSelectedClassId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classesWithSubjects.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name} ({classItem.subjectsCount})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Filter */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Subject List */}
        {!hasClasses ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No classes found</h3>
            <p className="text-gray-500">
              You need to have classes set up before creating subjects.
            </p>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">
              {searchQuery ? "No subjects match your search" : "No subjects in this class"}
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? `No subjects found matching "${searchQuery}". Try a different search term.`
                : "Create your first subject to get started."}
            </p>
            {!searchQuery && currentSelectedClass && (
              <Button
                onClick={() => {
                  setSelectedClass(currentSelectedClass);
                  setIsCreateSubjectModalOpen(true);
                }}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Subject
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((subject) => (
              <LibrarySubjectCard
                key={subject.id}
                subject={subject}
                onAIClick={handleAIClick}
                onClick={() => handleSubjectClick(subject.id)}
                onEdit={handleEditSubject}
                onDelete={handleDeleteSubject}
              />
            ))}
          </div>
        )}
      </div>

      {/* AI Agent Modal */}
      <AIAgentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        subject={selectedSubject}
      />

      {/* Class Selector Modal */}
      <ClassSelectorModal
        isOpen={isClassSelectorOpen}
        onClose={() => setIsClassSelectorOpen(false)}
        onSelectClass={handleClassSelect}
        classes={resourcesData?.libraryClasses || []}
      />

      {/* Create Subject Modal */}
      {selectedClass && (
        <CreateSubjectModal
          isOpen={isCreateSubjectModalOpen}
          onClose={handleCloseCreateSubjectModal}
          classId={selectedClass.id}
          className={selectedClass.name}
        />
      )}

      {/* Edit Subject Modal */}
      <EditSubjectModal
        isOpen={isEditSubjectModalOpen}
        onClose={handleCloseEditSubjectModal}
        subject={subjectToEdit}
      />

      {/* Delete Subject Dialog */}
      <DeleteSubjectDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        subject={subjectToDelete}
        isLoading={deleteSubject.isPending}
      />
    </>
  );
};

export default LibraryOwnerSubjectsPage;
