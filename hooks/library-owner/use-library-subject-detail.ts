import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useLibraryOwnerResources } from "./use-library-owner-resources";

// Types matching teacher comprehensive subject structure
export interface LibrarySubjectDetailTopic {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  order: number;
  status: string;
  is_active: boolean;
}

export interface LibrarySubjectDetailData {
  subject: {
    id: string;
    name: string;
    code: string;
    status: string;
    color: string;
    description: string | null;
    thumbnailUrl?: string | null;
  };
  topics: LibrarySubjectDetailTopic[];
  stats: {
    totalTopics: number;
    totalVideos: number;
    totalMaterials: number;
    totalStudents: number;
  };
  progress: number;
}

/**
 * Hook to fetch library subject detail with topics (no chapters)
 * Uses resources dashboard to find the subject and get its topics
 */
export function useLibrarySubjectDetail(subjectId: string) {
  const { data: resourcesData, isLoading, error } = useLibraryOwnerResources();

  return useQuery<LibrarySubjectDetailData, AuthenticatedApiError>({
    queryKey: ["library-owner", "subject-detail", subjectId],
    queryFn: async () => {
      if (!resourcesData) {
        throw new AuthenticatedApiError("Resources data not loaded", 400);
      }

      // Find the subject across all classes
      let foundSubject: {
        id: string;
        name: string;
        code: string;
        color: string;
        classId: string;
        videosCount?: number;
        materialsCount?: number;
      } | null = null;

      // Search in library classes
      if (resourcesData.libraryClasses && resourcesData.libraryClasses.length > 0) {
        for (const libraryClass of resourcesData.libraryClasses) {
          if (libraryClass.subjects && libraryClass.subjects.length > 0) {
            const subject = libraryClass.subjects.find((s) => s.id === subjectId);
            if (subject) {
              foundSubject = {
                ...subject,
                classId: libraryClass.id,
              };
              break;
            }
          }
        }
      }

      // Also check direct subjects array
      if (!foundSubject && resourcesData.subjects && resourcesData.subjects.length > 0) {
        const subject = resourcesData.subjects.find((s) => s.id === subjectId);
        if (subject) {
          foundSubject = subject;
        }
      }

      if (!foundSubject) {
        throw new AuthenticatedApiError("Subject not found", 404);
      }

      // Get topics for this subject from the topics array
      let subjectTopics: Array<{
        id: string;
        title: string;
        order: number;
        is_active: boolean;
      }> = [];

      if (resourcesData.topics && resourcesData.topics.length > 0) {
        subjectTopics = resourcesData.topics
          .filter((topic) => topic.subjectId === subjectId)
          .map((topic) => ({
            id: topic.id,
            title: topic.title,
            order: topic.order,
            is_active: topic.is_active,
          }));
      }

      // Sort topics by order
      const sortedTopics = [...subjectTopics].sort((a, b) => a.order - b.order);

      // Transform topics to match expected structure
      const transformedTopics: LibrarySubjectDetailTopic[] = sortedTopics.map((topic) => ({
        id: topic.id,
        title: topic.title,
        description: null,
        instructions: null,
        order: topic.order,
        status: topic.is_active ? "active" : "inactive",
        is_active: topic.is_active,
      }));

      return {
        subject: {
          id: foundSubject.id,
          name: foundSubject.name,
          code: foundSubject.code,
          status: "active",
          color: foundSubject.color,
          description: null,
          thumbnailUrl: undefined,
        },
        topics: transformedTopics,
        stats: {
          totalTopics: transformedTopics.length,
          totalVideos: foundSubject.videosCount || 0,
          totalMaterials: foundSubject.materialsCount || 0,
          totalStudents: 0, // Not available in library owner context
        },
        progress: 0, // Not applicable for library owner
      };
    },
    enabled: !!resourcesData && !!subjectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
