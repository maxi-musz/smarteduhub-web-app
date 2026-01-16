import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { useToast } from "@/hooks/use-toast";

// API Response Types based on the API documentation
export interface ApiTeacher {
  id: string;
  teacherId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: "male" | "female" | "other";
  status: "active" | "inactive" | "suspended";
  display_picture: string | null;
  subjects?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  classes?: Array<{
    id: string;
    name: string;
  }>;
  isClassTeacher: boolean;
  classManagingDetails: {
    id: string;
    name: string;
    studentCount: number;
  } | null;
  currentClass: {
    classId: string;
    className: string;
    subjectName: string;
    startTime: string;
    endTime: string;
  } | null;
  createdAt: string;
}

export interface TeachersDashboardResponse {
  dashboardStats: {
    totalTeachers: number;
    activeTeachers: number;
    inactiveTeachers: number;
    suspendedTeachers: number;
    maleTeachers: number;
    femaleTeachers: number;
    classTeachers: number;
    subjectTeachers: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  teachers: ApiTeacher[];
  appliedFilters: {
    search: string | null;
    status: string | null;
    gender: string | null;
    class_id: string | null;
    sort_by: string;
    sort_order: string;
  };
}

export interface ClassesSubjectsResponse {
  totalClasses: number;
  totalSubjects: number;
  classes: Array<{
    id: string;
    name: string;
    hasClassTeacher: boolean;
    classTeacher: string | null;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

export interface TeacherDetailsResponse {
  id: string;
  teacherId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: "male" | "female" | "other";
  display_picture: string | null;
  status: "active" | "inactive" | "suspended";
  school_id: string;
  subjectsTeaching: Array<{
    id: string;
    subject: {
      id: string;
      name: string;
      description?: string;
    };
  }>;
  classesManaging: Array<{
    id: string;
    name: string;
    classTeacherId: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherClassesSubjectsResponse {
  teacherId: string;
  teacherName: string;
  classes: Array<{
    id: string;
    name: string;
    isClassTeacher: boolean;
    studentCount: number;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    description?: string;
    classesTeaching: Array<{
      id: string;
      name: string;
    }>;
  }>;
  totalClasses: number;
  totalSubjects: number;
}

// Query parameters for dashboard
export interface TeachersDashboardParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended" | "";
  gender?: "male" | "female" | "other" | "";
  class_id?: string;
  sort_by?: "name" | "createdAt" | "status";
  sort_order?: "asc" | "desc";
}

// Hook to fetch teachers dashboard with filters
export function useTeachersDashboard(params?: TeachersDashboardParams) {
  return useQuery<TeachersDashboardResponse, AuthenticatedApiError>({
    queryKey: ["teachers", "dashboard", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.status) queryParams.append("status", params.status);
      if (params?.gender) queryParams.append("gender", params.gender);
      if (params?.class_id) queryParams.append("class_id", params.class_id);
      if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

      const endpoint = `/director/teachers/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authenticatedApi.get<TeachersDashboardResponse>(endpoint);

      // Debug: Log the raw response to understand the structure
      // if (process.env.NODE_ENV === "development") {
      //   console.log("[Teachers API] Raw response:", JSON.stringify(response, null, 2));
      //   console.log("[Teachers API] Response success:", response.success);
      //   console.log("[Teachers API] Response data:", response.data);
      //   console.log("[Teachers API] Response data type:", typeof response.data);
      // }

      if (response.success && response.data) {
        // Handle potential double nesting (response.data.data)
        let data = response.data;
        if (data && typeof data === "object" && "data" in data && !("teachers" in data)) {
          data = (data as unknown as { data: TeachersDashboardResponse }).data;
        }

        // Ensure teachers array exists and has valid structure
        
        // Transform basic_details to dashboardStats if it exists
        const rawData = data as unknown as Record<string, unknown>;
        if (rawData.basic_details && !data.dashboardStats) {
          const basicDetails = rawData.basic_details as Record<string, unknown>;
          data.dashboardStats = {
            totalTeachers: (basicDetails.totalTeachers as number) || 0,
            activeTeachers: (basicDetails.activeTeachers as number) || 0,
            inactiveTeachers: (basicDetails.inactiveTeachers as number) || 0,
            suspendedTeachers: (basicDetails.suspendedTeachers as number) || 0,
            maleTeachers: (basicDetails.maleTeachers as number) || 0,
            femaleTeachers: (basicDetails.femaleTeachers as number) || 0,
            classTeachers: (basicDetails.classTeachers as number) || 0,
            subjectTeachers: (basicDetails.subjectTeachers as number) || 0,
          };
        }

        // Transform pagination fields if they use different names
        if (rawData.pagination) {
          const pag = rawData.pagination as Record<string, unknown>;
          if (pag.total_pages !== undefined || pag.current_page !== undefined || pag.total_results !== undefined) {
            data.pagination = {
              total: (pag.total_results as number) || (pag.total as number) || 0,
              page: (pag.current_page as number) || (pag.page as number) || 1,
              limit: (pag.results_per_page as number) || (pag.limit as number) || 10,
              totalPages: (pag.total_pages as number) || (pag.totalPages as number) || 1,
            };
          }
        }

        // Validate and normalize teacher data
        if (data.teachers && Array.isArray(data.teachers)) {
          data.teachers = data.teachers.map((teacher: unknown) => {
            // Handle potential different field name variations
            const t = teacher as Record<string, unknown>;
            
            // Parse name field to extract first_name and last_name
            const fullName = (t.name as string) || "";
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";
            
            // Extract contact information
            const contact = t.contact as Record<string, unknown> | undefined;
            const email = (contact?.email as string) || (t.email as string) || "";
            const phoneNumber = (contact?.phone as string) || (t.phone_number as string) || "";
            
            return {
              id: (t.id as string) || "",
              teacherId: (t.teacherId as string) || (t.teacher_id as string) || "",
              first_name: (t.first_name as string) || firstName,
              last_name: (t.last_name as string) || lastName,
              email,
              phone_number: phoneNumber,
              gender: (t.gender as "male" | "female" | "other") || "other",
              status: (t.status as "active" | "inactive" | "suspended") || "inactive",
              display_picture: (t.display_picture as string | null) || (t.displayPicture as string | null) || null,
              subjects: (t.subjects as Array<{ id: string; name: string; description?: string }>) || [],
              classes: (t.classes as Array<{ id: string; name: string }>) || [],
              isClassTeacher: ((t.isClassTeacher as boolean) ?? (t.is_class_teacher as boolean) ?? (((t.classTeacher as string) !== "None" && (t.classTeacher as string) !== "" && (t.classTeacher as string) !== null))) || false,
              classManagingDetails: (t.classManagingDetails as { id: string; name: string; studentCount: number } | null) || 
                                    (t.class_managing_details as { id: string; name: string; studentCount: number } | null) || null,
              currentClass: (t.currentClass as { classId: string; className: string; subjectName: string; startTime: string; endTime: string } | null) || 
                           (t.nextClass as { classId: string; className: string; subjectName: string; startTime: string; endTime: string } | null) || null,
              createdAt: (t.createdAt as string) || (t.created_at as string) || new Date().toISOString(),
            } as ApiTeacher;
          });
        } else {
          // If teachers is not an array, set it to empty array
          data.teachers = [];
        }

        // Ensure dashboardStats exists
        if (!data.dashboardStats) {
          data.dashboardStats = {
            totalTeachers: 0,
            activeTeachers: 0,
            inactiveTeachers: 0,
            suspendedTeachers: 0,
            maleTeachers: 0,
            femaleTeachers: 0,
            classTeachers: 0,
            subjectTeachers: 0,
          };
        }

        // Ensure pagination exists
        if (!data.pagination) {
          data.pagination = {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 1,
          };
        }

        // if (process.env.NODE_ENV === "development") {
        //   console.log("[Teachers API] Normalized data:", data);
        //   console.log("[Teachers API] Teachers count:", data.teachers.length);
        // }

        return data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch teachers dashboard",
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

// Hook to fetch classes and subjects
export function useClassesSubjects() {
  return useQuery<ClassesSubjectsResponse, AuthenticatedApiError>({
    queryKey: ["teachers", "classes-subjects"],
    queryFn: async () => {
      const response = await authenticatedApi.get<ClassesSubjectsResponse>(
        "/director/teachers/classes-subjects"
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch classes and subjects",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch teacher by ID
export function useTeacherById(teacherId: string | null) {
  return useQuery<TeacherDetailsResponse, AuthenticatedApiError>({
    queryKey: ["teachers", teacherId],
    queryFn: async () => {
      if (!teacherId) throw new Error("Teacher ID is required");
      
      const response = await authenticatedApi.get<TeacherDetailsResponse>(
        `/director/teachers/${teacherId}`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch teacher details",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch teacher classes and subjects
export function useTeacherClassesSubjects(teacherId: string | null) {
  return useQuery<TeacherClassesSubjectsResponse, AuthenticatedApiError>({
    queryKey: ["teachers", teacherId, "classes-subjects"],
    queryFn: async () => {
      if (!teacherId) throw new Error("Teacher ID is required");
      
      const response = await authenticatedApi.get<TeacherClassesSubjectsResponse>(
        `/director/teachers/${teacherId}/classes-subjects`
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch teacher classes and subjects",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Add Teacher Request
export interface AddTeacherRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: "male" | "female" | "other";
  display_picture?: string;
  status?: "active" | "inactive" | "suspended";
  password?: string;
  subjectsTeaching?: string[];
  classesManaging?: string[];
}

export interface AddTeacherResponse {
  teacher: {
    id: string;
    teacherId: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: "male" | "female" | "other";
    display_picture: string | null;
    status: "active" | "inactive";
    school_id: string;
    createdAt: string;
  };
  credentials: {
    email: string;
    password: string;
    loginUrl: string;
  };
  assignments: {
    subjects: Array<{ id: string; name: string }>;
    classes: Array<{ id: string; name: string }>;
  };
}

// Hook to add teacher
export function useAddTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<AddTeacherResponse, AuthenticatedApiError, AddTeacherRequest>({
    mutationFn: async (data) => {
      const response = await authenticatedApi.post<AddTeacherResponse>(
        "/director/teachers",
        data
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to add teacher",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast({
        title: "Teacher added successfully",
        description: `Credentials sent to ${variables.email}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add teacher",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update Teacher Request
export interface UpdateTeacherRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  display_picture?: string;
  status?: "active" | "inactive" | "suspended";
  password?: string;
  subjectsTeaching?: string[];
  classesManaging?: string[];
}

export interface UpdateTeacherResponse {
  teacher: {
    id: string;
    teacherId: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    gender: "male" | "female" | "other";
    display_picture: string | null;
    status: "active" | "inactive" | "suspended";
    school_id: string;
    createdAt: string;
    updatedAt: string;
  };
  changes: {
    updatedFields: string[];
    addedSubjects: Array<{ id: string; name: string }>;
    removedSubjects: Array<{ id: string; name: string }>;
    addedClasses: Array<{ id: string; name: string }>;
    removedClasses: Array<{ id: string; name: string }>;
  };
}

// Hook to update teacher
export function useUpdateTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    UpdateTeacherResponse,
    AuthenticatedApiError,
    { teacherId: string; data: UpdateTeacherRequest }
  >({
    mutationFn: async ({ teacherId, data }) => {
      const response = await authenticatedApi.patch<UpdateTeacherResponse>(
        `/director/teachers/${teacherId}`,
        data
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update teacher",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] });
      toast({
        title: "Teacher updated successfully",
        description: "Teacher information has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update teacher",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook to delete teacher
export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<void, AuthenticatedApiError, string>({
    mutationFn: async (teacherId) => {
      const response = await authenticatedApi.delete(`/director/teachers/${teacherId}`);

      if (!response.success) {
        throw new AuthenticatedApiError(
          response.message || "Failed to delete teacher",
          response.statusCode || 400,
          response
        );
      }
    },
    onSuccess: (_, teacherId) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.removeQueries({ queryKey: ["teachers", teacherId] });
      toast({
        title: "Teacher deleted successfully",
        description: "Teacher has been removed",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete teacher",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook to assign subjects to teacher
export function useAssignSubjectsToTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    {
      teacherId: string;
      teacherName: string;
      assignedSubjects: Array<{ id: string; name: string }>;
      totalSubjects: number;
    },
    AuthenticatedApiError,
    { teacherId: string; subjectIds: string[] }
  >({
    mutationFn: async ({ teacherId, subjectIds }) => {
      const response = await authenticatedApi.post<{
        teacherId: string;
        teacherName: string;
        assignedSubjects: Array<{ id: string; name: string }>;
        totalSubjects: number;
      }>(`/director/teachers/${teacherId}/subjects`, { subjectIds });

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to assign subjects",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId, "classes-subjects"] });
      toast({
        title: "Subjects assigned successfully",
        description: `${data.totalSubjects} subject(s) assigned to ${data.teacherName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to assign subjects",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook to assign class to teacher
export function useAssignClassToTeacher() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    {
      teacherId: string;
      teacherName: string;
      assignedClass: {
        id: string;
        name: string;
        studentCount: number;
      };
    },
    AuthenticatedApiError,
    { teacherId: string; classId: string }
  >({
    mutationFn: async ({ teacherId, classId }) => {
      const response = await authenticatedApi.post<{
        teacherId: string;
        teacherName: string;
        assignedClass: {
          id: string;
          name: string;
          studentCount: number;
        };
      }>(`/director/teachers/${teacherId}/class`, { classId });

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to assign class",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId] });
      queryClient.invalidateQueries({ queryKey: ["teachers", variables.teacherId, "classes-subjects"] });
      queryClient.invalidateQueries({ queryKey: ["teachers", "classes-subjects"] });
      toast({
        title: "Class assigned successfully",
        description: `${data.assignedClass.name} assigned to ${data.teacherName}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to assign class",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Legacy hook for backward compatibility
export function useTeachersData() {
  return useTeachersDashboard();
}

