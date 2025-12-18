import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";

// API Response Types
export interface ApiTeacher {
  id: string;
  name: string;
  display_picture: string | null;
  contact: {
    phone: string;
    email: string;
  };
  totalSubjects: number;
  classTeacher: string;
  nextClass: string | null;
  status: "active" | "inactive";
}

export interface TeachersApiResponse {
  basic_details: {
    totalTeachers: number;
    activeTeachers: number;
    maleTeachers: number;
    femaleTeachers: number;
  };
  teachers: ApiTeacher[];
}

export function useTeachersData() {
  return useQuery<TeachersApiResponse, AuthenticatedApiError>({
    queryKey: ["teachers", "data"],
    queryFn: async () => {
      const response = await authenticatedApi.get<TeachersApiResponse>(
        "/director/teachers/dashboard"
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch teachers data",
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

