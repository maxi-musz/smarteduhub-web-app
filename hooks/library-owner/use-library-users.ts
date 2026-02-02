"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import type {
  LibraryUsersDashboardParams,
  LibraryUsersDashboardResponse,
  LibraryUserListItem,
  LibraryUserDetailResponse,
  UploadAnalyticsResponse,
  AvailablePermission,
  CreateLibraryUserPayload,
  UpdateLibraryUserPayload,
  LibraryUserCreated,
  LibraryUserUpdated,
} from "./use-library-users-types";

const API_BASE = "/library/users";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

function buildDashboardQueryString(params?: LibraryUsersDashboardParams): string {
  const search = new URLSearchParams();
  if (params?.page != null) search.set("page", String(params.page));
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.search) search.set("search", params.search);
  if (params?.sortBy) search.set("sortBy", params.sortBy);
  if (params?.sortOrder) search.set("sortOrder", params.sortOrder);
  if (params?.role) search.set("role", params.role);
  if (params?.status) search.set("status", params.status);
  const q = search.toString();
  return q ? `?${q}` : "";
}

/** GET /library/users/dashboard – paginated users + library stats (any library user). */
export function useLibraryUsersDashboard(params?: LibraryUsersDashboardParams) {
  const queryString = buildDashboardQueryString(params);
  return useQuery<LibraryUsersDashboardResponse, AuthenticatedApiError>({
    queryKey: ["library-users", "dashboard", params],
    queryFn: async (): Promise<LibraryUsersDashboardResponse> => {
      const response = await authenticatedApi.get<LibraryUsersDashboardResponse>(
        `${API_BASE}/dashboard${queryString}`
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch library users dashboard",
        400,
        response
      );
    },
    staleTime: 20 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/** GET /library/users – list all library users, manage/upload roles only (elevated). */
export function useLibraryUsersList() {
  return useQuery<LibraryUserListItem[], AuthenticatedApiError>({
    queryKey: ["library-users", "list"],
    queryFn: async (): Promise<LibraryUserListItem[]> => {
      const response = await authenticatedApi.get<LibraryUserListItem[]>(
        API_BASE
      );
      if (response.success && response.data !== undefined) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch library users",
        400,
        response
      );
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/** GET /library/users/analytics/upload-analytics – upload analytics (admin/manager). */
export function useUploadAnalytics() {
  return useQuery<UploadAnalyticsResponse, AuthenticatedApiError>({
    queryKey: ["library-users", "upload-analytics"],
    queryFn: async (): Promise<UploadAnalyticsResponse> => {
      const response = await authenticatedApi.get<UploadAnalyticsResponse>(
        `${API_BASE}/analytics/upload-analytics`
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch upload analytics",
        400,
        response
      );
    },
    staleTime: 20 * 60 * 1000, // 20 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/** GET /library/users/available-permissions – catalog for create/update (admin/manager). */
export function useAvailablePermissions() {
  return useQuery<AvailablePermission[], AuthenticatedApiError>({
    queryKey: ["library-users", "available-permissions"],
    queryFn: async (): Promise<AvailablePermission[]> => {
      const response = await authenticatedApi.get<AvailablePermission[]>(
        `${API_BASE}/available-permissions`
      );
      if (response.success && response.data !== undefined) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch available permissions",
        400,
        response
      );
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/** GET /library/users/:id – single user full detail (elevated). */
export function useLibraryUser(id: string | null) {
  return useQuery<LibraryUserDetailResponse, AuthenticatedApiError>({
    queryKey: ["library-users", "detail", id],
    queryFn: async (): Promise<LibraryUserDetailResponse> => {
      const response = await authenticatedApi.get<LibraryUserDetailResponse>(
        `${API_BASE}/${id}`
      );
      if (response.success && response.data) return response.data as LibraryUserDetailResponse;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch library user",
        400,
        response
      );
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/** POST /library/users – create user (elevated). */
export function useCreateLibraryUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateLibraryUserPayload): Promise<LibraryUserCreated> => {
      const response = await authenticatedApi.post<LibraryUserCreated>(API_BASE, payload);
      if (response.success && response.data) return response.data as LibraryUserCreated;
      throw new AuthenticatedApiError(
        response.message || "Failed to create library user",
        response.statusCode ?? 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-users"] });
    },
  });
}

/** PATCH /library/users/:id – update user (elevated). */
export function useUpdateLibraryUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateLibraryUserPayload;
    }): Promise<LibraryUserUpdated> => {
      const response = await authenticatedApi.patch<LibraryUserUpdated>(
        `${API_BASE}/${id}`,
        payload
      );
      if (response.success && response.data) return response.data as LibraryUserUpdated;
      throw new AuthenticatedApiError(
        response.message || "Failed to update library user",
        response.statusCode ?? 400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-users"] });
    },
  });
}

/** DELETE /library/users/:id – remove user (elevated). */
export function useDeleteLibraryUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await authenticatedApi.delete<ApiResponse<null>>(
        `${API_BASE}/${id}`
      );
      if (response.success !== true) {
        throw new AuthenticatedApiError(
          response.message || "Failed to delete library user",
          response.statusCode ?? 400,
          response
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-users"] });
    },
  });
}
