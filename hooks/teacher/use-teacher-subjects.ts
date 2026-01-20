import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

// Types based on TEACHER-SUBJECTS-API.md
export interface TeacherSubject {
  id: string;
  name: string;
  code: string | null;
  color: string;
  description: string | null;
  thumbnail: {
    secure_url: string;
    public_id: string;
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
  topics: Array<{
    id: string;
    title: string;
    order: number;
    is_active: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSubjectDetail extends TeacherSubject {
  topics: Array<{
    id: string;
    title: string;
    description: string | null;
    order: number;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface TeacherSubjectWithContent {
  id: string;
  title: string;
  description: string;
  order: number;
  status: string;
  videos: Array<{
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    url: string;
    uploadedAt: string;
    size: string;
    views: number;
    status: string;
  }>;
  materials: Array<{
    id: string;
    title: string;
    type: string;
    size: string;
    url: string;
    uploadedAt: string;
    downloads: number;
    status: string;
  }>;
  instructions: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSubjectsListData {
  data: TeacherSubject[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface TeacherComprehensiveSubjectData {
  subject: {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    code: string;
    color: string;
    status: string;
    totalTopics: number;
    totalVideos: number;
    totalMaterials: number;
    totalStudents: number;
    progress: number;
    classes: string[];
    createdAt: string;
    updatedAt: string;
  };
  topics: TeacherSubjectWithContent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    search: string;
    status: string;
    type: string;
    orderBy: string;
    orderDirection: string;
  };
  stats: {
    totalTopics: number;
    totalVideos: number;
    totalMaterials: number;
    totalStudents: number;
    completedTopics: number;
    inProgressTopics: number;
    notStartedTopics: number;
  };
}

export interface UseTeacherSubjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  academicSessionId?: string;
  color?: string;
  isActive?: boolean;
  sortBy?: "name" | "code" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

export interface UseTeacherComprehensiveSubjectParams {
  subjectId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: "all" | "videos" | "materials" | "mixed";
  orderBy?: "order" | "title" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
}

/**
 * Fetch all teacher subjects
 */
const fetchTeacherSubjects = async (
  params: UseTeacherSubjectsParams
): Promise<TeacherSubjectsListData> => {
  const {
    page = 1,
    limit = 10,
    search,
    academicSessionId,
    color,
    isActive,
    sortBy = "name",
    sortOrder = "asc",
  } = params;

  logger.info("[use-teacher-subjects] Fetching teacher subjects", { ...params });

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (search) queryParams.append("search", search);
    if (academicSessionId) queryParams.append("academicSessionId", academicSessionId);
    if (color) queryParams.append("color", color);
    if (isActive !== undefined) queryParams.append("isActive", isActive.toString());

    const response = await authenticatedApi.get<TeacherSubjectsListData>(
      `/teachers/subjects?${queryParams.toString()}`
    );

    logger.info("[use-teacher-subjects] Subjects fetched successfully", response);

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.success &&
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      // API returns { success, message, data: { data: [...], meta: {...} } }
      return response.data as TeacherSubjectsListData;
    }

    logger.error("[use-teacher-subjects] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from subjects API");
  } catch (error) {
    logger.error("[use-teacher-subjects] Error fetching subjects:", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Fetch teacher subject by ID
 */
const fetchTeacherSubjectById = async (subjectId: string): Promise<TeacherSubjectDetail> => {
  logger.info("[use-teacher-subject-detail] Fetching subject", { subjectId });

  try {
    const response = await authenticatedApi.get<TeacherSubjectDetail>(
      `/teachers/subjects/${subjectId}`
    );

    logger.info("[use-teacher-subject-detail] Subject fetched successfully", response);

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.success &&
      response.data
    ) {
      return response.data;
    }

    logger.error("[use-teacher-subject-detail] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from subject detail API");
  } catch (error) {
    logger.error("[use-teacher-subject-detail] Error fetching subject:", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Fetch comprehensive teacher subject with topics and content
 */
const fetchTeacherComprehensiveSubject = async (
  params: UseTeacherComprehensiveSubjectParams
): Promise<TeacherComprehensiveSubjectData> => {
  const {
    subjectId,
    page = 1,
    limit = 10,
    search,
    status,
    type = "all",
    orderBy = "order",
    orderDirection = "asc",
  } = params;

  logger.info("[use-teacher-comprehensive-subject] Fetching comprehensive subject", { ...params });

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      type,
      orderBy,
      orderDirection,
    });

    if (search) queryParams.append("search", search);
    if (status) queryParams.append("status", status);

    const response = await authenticatedApi.get<TeacherComprehensiveSubjectData>(
      `/teachers/subjects/${subjectId}/comprehensive?${queryParams.toString()}`
    );

    logger.info(
      "[use-teacher-comprehensive-subject] Comprehensive subject fetched successfully",
      response
    );

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      response.success &&
      response.data
    ) {
      return response.data;
    }

    logger.error("[use-teacher-comprehensive-subject] Unexpected response structure:", {
      response,
    });
    throw new Error("Unexpected response structure from comprehensive subject API");
  } catch (error) {
    logger.error("[use-teacher-comprehensive-subject] Error fetching comprehensive subject:", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Hook to fetch all teacher subjects
 */
export const useTeacherSubjects = (params: UseTeacherSubjectsParams = {}) => {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["teacher", "subjects", page, limit, params.search, params.academicSessionId],
    queryFn: () => fetchTeacherSubjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
};

/**
 * Hook to fetch teacher subject by ID
 */
export const useTeacherSubjectById = (subjectId: string) => {
  return useQuery({
    queryKey: ["teacher", "subject", subjectId],
    queryFn: () => fetchTeacherSubjectById(subjectId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!subjectId,
  });
};

/**
 * Hook to fetch comprehensive teacher subject with topics and content
 */
export const useTeacherComprehensiveSubject = (
  params: UseTeacherComprehensiveSubjectParams
) => {
  const { subjectId, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: [
      "teacher",
      "subject",
      subjectId,
      "comprehensive",
      page,
      limit,
      params.search,
      params.status,
      params.type,
      params.orderBy,
      params.orderDirection,
    ],
    queryFn: () => fetchTeacherComprehensiveSubject(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    enabled: !!subjectId,
  });
};

