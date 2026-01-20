import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on the backend API response
export interface StudentSubjectDetailResponse {
  success: boolean;
  message: string;
  data: StudentSubjectDetailData;
}

export interface StudentSubjectDetailData {
  subject: SubjectDetail;
  topics: Topic[];
  stats: SubjectDetailStats;
  pagination: Pagination;
}

export interface SubjectDetail {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  thumbnail: {
    url: string;
    key: string;
  } | null;
  school: {
    id: string;
    school_name: string;
  };
  academicSession: {
    id: string;
    academic_year: string;
    term: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  instructions: string;
  order: number;
  status: string;
  videos: Video[];
  materials: Material[];
  assignments: Assignment[];
  assessments: Assessment[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  duration: string;
  thumbnail: string;
  size: string;
  views: number;
  status: string;
  uploadedAt: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  size: string;
  downloads: number;
  status: string;
  uploadedAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: string;
  createdAt: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: number;
  maxAttempts: number;
  passingScore: number;
  status: string;
  createdAt: string;
}

export interface SubjectDetailStats {
  totalTopics: number;
  totalVideos: number;
  totalMaterials: number;
  totalAssignments: number;
  totalQuizzes: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UseStudentSubjectDetailParams {
  subjectId: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch student subject detail data
 */
const fetchStudentSubjectDetail = async (
  params: UseStudentSubjectDetailParams
): Promise<StudentSubjectDetailData> => {
  const { subjectId, page = 1, limit = 10 } = params;

  logger.info("[use-student-subject-detail] Fetching subject detail", {
    subjectId,
    page,
    limit,
  });

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await authenticatedApi.get<StudentSubjectDetailData>(
      `/students/subjects/${subjectId}?${queryParams.toString()}`
    );

    logger.info("[use-student-subject-detail] Subject detail fetched successfully", response);

    // authenticatedApi returns the parsed JSON response
    if (response && typeof response === "object" && "data" in response && response.success && response.data) {
      return response.data;
    }

    // If response is already the data object
    if (response && typeof response === "object" && "subject" in response) {
      return response as unknown as StudentSubjectDetailData;
    }

    logger.error("[use-student-subject-detail] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from subject detail API");
  } catch (error) {
    logger.error("[use-student-subject-detail] Error fetching subject detail:", { 
      error: error instanceof Error ? error.message : String(error) 
    });
    throw error;
  }
};

/**
 * Hook to fetch student subject detail with pagination
 */
export const useStudentSubjectDetail = (params: UseStudentSubjectDetailParams) => {
  const { subjectId, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["student", "subject", subjectId, page, limit],
    queryFn: () => fetchStudentSubjectDetail({ subjectId, page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Keep previous data while fetching new page
    enabled: !!subjectId, // Only fetch if subjectId is provided
  });
};


