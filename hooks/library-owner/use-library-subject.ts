import { useQuery } from "@tanstack/react-query";
import { authenticatedApi, AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useLibraryClassResources, Subject, Topic } from "./use-library-class-resources";

// Types matching teacher comprehensive subject structure
export interface LibrarySubjectTopic {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  order: number;
  status: string;
  is_active: boolean;
}

export interface LibrarySubjectData {
  subject: {
    id: string;
    name: string;
    code: string;
    status: string;
    color: string;
    description: string | null;
    thumbnailUrl?: string | null;
  };
  topics: LibrarySubjectTopic[];
  stats: {
    totalTopics: number;
    totalVideos: number;
    totalMaterials: number;
    totalStudents: number;
  };
  progress: number;
}

/**
 * Hook to fetch library subject with topics (no chapters)
 * Uses class resources and extracts the specific subject, flattening any chapters
 */
export function useLibrarySubject(classId: string, subjectId: string) {
  const { data: classResources, isLoading, error } = useLibraryClassResources(classId);

  return useQuery<LibrarySubjectData, AuthenticatedApiError>({
    queryKey: ["library-owner", "subject", classId, subjectId],
    queryFn: async () => {
      if (!classResources) {
        throw new AuthenticatedApiError("Class resources not loaded", 400);
      }

      const subject = classResources.subjects.find((s) => s.id === subjectId);
      if (!subject) {
        throw new AuthenticatedApiError("Subject not found", 404);
      }

      // Transform chapters/topics structure to direct topics (no chapters)
      // Flatten all topics from all chapters into a single array
      const allTopics: LibrarySubjectTopic[] = [];
      
      if (subject.chapters && subject.chapters.length > 0) {
        // Old structure with chapters - flatten them
        subject.chapters.forEach((chapter) => {
          if (chapter.topics && chapter.topics.length > 0) {
            chapter.topics.forEach((topic) => {
              allTopics.push({
                id: topic.id,
                title: topic.title,
                description: topic.description || null,
                instructions: null,
                order: topic.order,
                status: topic.is_active ? "active" : "inactive",
                is_active: topic.is_active,
              });
            });
          }
        });
      }

      // Sort topics by order
      allTopics.sort((a, b) => a.order - b.order);

      return {
        subject: {
          id: subject.id,
          name: subject.name,
          code: subject.code,
          status: "active", // Default status
          color: subject.color,
          description: subject.description || null,
          thumbnailUrl: subject.thumbnailUrl || null,
        },
        topics: allTopics,
        stats: {
          totalTopics: subject.topicsCount || allTopics.length,
          totalVideos: subject.totalVideos || 0,
          totalMaterials: subject.totalMaterials || 0,
          totalStudents: 0, // Not available in library owner context
        },
        progress: 0, // Not applicable for library owner
      };
    },
    enabled: !!classResources && !!subjectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
