import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types for Schools Data
export interface SchoolIcon {
  url: string;
  key: string;
  bucket: string;
}

export interface SchoolBreakdown {
  teachers: {
    total: number;
  };
  students: {
    total: number;
  };
  classes: {
    total: number;
  };
  subjects: {
    total: number;
  };
  parents: {
    total: number;
  };
  users: {
    total: number;
  };
  academicSessions: {
    total: number;
    current: {
      id: string;
      academic_year: string;
      term: string;
      status: string;
    } | null;
  };
  content: {
    assessments: number;
    assignments: number;
  };
  subscription: {
    plan_type: string;
    name: string;
    status: string;
    is_active: boolean;
  } | null;
}

export interface School {
  id: string;
  school_name: string;
  school_email: string;
  school_phone: string;
  school_address: string;
  school_type: string;
  school_ownership: string;
  status: string;
  school_icon: SchoolIcon | null;
  platformId: string | null;
  createdAt: string;
  updatedAt: string;
  breakdown: SchoolBreakdown;
}

export interface SchoolsStatistics {
  overview: {
    totalSchools: number;
    totalTeachers: number;
    totalStudents: number;
    totalClasses: number;
    totalSubjects: number;
    totalParents: number;
    totalUsers: number;
  };
  schoolsByStatus: {
    approved: number;
    pending: number;
    rejected: number;
    suspended: number;
    closed: number;
    not_verified: number;
    failed: number;
    archived: number;
  };
  schoolsByType: {
    primary: number;
    secondary: number;
    primary_and_secondary: number;
  };
  schoolsByOwnership: {
    government: number;
    private: number;
  };
}

export interface AllSchoolsResponse {
  statistics: SchoolsStatistics;
  schools: School[];
  total: number;
}

// Inner data type for the authenticated API response
export type AllSchoolsApiResponse = AllSchoolsResponse;

export function useLibraryOwnerSchools() {
  return useQuery<AllSchoolsResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "schools"],
    queryFn: async () => {
      logger.info("[useLibraryOwnerSchools] Fetching schools data...");
      const response = await authenticatedApi.get<AllSchoolsApiResponse>(
        "/library/schools/getallschools"
      );

      if (response.success && response.data) {
        logger.info("[useLibraryOwnerSchools] Schools data fetched successfully", {
          total: response.data.total,
          schoolsCount: response.data.schools.length,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch schools",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh (within staleTime)
    refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
  });
}

