"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Download, Upload, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useStudentsDashboard, type ApiStudent } from "@/hooks/student/use-students-data";
import {
  StudentStatsCards,
  StudentFilters,
  StudentTable,
  ViewPerformanceModal,
  AddStudentModal,
  EditStudentModal,
  ViewStudentModal,
  DeleteStudentModal,
  ErrorModal,
} from "./student-components";

const AdminStudents = () => {
  const { toast } = useToast();

  // Filter and pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [sortBy] = useState<"name" | "createdAt" | "cgpa" | "position">("createdAt");
  const [sortOrder] = useState<"asc" | "desc">("desc");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<ApiStudent | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Fetch students dashboard with filters
  const {
    data: dashboardData,
    isLoading,
    error: queryError,
    refetch,
  } = useStudentsDashboard({
    page,
    limit,
    search: searchQuery || undefined,
    status: filterStatus === "all" ? undefined : (filterStatus as "active" | "inactive" | "suspended" | undefined),
    class_id: filterClass === "all" ? undefined : filterClass,
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
        return "You don&apos;t have permission to access this data.";
      } else {
        return queryError.message;
      }
    }

    return "An unexpected error occurred while loading students data.";
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

  // Handle view performance
  const handleViewPerformance = (student: ApiStudent) => {
    setSelectedStudent(student);
    setIsPerformanceModalOpen(true);
  };

  // Handle edit student
  const handleEditStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsEditModalOpen(true);
  };

  // Handle delete student
  const handleDeleteStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsDeleteModalOpen(true);
  };

  // Statistics
  const stats = dashboardData?.dashboardStats || {
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    suspendedStudents: 0,
    enrolledInClass: 0,
    notEnrolled: 0,
    averageCGPA: 0,
    topPerformers: 0,
  };

  const students = dashboardData?.students || [];
  const totalClasses = dashboardData?.availableClasses?.length || 0;

  // Filter students locally (since API might not support all filters)
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;
    const matchesClass =
      filterClass === "all" ||
      student.current_class.toLowerCase().includes(filterClass.toLowerCase());
    return matchesSearch && matchesStatus && matchesClass;
  });

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Students Management
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StudentStatsCards
          totalStudents={stats.totalStudents}
          activeStudents={stats.activeStudents}
          totalClasses={totalClasses}
          isLoading={isLoading}
        />
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-12">
        <StudentFilters
          searchQuery={searchQuery}
          filterStatus={filterStatus}
          filterClass={filterClass}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          onStatusChange={(value) => {
            setFilterStatus(value);
            setPage(1);
          }}
          onClassChange={(value) => {
            setFilterClass(value);
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
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
            <AddStudentModal
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <StudentTable
            students={filteredStudents}
            isLoading={isLoading}
            onViewPerformance={handleViewPerformance}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <ViewPerformanceModal
        open={isPerformanceModalOpen}
        onOpenChange={setIsPerformanceModalOpen}
        student={selectedStudent}
      />

      <EditStudentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        studentId={selectedStudentId}
      />

      <ViewStudentModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        studentId={selectedStudentId}
      />

      <DeleteStudentModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        studentId={selectedStudentId}
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

export default AdminStudents;
