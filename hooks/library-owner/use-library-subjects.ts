import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useLibraryOwnerResources } from "./use-library-owner-resources";

// Types matching teacher subjects structure
export interface LibrarySubject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string | null;
  thumbnailUrl?: string | null;
  classId: string;
  className?: string;
  topicsCount?: number;
  totalVideos?: number;
  totalMaterials?: number;
  topics?: Array<{
    id: string;
    title: string;
    order: number;
    is_active: boolean;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface LibrarySubjectsListData {
  data: LibrarySubject[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UseLibrarySubjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "code" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Hook to fetch all library owner subjects across all classes
 * Uses the resources dashboard and flattens subjects from all classes
 */
export function useLibrarySubjects(params: UseLibrarySubjectsParams = {}) {
  const { page = 1, limit = 10, search, sortBy = "name", sortOrder = "asc" } = params;
  const { data: resourcesData, isLoading, error } = useLibraryOwnerResources();

  return useQuery<LibrarySubjectsListData, AuthenticatedApiError>({
    queryKey: ["library-owner", "subjects", page, limit, search, sortBy, sortOrder],
    queryFn: async () => {
      if (!resourcesData) {
        throw new AuthenticatedApiError("Resources data not loaded", 400);
      }

      // Flatten all subjects from all classes
      let allSubjects: LibrarySubject[] = [];
      
      // Get topics count for each subject
      const topicsBySubjectId = new Map<string, number>();
      if (resourcesData.topics && resourcesData.topics.length > 0) {
        resourcesData.topics.forEach((topic) => {
          const count = topicsBySubjectId.get(topic.subjectId) || 0;
          topicsBySubjectId.set(topic.subjectId, count + 1);
        });
      }
      
      if (resourcesData.libraryClasses && resourcesData.libraryClasses.length > 0) {
        resourcesData.libraryClasses.forEach((libraryClass) => {
          if (libraryClass.subjects && libraryClass.subjects.length > 0) {
            libraryClass.subjects.forEach((subject) => {
              // Get topics for this subject
              const subjectTopics = resourcesData.topics
                ? resourcesData.topics
                    .filter((t) => t.subjectId === subject.id)
                    .map((t) => ({
                      id: t.id,
                      title: t.title,
                      order: t.order,
                      is_active: t.is_active,
                    }))
                    .sort((a, b) => a.order - b.order)
                : [];

              allSubjects.push({
                id: subject.id,
                name: subject.name,
                code: subject.code,
                color: subject.color,
                description: null, // Not available in current structure
                classId: libraryClass.id,
                className: libraryClass.name,
                topicsCount: topicsBySubjectId.get(subject.id) || 0,
                topics: subjectTopics,
                totalVideos: subject.videosCount || 0,
                totalMaterials: subject.materialsCount || 0,
                createdAt: libraryClass.createdAt,
                updatedAt: libraryClass.updatedAt,
              });
            });
          }
        });
      }

      // Also include subjects from the direct subjects array if available
      if (resourcesData.subjects && resourcesData.subjects.length > 0) {
        resourcesData.subjects.forEach((subject) => {
          // Avoid duplicates
          if (!allSubjects.find((s) => s.id === subject.id)) {
            // Get topics for this subject
            const subjectTopics = resourcesData.topics
              ? resourcesData.topics
                  .filter((t) => t.subjectId === subject.id)
                  .map((t) => ({
                    id: t.id,
                    title: t.title,
                    order: t.order,
                    is_active: t.is_active,
                  }))
                  .sort((a, b) => a.order - b.order)
              : [];

            allSubjects.push({
              id: subject.id,
              name: subject.name,
              code: subject.code,
              color: subject.color,
              description: null,
              classId: subject.classId,
              topicsCount: topicsBySubjectId.get(subject.id) || 0,
              topics: subjectTopics,
              totalVideos: subject.videosCount || 0,
              totalMaterials: subject.materialsCount || 0,
            });
          }
        });
      }

      // Apply search filter
      if (search && search.trim()) {
        const searchLower = search.toLowerCase();
        allSubjects = allSubjects.filter(
          (subject) =>
            subject.name.toLowerCase().includes(searchLower) ||
            subject.code.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      allSubjects.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case "code":
            aValue = a.code || "";
            bValue = b.code || "";
            break;
          case "createdAt":
            aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            break;
          case "updatedAt":
            aValue = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            bValue = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            break;
          case "name":
          default:
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          return sortOrder === "asc"
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }
      });

      // Apply pagination
      const total = allSubjects.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedSubjects = allSubjects.slice(startIndex, endIndex);

      return {
        data: paginatedSubjects,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    },
    enabled: !!resourcesData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
