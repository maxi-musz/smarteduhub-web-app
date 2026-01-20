import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types for Single School Data
export interface SchoolIcon {
  url: string;
  key: string;
  bucket: string;
}

export interface SchoolStatistics {
  overview: {
    teachers: number;
    students: number;
    classes: number;
    subjects: number;
    parents: number;
    users: number;
  };
  academic: {
    totalSessions: number;
    currentSession: {
      id: string;
      academic_year: string;
      term: string;
      status: string;
      start_date: string;
      end_date: string;
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
    cost: number;
    currency: string;
    billing_cycle: string;
  } | null;
}

export interface SchoolDetails {
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
  statistics: SchoolStatistics;
}

export interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  teacher_id: string;
  status: string;
  role: string;
  createdAt: string;
}

export interface Student {
  id: string;
  student_id: string;
  admission_number: string;
  current_class_id: string;
  status: string;
  admission_date: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Class {
  id: string;
  name: string;
  classId: number;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  createdAt: string;
}

export interface AcademicSession {
  id: string;
  academic_year: string;
  term: string;
  status: string;
  is_current: boolean;
  start_date: string;
  end_date: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  title: string;
  status: string;
  assessment_type: string;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  status: string;
  assignment_type: string;
  createdAt: string;
}

export interface SchoolDetailsData {
  teachers: {
    total: number;
    recent: Teacher[];
  };
  students: {
    total: number;
    recent: Student[];
  };
  classes: {
    total: number;
    list: Class[];
  };
  subjects: {
    total: number;
    list: Subject[];
  };
  academicSessions: {
    total: number;
    current: AcademicSession | null;
    all: AcademicSession[];
  };
  recentContent: {
    assessments: Assessment[];
    assignments: Assignment[];
  };
}

export interface SingleSchoolResponse {
  school: SchoolDetails;
  details: SchoolDetailsData;
}

// Inner data type for the authenticated API response
export type SingleSchoolApiResponse = SingleSchoolResponse;

export function useLibraryOwnerSchool(schoolId: string | null) {
  return useQuery<SingleSchoolResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "school", schoolId],
    queryFn: async () => {
      if (!schoolId) {
        throw new AuthenticatedApiError("School ID is required", 400);
      }

      logger.info(`[useLibraryOwnerSchool] Fetching school details for ID: ${schoolId}`);
      const response = await authenticatedApi.get<SingleSchoolApiResponse>(
        `/library/schools/getschoolbyid/${schoolId}`
      );

      if (response.success && response.data) {
        logger.info(`[useLibraryOwnerSchool] School details fetched successfully`, {
          schoolId,
          schoolName: response.data.school.school_name,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch school details",
        response.statusCode || 400,
        response
      );
    },
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists for 10 minutes
    retry: 1,
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnMount: false, // Don't refetch on mount if data is fresh (within staleTime)
    refetchOnReconnect: false, // Don't refetch on reconnect if data is fresh
  });
}

