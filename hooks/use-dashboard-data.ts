import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";

// Types for API response
type OngoingClass = {
  id?: string;
  class: string;
  subject: string;
  teacher: string;
  from: string;
  to: string;
};

type NotificationEvent = {
  id?: string;
  title: string;
  date: string;
  description: string;
};

export type DashboardData = {
  basic_details: {
    email: string;
    school_id: string;
  };
  teachers: {
    totalTeachers: number;
    activeClasses: number;
    totalSubjects: number;
  };
  students: {
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
  };
  finance: {
    totalRevenue: number;
    outstandingFees: number;
    totalExpenses: number;
    netBalance: number;
  };
  ongoingClasses: OngoingClass[];
  notifications: NotificationEvent[];
};

export function useDashboardData() {
  return useQuery<DashboardData, AuthenticatedApiError>({
    queryKey: ["dashboard", "data"],
    queryFn: async () => {
      const response = await authenticatedApi.get<DashboardData>(
        "/director/dashboard/fetch-dashboard-data"
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch dashboard data",
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

