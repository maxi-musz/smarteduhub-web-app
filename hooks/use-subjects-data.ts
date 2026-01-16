import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { useToast } from "@/hooks/use-toast";

// API Response Types based on the API documentation
export interface ApiSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  class: {
    id: string;
    name: string;
  } | null;
  teachers: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export interface AvailableClass {
  id: string;
  name: string;
  class_teacher: {
    id: string;
    name: string;
    email: string;
  } | null;
  student_count: number;
  subject_count: number;
}

export interface SubjectsListResponse {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search: string | null;
    classId: string | null;
  };
  subjects: ApiSubject[];
  availableClasses: AvailableClass[];
}

export interface ClassGroupedSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  teachers: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

export interface ClassGroup {
  classId: string;
  className: string;
  subjectsCount: number;
  subjects: ClassGroupedSubject[];
}

export interface SubjectsGroupedByClassResponse {
  groupedByClass: true;
  totalClasses: number;
  totalSubjects: number;
  classes: ClassGroup[];
  availableClasses: AvailableClass[];
}

export type SubjectsResponse = SubjectsListResponse | SubjectsGroupedByClassResponse;

// Query parameters for fetching subjects
export interface SubjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  groupByClass?: boolean;
}

// Hook to fetch all subjects
export function useSubjects(params?: SubjectsParams) {
  return useQuery<SubjectsResponse, AuthenticatedApiError>({
    queryKey: ["subjects", "list", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.search) queryParams.append("search", params.search);
      if (params?.classId) queryParams.append("classId", params.classId);
      if (params?.groupByClass) queryParams.append("groupByClass", "true");

      const endpoint = `/director/subjects/fetch-all-subjects${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await authenticatedApi.get<SubjectsResponse>(endpoint);

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch subjects",
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

// Available teachers and classes response
export interface AvailableTeachersClassesResponse {
  teachers: Array<{
    id: string;
    name: string;
    display_picture: string | null;
  }>;
  classes: Array<{
    id: string;
    name: string;
  }>;
}

// Hook to fetch available teachers and classes
export function useAvailableTeachersClasses() {
  return useQuery<AvailableTeachersClassesResponse, AuthenticatedApiError>({
    queryKey: ["subjects", "available-teachers-classes"],
    queryFn: async () => {
      const response = await authenticatedApi.get<AvailableTeachersClassesResponse>(
        "/director/subjects/available-teachers-classes"
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch available teachers and classes",
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

// Create Subject Request
export interface CreateSubjectRequest {
  subject_name: string;
  code?: string;
  description?: string;
  color?: string;
  class_taking_it?: string;
  teacher_taking_it?: string;
}

export interface CreateSubjectResponse {
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
    description: string;
    schoolId: string;
    classId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  assignedClass: {
    id: string;
    name: string;
  } | null;
  assignedTeacher: {
    id: string;
    name: string;
    email: string;
  } | null;
  emailSent: boolean;
}

// Hook to create subject
export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<CreateSubjectResponse, AuthenticatedApiError, CreateSubjectRequest>({
    mutationFn: async (data) => {
      const response = await authenticatedApi.post<CreateSubjectResponse>(
        "/director/subjects/create-subject",
        data
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to create subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({
        title: "Subject created successfully",
        description: "The subject has been created and assigned.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Update Subject Request
export interface UpdateSubjectRequest {
  subject_name?: string;
  code?: string;
  description?: string;
  color?: string;
  class_taking_it?: string;
  teachers_taking_it?: string[];
}

export interface UpdateSubjectResponse {
  subject: {
    id: string;
    name: string;
    code: string;
    color: string;
    description: string;
    schoolId: string;
    classId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  changes: {
    updatedFields: string[];
    class: {
      previous: {
        id: string;
        name: string;
      } | null;
      current: {
        id: string;
        name: string;
      } | null;
    };
    teachers: {
      added: Array<{
        id: string;
        name: string;
        email: string;
      }>;
      removed: Array<{
        id: string;
        name: string;
        email: string;
      }>;
      current: Array<{
        id: string;
        name: string;
        email: string;
      }>;
    };
  };
  emailsSent: {
    addedTeachers: number;
    removedTeachers: number;
  };
}

// Hook to update subject
export function useUpdateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<
    UpdateSubjectResponse,
    AuthenticatedApiError,
    { subjectId: string; data: UpdateSubjectRequest }
  >({
    mutationFn: async ({ subjectId, data }) => {
      const response = await authenticatedApi.patch<UpdateSubjectResponse>(
        `/director/subjects/${subjectId}`,
        data
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to update subject",
        response.statusCode || 400,
        response
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      queryClient.invalidateQueries({ queryKey: ["subjects", variables.subjectId] });
      toast({
        title: "Subject updated successfully",
        description: "The subject information has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update subject",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

