import { useQuery } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";

// Types for Library Owner Profile
export interface LibraryPlatform {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
}

export interface LibraryUser {
  id: string;
  platformId: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: string;
  userType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  platform?: LibraryPlatform;
  uploadedVideosCount?: number;
  uploadedMaterialsCount?: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  sizeBytes: number;
  status: string;
  order: number;
  subjectId: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  materialType: string;
  url: string;
  sizeBytes: number;
  pageCount: number;
  status: string;
  order: number;
  subjectId: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryOwnerProfileResponse {
  user: LibraryUser;
  myUploads: {
    videos: Video[];
    materials: Material[];
  };
  libraryContent: {
    videos: Video[];
    materials: Material[];
    totalVideos: number;
    totalMaterials: number;
  };
}

export function useLibraryOwnerProfile() {
  return useQuery<LibraryOwnerProfileResponse, AuthenticatedApiError>({
    queryKey: ["library-owner", "profile"],
    queryFn: async () => {
      const response = await authenticatedApi.get<LibraryOwnerProfileResponse>(
        "/library/profile/getuserprofile"
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new AuthenticatedApiError(
        response.message || "Failed to fetch library owner profile",
        response.statusCode || 400,
        response
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

