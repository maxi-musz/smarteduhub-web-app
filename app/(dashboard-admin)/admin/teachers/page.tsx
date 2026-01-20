"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useTeachersDashboard } from "@/hooks/teacher/use-teachers-data";
import {
  TeacherStatsCards,
  TeacherFilters,
  TeacherTable,
  TeacherPagination,
  AddTeacherModal,
  EditTeacherModal,
  ViewTeacherModal,
  DeleteTeacherModal,
  ErrorModal,
} from "./teacher-components";

const AdminTeachers = () => {
  const { toast } = useToast();

  // Filter and pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [sortBy] = useState<"name" | "createdAt" | "status">("createdAt");
  const [sortOrder] = useState<"asc" | "desc">("desc");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch teachers dashboard with filters
  const {
    data: dashboardData,
    isLoading,
    error: queryError,
    refetch,
  } = useTeachersDashboard({
    page,
    limit,
    search: searchQuery || undefined,
    status: filterStatus === "all" ? undefined : (filterStatus as "active" | "inactive" | "suspended" | undefined),
    gender: filterGender === "all" ? undefined : (filterGender as "male" | "female" | "other" | undefined),
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  // Format error message
  const error = useMemo(() => {
    if (!queryError) return null;

    if (queryError instanceof AuthenticatedApiError) {
      if (queryError.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (queryError.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return queryError.message;
      }
    }

    return "An unexpected error occurred while loading teachers data.";
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

  // Handle view teacher
  const handleViewTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setIsViewModalOpen(true);
  };

  // Handle edit teacher
  const handleEditTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setIsEditModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setIsDeleteModalOpen(true);
  };

  // Statistics
  const stats = dashboardData?.dashboardStats || {
    totalTeachers: 0,
    activeTeachers: 0,
  };

  const teachers = dashboardData?.teachers || [];
  const pagination = dashboardData?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Teachers Management
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TeacherStatsCards
          totalTeachers={stats.totalTeachers}
          activeTeachers={stats.activeTeachers}
          isLoading={isLoading}
        />
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-6">
        <TeacherFilters
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          filterGender={filterGender}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setFilterStatus(value);
            setPage(1);
          }}
          onGenderChange={(value) => {
            setFilterGender(value);
            setPage(1);
          }}
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => toast({ title: "Download feature coming soon" })}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toast({ title: "Upload feature coming soon" })}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <AddTeacherModal
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
            />
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <Card>
        <CardContent className="p-0">
          <TeacherTable
            teachers={teachers}
            isLoading={isLoading}
            onViewTeacher={handleViewTeacher}
            onEditTeacher={handleEditTeacher}
            onDeleteTeacher={handleDeleteClick}
          />
        </CardContent>
      </Card>

      {/* Pagination */}
      <TeacherPagination
        page={page}
        limit={limit}
        total={pagination.total}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />

      {/* Modals */}
      <ViewTeacherModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        teacherId={selectedTeacherId}
        onEdit={handleEditTeacher}
      />

      <EditTeacherModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        teacherId={selectedTeacherId}
      />

      <DeleteTeacherModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        teacherId={selectedTeacherId}
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

export default AdminTeachers;
