import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { authenticatedApi } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useSession } from "next-auth/react";

// Types - shared across all roles
export interface Subject {
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

export interface SubjectDetail extends Subject {
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

export interface SubjectWithContent {
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

export interface SubjectsListData {
  data: Subject[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ComprehensiveSubjectData {
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
  topics: SubjectWithContent[];
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

export interface UseSubjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  academicSessionId?: string;
  color?: string;
  isActive?: boolean;
  sortBy?: "name" | "code" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  role?: "teacher" | "school_director" | "student";
}

export interface UseComprehensiveSubjectParams {
  subjectId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: "all" | "videos" | "materials" | "mixed";
  orderBy?: "order" | "title" | "createdAt" | "updatedAt";
  orderDirection?: "asc" | "desc";
  role?: "teacher" | "school_director" | "student";
}

/**
 * Get API endpoint prefix based on role
 */
function getRoleEndpointPrefix(role?: string): string {
  switch (role) {
    case "teacher":
      return "/teachers";
    case "school_director":
      return "/director";
    case "student":
      return "/students";
    default:
      return "/teachers"; // Default fallback
  }
}

/**
 * Fetch subjects for any role
 */
const fetchSubjects = async (
  params: UseSubjectsParams
): Promise<SubjectsListData> => {
  const {
    page = 1,
    limit = 10,
    search,
    academicSessionId,
    color,
    isActive,
    sortBy = "name",
    sortOrder = "asc",
    role,
  } = params;

  const rolePrefix = getRoleEndpointPrefix(role);
  logger.info(`[use-subjects] Fetching ${role || "teacher"} subjects`, { ...params });

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

    // Use the correct endpoint for school directors
    const endpoint = role === "school_director" 
      ? `${rolePrefix}/subjects/fetch-all-subjects?${queryParams.toString()}`
      : `${rolePrefix}/subjects?${queryParams.toString()}`;

    const response = await authenticatedApi.get<{
      data: Subject[];
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
      message?: string;
    }>(endpoint);

    logger.info(`[use-subjects] Subjects fetched successfully`, response);

    if (!response || typeof response !== "object") {
      logger.error("[use-subjects] Response is not an object:", { response });
      throw new Error("Invalid response format from subjects API");
    }

    if ("success" in response && response.success === false) {
      const errorMsg = response.message || "Failed to fetch subjects";
      logger.error("[use-subjects] Backend returned success: false", {
        message: errorMsg,
        response,
      });
      throw new Error(errorMsg);
    }

    // Handle director endpoint structure: { success: true, data: { subjects: [...], pagination: {...} } }
    if (
      role === "school_director" &&
      "data" in response &&
      response.data &&
      typeof response.data === "object" &&
      "subjects" in response.data &&
      Array.isArray(response.data.subjects) &&
      "pagination" in response.data &&
      response.data.pagination &&
      typeof response.data.pagination === "object"
    ) {
      const pagination = response.data.pagination as {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
        hasNext?: boolean;
        hasPrev?: boolean;
      };
      return {
        data: response.data.subjects,
        meta: {
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          total: pagination.total || 0,
          totalPages: pagination.totalPages || 1,
          hasNext: pagination.hasNext || false,
          hasPrev: pagination.hasPrev || false,
        },
      };
    }

    // Handle nested structure: { success: true, data: { data: [...], meta: {...} } }
    if (
      "data" in response &&
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data &&
      Array.isArray(response.data.data) &&
      "meta" in response.data &&
      response.data.meta &&
      typeof response.data.meta === "object"
    ) {
      return {
        data: response.data.data,
        meta: response.data.meta,
      };
    }

    // Handle direct structure: { data: [...], meta: {...} }
    if (
      "data" in response &&
      Array.isArray(response.data) &&
      "meta" in response &&
      response.meta &&
      typeof response.meta === "object" &&
      "page" in response.meta &&
      "limit" in response.meta &&
      "total" in response.meta &&
      "totalPages" in response.meta &&
      "hasNext" in response.meta &&
      "hasPrev" in response.meta
    ) {
      return {
        data: response.data,
        meta: response.meta as {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNext: boolean;
          hasPrev: boolean;
        },
      };
    }

    // Fallback: if data exists but no meta, create default meta
    if ("data" in response && Array.isArray(response.data)) {
      logger.warn("[use-subjects] Response missing meta, using defaults", { response });
      const defaultMeta = {
        page: page,
        limit: limit,
        total: response.data.length,
        totalPages: Math.ceil(response.data.length / limit),
        hasNext: false,
        hasPrev: false,
      };
      return {
        data: response.data,
        meta: defaultMeta,
      };
    }

    logger.error("[use-subjects] Unexpected response structure:", { response });
    throw new Error("Unexpected response structure from subjects API");
  } catch (error) {
    logger.error("[use-subjects] Error fetching subjects:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

/**
 * Fetch comprehensive subject with topics and content
 * Note: School directors use teacher endpoints for comprehensive subject data
 */
const fetchComprehensiveSubject = async (
  params: UseComprehensiveSubjectParams
): Promise<ComprehensiveSubjectData> => {
  const {
    subjectId,
    page = 1,
    limit = 10,
    search,
    status,
    type = "all",
    orderBy = "order",
    orderDirection = "asc",
    role,
  } = params;

  // School directors use teacher endpoints for comprehensive subject data
  const effectiveRole = role === "school_director" ? "teacher" : role;
  const rolePrefix = getRoleEndpointPrefix(effectiveRole);
  logger.info(`[use-comprehensive-subject] Fetching comprehensive subject for ${role || "teacher"} (using ${effectiveRole} endpoint)`, { ...params });

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

    const response = await authenticatedApi.get<ComprehensiveSubjectData>(
      `${rolePrefix}/subjects/${subjectId}/comprehensive?${queryParams.toString()}`
    );

    logger.info(
      `[use-comprehensive-subject] Comprehensive subject fetched successfully`,
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

    logger.error("[use-comprehensive-subject] Unexpected response structure:", {
      response,
    });
    throw new Error("Unexpected response structure from comprehensive subject API");
  } catch (error) {
    logger.error("[use-comprehensive-subject] Error fetching comprehensive subject:", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};

/**
 * Hook to fetch subjects - automatically uses current user's role
 */
export const useSubjects = (params: Omit<UseSubjectsParams, "role"> = {}) => {
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | "student" | undefined;
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: ["subjects", role, page, limit, params.search, params.academicSessionId],
    queryFn: () => fetchSubjects({ ...params, role }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    enabled: !!role, // Only fetch if role is available
  });
};

/**
 * Hook to fetch comprehensive subject - automatically uses current user's role
 */
export const useComprehensiveSubject = (
  params: Omit<UseComprehensiveSubjectParams, "role">
) => {
  const { data: session } = useSession();
  const role = session?.user?.role as "teacher" | "school_director" | "student" | undefined;
  const { subjectId, page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: [
      "subject",
      role,
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
    queryFn: () => fetchComprehensiveSubject({ ...params, role }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
    enabled: !!subjectId && !!role, // Only fetch if subjectId and role are available
  });
};

