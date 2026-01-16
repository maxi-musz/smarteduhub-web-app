"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useSubjects } from "@/hooks/use-subjects-data";
import {
  SubjectStatsCards,
  SubjectFilters,
  SubjectList,
  SubjectGroupedByClass,
  SubjectPagination,
  AddSubjectModal,
  EditSubjectModal,
  ViewSubjectModal,
  DeleteSubjectModal,
  ErrorModal,
} from "./subject-components";

const AdminSubjects = () => {
  // Filter and pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [groupByClass, setGroupByClass] = useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch subjects with filters
  const {
    data: subjectsData,
    isLoading,
    error: queryError,
    refetch,
  } = useSubjects({
    page,
    limit,
    search: searchQuery || undefined,
    classId: selectedClass === "all" ? undefined : selectedClass,
    groupByClass,
  });

  // Format error message
  const error = useMemo(() => {
    if (!queryError) return null;

    if (queryError instanceof AuthenticatedApiError) {
      if (queryError.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (queryError.statusCode === 403) {
        return "You don&apos;t have permission to access this data.";
      } else {
        return queryError.message;
      }
    }

    return "An unexpected error occurred while loading subjects data.";
  }, [queryError]);

  // Show error modal when error occurs
  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  // Retry mechanism
  const handleRetry = () => {
    setShowErrorModal(false);
    refetch();
  };

  // Handle view subject
  const handleViewSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setIsViewModalOpen(true);
  };

  // Handle edit subject
  const handleEditSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setIsEditModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setIsDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    // TODO: Implement delete API call when available
    setIsDeleteModalOpen(false);
    setSelectedSubjectId(null);
  };

  // Extract data based on response type
  const isGrouped = subjectsData && "groupedByClass" in subjectsData;
  const subjects = isGrouped
    ? []
    : subjectsData && "subjects" in subjectsData
    ? subjectsData.subjects
    : [];
  const classes = isGrouped && "classes" in subjectsData
    ? subjectsData.classes
    : [];
  const availableClasses = isGrouped
    ? subjectsData && "availableClasses" in subjectsData
      ? subjectsData.availableClasses
      : []
    : subjectsData && "availableClasses" in subjectsData
    ? subjectsData.availableClasses
    : [];
  const pagination = !isGrouped && subjectsData && "pagination" in subjectsData
    ? subjectsData.pagination
    : {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };
  const totalSubjects = isGrouped && subjectsData && "totalSubjects" in subjectsData
    ? subjectsData.totalSubjects
    : pagination.total;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Subjects Management
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <SubjectStatsCards
          totalSubjects={totalSubjects}
          isLoading={isLoading}
        />
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6">
        <SubjectFilters
          searchQuery={searchQuery}
          selectedClass={selectedClass}
          groupByClass={groupByClass}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          onClassChange={(value) => {
            setSelectedClass(value);
            setPage(1);
          }}
          onViewToggle={(grouped) => {
            setGroupByClass(grouped);
            setPage(1);
          }}
          availableClasses={availableClasses}
        />
        <div className="flex items-center gap-4">
          <AddSubjectModal
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
          />
        </div>
      </div>

      {/* Subjects Display */}
      {groupByClass ? (
        <SubjectGroupedByClass
          classes={classes}
          isLoading={isLoading}
          onViewSubject={handleViewSubject}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <SubjectList
              subjects={subjects}
              isLoading={isLoading}
              onViewSubject={handleViewSubject}
              onEditSubject={handleEditSubject}
              onDeleteSubject={handleDeleteClick}
            />
          </CardContent>
        </Card>
      )}

      {/* Pagination - Only show for list view */}
      {!groupByClass && (
        <SubjectPagination
          page={page}
          limit={limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          onPageChange={setPage}
        />
      )}

      {/* Modals */}
      <ViewSubjectModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        subjectId={selectedSubjectId}
        onEdit={handleEditSubject}
      />

      <EditSubjectModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        subjectId={selectedSubjectId}
      />

      <DeleteSubjectModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        subjectId={selectedSubjectId}
        onConfirm={handleDeleteConfirm}
      />

      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onRetry={handleRetry}
        error={error}
      />
    </div>
  );
};

export default AdminSubjects;
