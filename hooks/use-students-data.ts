import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";

// API Response Types
export interface ApiStudent {
  id: string;
  school_id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  display_picture: string | null;
  gender: "male" | "female" | "other";
  status: "active" | "inactive" | "suspended";
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
  classesEnrolled: Array<{
    id: string;
    name: string;
    schoolId: string;
    classTeacherId: string | null;
  }>;
}

export interface StudentsApiResponse {
  basic_details: {
    totalStudents: number;
    activeStudents: number;
    totalClasses: number;
  };
  pagination: {
    total_pages: number;
    current_page: number;
    total_results: number;
    results_per_page: number;
  };
  students: ApiStudent[];
}

export function useStudentsData() {
  return useQuery<StudentsApiResponse, AuthenticatedApiError>({
    queryKey: ["students", "data"],
    queryFn: async () => {
      const response = await authenticatedApi.get<StudentsApiResponse>(
        "/director/students/dashboard"
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch students data",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

