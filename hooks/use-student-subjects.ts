import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on the backend API response
export interface StudentSubjectsResponse {
  success: boolean;
  message: string;
  data: StudentSubjectsData;
}

export interface StudentSubjectsData {
  subjects: StudentSubject[];
  stats: SubjectStats;
  academicSession: AcademicSession;
  pagination: Pagination;
}

export interface StudentSubject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnail: string | null;
  timetableEntries: TimetableEntry[];
  classesTakingSubject: ClassTakingSubject[];
  contentCounts: ContentCounts;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableEntry {
  id: string;
  day_of_week: string;
  startTime: string;
  endTime: string;
  room: string;
  class: {
    id: string;
    name: string;
    classId: string;
  };
}

export interface ClassTakingSubject {
  id: string;
  name: string;
  classId: string;
}

export interface ContentCounts {
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
}

export interface SubjectStats {
  totalSubjects: number;
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
}

export interface AcademicSession {
  id: string;
  academic_year: string;
  term: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseStudentSubjectsParams {
  page?: number;
  limit?: number;
}

/**
 * Fetch student subjects data
 */
const fetchStudentSubjects = async (params: UseStudentSubjectsParams): Promise<StudentSubjectsData> => {
  const { page = 1, limit = 10 } = params;
  
  logger.info("[use-student-subjects] Fetching student subjects", { page, limit });
  
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await authenticatedApi.get<StudentSubjectsData>(
      `/students/subjects?${queryParams.toString()}`
    );

    logger.info("[use-student-subjects] Subjects fetched successfully", response);
    
    // authenticatedApi returns the parsed JSON response
    if (response && typeof response === 'object' && 'data' in response && response.success && response.data) {
      return response.data;
    }
    
    // If response is already the data object
    if (response && typeof response === 'object' && 'subjects' in response) {
      return response as unknown as StudentSubjectsData;
    }
    
    logger.error("[use-student-subjects] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from subjects API");
  } catch (error) {
    logger.error("[use-student-subjects] Error fetching subjects:", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
};

/**
 * Hook to fetch student subjects with pagination
 */
export const useStudentSubjects = (params: UseStudentSubjectsParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["student", "subjects", page, limit],
    queryFn: () => fetchStudentSubjects({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching new page
  });
};


