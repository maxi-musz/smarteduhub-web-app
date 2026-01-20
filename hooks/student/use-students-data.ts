import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { useToast } from "@/hooks/use-toast";

// API Response Types based on the API documentation
export interface ApiStudent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: "male" | "female" | "other";
  status: "active" | "inactive" | "suspended";
  display_picture: string | null;
  role: string;
  school_id: string;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    student_id: string;
    admission_number: string | null;
    date_of_birth: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    guardian_email: string | null;
    address: string | null;
    current_class_id: string | null;
    current_class: {
      id: string;
      name: string;
      classId: string;
    } | null;
  };
  student_id: string;
  current_class: string;
  next_class: string;
  next_class_time: string | null;
  next_class_teacher: string | null;
  performance: {
    cgpa: number;
    term_average: number;
    improvement_rate: number;
    attendance_rate: number;
    position: number;
  };
}

export interface StudentsDashboardParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended";
  class_id?: string;
  classId?: string;
  sort_by?: "name" | "createdAt" | "cgpa" | "position";
  sort_order?: "asc" | "desc";
}

export interface StudentsDashboardResponse {
  dashboardStats: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    suspendedStudents: number;
    enrolledInClass: number;
    notEnrolled: number;
    averageCGPA: number;
    topPerformers: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  students: ApiStudent[];
  availableClasses: Array<{
    id: string;
    name: string;
    class_teacher: {
      id: string;
      name: string;
      email: string;
      display_picture: string | null;
    } | null;
    student_count: number;
    subject_count: number;
  }>;
  appliedFilters: {
    search: string | null;
    status: string | null;
    class_id: string | null;
    sort_by: string;
    sort_order: string;
  };
}

export interface EnrollStudentRequest {
  student_id: string;
  class_id: string;
}

export interface EnrollNewStudentRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: "male" | "female" | "other";
  class_id: string;
  display_picture?: string;
  date_of_birth?: string;
  admission_number?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  address?: string;
  emergency_contact?: string;
  blood_group?: string;
  medical_conditions?: string;
  allergies?: string;
  previous_school?: string;
  academic_level?: string;
  parent_id?: string;
  password?: string;
}

export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  gender?: "male" | "female" | "other";
  display_picture?: string;
  date_of_birth?: string;
  admission_number?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_email?: string;
  address?: string;
  emergency_contact?: string;
  blood_group?: string;
  medical_conditions?: string;
  allergies?: string;
  previous_school?: string;
  academic_level?: string;
  parent_id?: string;
  class_id?: string;
  status?: "active" | "inactive" | "suspended";
}

export interface AvailableClassesResponse {
  classes: Array<{
    id: string;
    name: string;
    class_teacher: {
      id: string;
      name: string;
      email: string;
      display_picture: string | null;
    } | null;
    student_count: number;
    subject_count: number;
  }>;
  summary: {
    total_classes: number;
    total_students: number;
    average_students_per_class: number;
    classes_with_teachers: number;
    classes_without_teachers: number;
  };
}

// Hook to fetch students dashboard
export function useStudentsDashboard(params?: StudentsDashboardParams) {
  return useQuery<StudentsDashboardResponse, AuthenticatedApiError>({
    queryKey: ["students", "dashboard", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.class_id) queryParams.append("class_id", params.class_id);
      if (params?.classId) queryParams.append("classId", params.classId);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

      const endpoint = `/director/students/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authenticatedApi.get<StudentsDashboardResponse>(endpoint);

      if (response.success && response.data) {
        // Transform dashboardStats if it comes as basic_details
        const rawData = response.data as unknown as Record<string, unknown>;
        if (rawData.basic_details && !response.data.dashboardStats) {
          const basicDetails = rawData.basic_details as Record<string, unknown>;
          response.data.dashboardStats = {
            totalStudents: (basicDetails.totalStudents as number) || 0,
            activeStudents: (basicDetails.activeStudents as number) || 0,
            inactiveStudents: (basicDetails.inactiveStudents as number) || 0,
            suspendedStudents: (basicDetails.suspendedStudents as number) || 0,
            enrolledInClass: (basicDetails.enrolledInClass as number) || 0,
            notEnrolled: (basicDetails.notEnrolled as number) || 0,
            averageCGPA: (basicDetails.averageCGPA as number) || 0,
            topPerformers: (basicDetails.topPerformers as number) || 0,
          };
        }

        // Transform pagination if it uses different field names
        if (rawData.pagination) {
          const pag = rawData.pagination as Record<string, unknown>;
          if (pag.total_pages !== undefined || pag.current_page !== undefined) {
            response.data.pagination = {
              total: (pag.total_results as number) || (pag.total as number) || 0,
              page: (pag.current_page as number) || (pag.page as number) || 1,
              limit: (pag.results_per_page as number) || (pag.limit as number) || 10,
              totalPages: (pag.total_pages as number) || (pag.totalPages as number) || 1,
              hasNext: (pag.hasNext as boolean) ?? false,
              hasPrev: (pag.hasPrev as boolean) ?? false,
            };
          }
        }

        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch students dashboard",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch available classes
export function useAvailableClasses() {
  return useQuery<AvailableClassesResponse, AuthenticatedApiError>({
    queryKey: ["students", "available-classes"],
    queryFn: async () => {
      const response = await authenticatedApi.get<AvailableClassesResponse>(
        "/director/students/available-classes"
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch available classes",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to enroll existing student to class
export function useEnrollStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    { student: { id: string; name: string; email: string }; class: { id: string; name: string }; enrolled_class: { id: string; name: string } },
    AuthenticatedApiError,
    EnrollStudentRequest
  >({
    mutationFn: async (data) => {
      const response = await authenticatedApi.post<
        { student: { id: string; name: string; email: string }; class: { id: string; name: string }; enrolled_class: { id: string; name: string } }
      >("/director/students/enroll-student", data);

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to enroll student",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Student enrolled successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll student",
        variant: "destructive",
      });
    },
  });
}

// Hook to enroll new student
export function useEnrollNewStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    { student: { id: string; user_id: string; student_id: string; name: string; email: string; class: string | null; generatedPassword?: string } },
    AuthenticatedApiError,
    EnrollNewStudentRequest
  >({
    mutationFn: async (data) => {
      const response = await authenticatedApi.post<
        { student: { id: string; user_id: string; student_id: string; name: string; email: string; class: string | null; generatedPassword?: string } }
      >("/director/students/enroll-new-student", data);

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to enroll new student",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Student enrolled successfully",
      });
      if (data.student.generatedPassword) {
        toast({
          title: "Password Generated",
          description: "A password has been auto-generated for this student",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll new student",
        variant: "destructive",
      });
    },
  });
}

// Hook to update student
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    { student: Record<string, unknown>; changes: { updatedFields: string[]; previousClass?: { id: string; name: string }; newClass?: { id: string; name: string } } },
    AuthenticatedApiError,
    { studentId: string; data: UpdateStudentRequest }
  >({
    mutationFn: async ({ studentId, data }) => {
      const response = await authenticatedApi.patch<
        { student: Record<string, unknown>; changes: { updatedFields: string[]; previousClass?: { id: string; name: string }; newClass?: { id: string; name: string } } }
      >(`/director/students/${studentId}`, data);

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update student",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update student",
        variant: "destructive",
      });
    },
  });
}

