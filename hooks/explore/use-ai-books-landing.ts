import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";

export interface AIBookClass {
  id: string;
  name: string;
  order: number;
}

export interface AIBook {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  thumbnailS3Key: string | null;
  thumbnailUrl?: string | null;
  views: number;
  downloads: number;
  createdAt: string;
  classes: AIBookClass[];
}

export interface AIPlatform {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface AIClassWithCount extends AIBookClass {
  totalBooks: number;
}

export interface AILandingPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AIBooksLandingPageData {
  platform: AIPlatform;
  books: AIBook[];
  classes: AIClassWithCount[];
  pagination: AILandingPagination;
}

export interface AIBooksLandingParams {
  page?: number;
  limit?: number;
  search?: string;
  classId?: string;
  classIds?: string[];
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function useAIBooksLandingPage(params?: AIBooksLandingParams) {
  const page = Math.max(1, params?.page ?? DEFAULT_PAGE);
  const limit = Math.max(1, Math.min(100, params?.limit ?? DEFAULT_LIMIT));
  const search = params?.search?.trim() || undefined;
  const classId = params?.classId || undefined;
  const classIds = params?.classIds;

  return useQuery<AIBooksLandingPageData, AuthenticatedApiError>({
    queryKey: ["explore", "ai-books", "landing-page", page, limit, search, classId, classIds],
    queryFn: async () => {
      logger.info("[useAIBooksLandingPage] Fetching AI books landing page data", {
        page,
        limit,
        search,
        classId,
        classIds,
      });

      const queryParams = new URLSearchParams();
      queryParams.append("page", String(page));
      queryParams.append("limit", String(limit));
      if (search) queryParams.append("search", search);
      if (classId) queryParams.append("classId", classId);
      if (classIds?.length) {
        classIds.forEach((id) => queryParams.append("classIds", id));
      }

      const queryString = queryParams.toString();
      const endpoint = `/explore/ai-books/landing-page${queryString ? `?${queryString}` : ""}`;

      const response = await authenticatedApi.get<AIBooksLandingPageData>(endpoint);

      if (response.success && response.data) {
        // Log thumbnail data from first few books for debugging
        const sampleBooks = response.data.books.slice(0, 3);
        console.log("[useAIBooksLandingPage] Sample book thumbnail data:", 
          sampleBooks.map(book => ({
            id: book.id,
            title: book.title,
            thumbnailS3Key: book.thumbnailS3Key,
            thumbnailUrl: book.thumbnailUrl,
          }))
        );
        
        logger.info("[useAIBooksLandingPage] Landing page data fetched successfully", {
          booksCount: response.data.books.length,
          classesCount: response.data.classes.length,
          totalItems: response.data.pagination?.totalItems,
        });
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message ?? "Failed to fetch AI books landing page data",
        response.statusCode ?? 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
