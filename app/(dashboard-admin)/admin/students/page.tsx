"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Users,
  Calendar,
  Download,
  Upload,
  MoreVertical,
  Clock,
  BookMarked,
  Copy,
  Grid2X2Check,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  useStudentsData,
  type StudentsApiResponse,
  type ApiStudent,
} from "@/hooks/use-students-data";

// Skeleton component
const SkeletonCard = () => (
  <Card className="bg-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </CardContent>
  </Card>
);

// Student Avatar component
const StudentAvatar = ({ student }: { student: ApiStudent }) => {
  const capitalizeWord = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getDisplayName = (firstName: string, lastName: string) => {
    const capitalizedLastName = capitalizeWord(lastName);
    const firstInitial = capitalizeWord(firstName)[0];
    return `${capitalizedLastName} ${firstInitial}.`;
  };

  const getFullName = (firstName: string, lastName: string) => {
    return `${capitalizeWord(firstName)} ${capitalizeWord(lastName)}`;
  };

  const fullName = getFullName(student.first_name, student.last_name);
  const displayName = getDisplayName(student.first_name, student.last_name);

  if (student.display_picture) {
    return (
      <div className="flex items-center gap-3">
        <div title={fullName} className="cursor-pointer">
          <Image
            src={student.display_picture}
            alt={fullName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
        <div
          className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
          title={fullName}
        >
          {displayName}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold cursor-pointer"
        title={fullName}
      >
        {getInitials(student.first_name, student.last_name)}
      </div>
      <div
        className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
        title={fullName}
      >
        {displayName}
      </div>
    </div>
  );
};

const AdminStudents = () => {
  const { toast } = useToast();

  // Use React Query hook for data fetching with automatic caching
  const {
    data: studentsData,
    isLoading,
    error: queryError,
    refetch,
  } = useStudentsData();

  const [showErrorModal, setShowErrorModal] = useState(false);

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

    return "An unexpected error occurred while loading students data.";
  }, [queryError]);

  // Show error modal when error occurs
  useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<ApiStudent | null>(
    null
  );
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);

  // Copy to clipboard functionality
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${type} copied successfully`,
        duration: 2000,
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  // Retry mechanism
  const handleRetry = () => {
    setShowErrorModal(false);
    refetch();
  };

  // Handle performance modal
  const handleViewPerformance = (student: ApiStudent) => {
    setSelectedStudent(student);
    setShowPerformanceModal(true);
  };

  const handleClosePerformanceModal = () => {
    setShowPerformanceModal(false);
    setSelectedStudent(null);
  };

  // Calculate statistics from API data
  const totalStudents = studentsData?.basic_details.totalStudents || 0;
  const activeStudents = studentsData?.basic_details.activeStudents || 0;
  const totalClasses = studentsData?.basic_details.totalClasses || 0;

  // Filter students from API data
  const filteredStudents = (studentsData?.students || []).filter((student) => {
    const matchesSearch =
      student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || student.status === filterStatus;
    const matchesClass =
      filterClass === "all" ||
      student.current_class.toLowerCase() === filterClass.toLowerCase();
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
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <div></div> {/* Empty space for removed card */}
          </>
        ) : (
          <>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Students</p>
                    <h3 className="text-2xl font-bold">{totalStudents}</h3>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Students</p>
                    <h3 className="text-2xl font-bold">{activeStudents}</h3>
                  </div>
                  <BookMarked className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Classes</p>
                    <h3 className="text-2xl font-bold">{totalClasses}</h3>
                  </div>
                  <Grid2X2Check className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <div></div> {/* Empty space for removed card */}
          </>
        )}
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-12">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="jss1">JSS1</SelectItem>
              <SelectItem value="jss2">JSS2</SelectItem>
              <SelectItem value="jss3">JSS3</SelectItem>
              <SelectItem value="ss1">SS1</SelectItem>
              <SelectItem value="ss2">SS2</SelectItem>
              <SelectItem value="ss3">SS3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Upload className="h-4 w-4" />
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Next Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton rows for table
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <StudentAvatar student={student} />
                      {/* Commented out school_id as requested */}
                      {/* <div className="text-xs text-gray-400 mt-1">
                        {student.school_id}
                      </div> */}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          <span
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() =>
                              copyToClipboard(student.email, "Email")
                            }
                          >
                            {student.email}
                          </span>
                          <Copy
                            className="h-3 w-3 ml-1 text-gray-400 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                              copyToClipboard(student.email, "Email")
                            }
                          />
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span
                            className="cursor-pointer hover:text-blue-600 transition-colors"
                            onClick={() =>
                              copyToClipboard(student.phone_number, "Phone")
                            }
                          >
                            {student.phone_number}
                          </span>
                          <Copy
                            className="h-3 w-3 ml-1 text-gray-400 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                              copyToClipboard(student.phone_number, "Phone")
                            }
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {student.current_class.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.next_class &&
                      student.next_class !== "No classes" ? (
                        <div className="text-sm">
                          <div className="font-medium">
                            {student.next_class}
                          </div>
                          {student.next_class_teacher && (
                            <div className="text-gray-500">
                              {student.next_class_teacher}
                            </div>
                          )}
                          {student.next_class_time && (
                            <div className="text-gray-400">
                              {student.next_class_time}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No upcoming class
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "active" ? "secondary" : "outline"
                        }
                        className={
                          student.status === "active"
                            ? "bg-blue-100 text-blue-800"
                            : student.status === "suspended"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-yellow-100 text-yellow-800 border-yellow-300"
                        }
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewPerformance(student)}
                          >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Performance
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            View Grade
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="h-4 w-4 mr-2" />
                            View Schedule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No students found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Modal */}
      <Dialog
        open={showPerformanceModal}
        onOpenChange={handleClosePerformanceModal}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Student Performance -{" "}
              {selectedStudent &&
                `${selectedStudent.first_name} ${selectedStudent.last_name}`}
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">
                      CGPA
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {selectedStudent.performance.cgpa.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">
                      Term Average
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {selectedStudent.performance.term_average}%
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">
                      Class Position
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      #{selectedStudent.performance.position}
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-sm text-orange-600 font-medium">
                      Attendance Rate
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      {selectedStudent.performance.attendance_rate}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 font-medium mb-2">
                    Improvement Rate
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-gray-700">
                      {selectedStudent.performance.improvement_rate > 0
                        ? "+"
                        : ""}
                      {selectedStudent.performance.improvement_rate}%
                    </div>
                    {selectedStudent.performance.improvement_rate > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {selectedStudent.performance.improvement_rate > 0
                      ? "Improving"
                      : selectedStudent.performance.improvement_rate < 0
                      ? "Declining"
                      : "Stable"}
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-xs text-blue-600 font-medium">
                  Student Info
                </div>
                <div className="text-sm text-blue-700">
                  <div>ID: {selectedStudent.student_id}</div>
                  <div>
                    Class: {selectedStudent.current_class.toUpperCase()}
                  </div>
                  <div>
                    Status:{" "}
                    <span className="capitalize">{selectedStudent.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleClosePerformanceModal} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Failed to Load Students Data
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-3">
              <Button onClick={handleRetry} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowErrorModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminStudents;
