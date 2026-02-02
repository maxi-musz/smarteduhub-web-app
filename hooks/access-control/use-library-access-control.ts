"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import type {
  GrantSchoolAccessRequest,
  BulkGrantAccessRequest,
  UpdateAccessRequest,
  SchoolsWithAccessResponse,
  LibraryAccessGrant,
  SchoolAccessDetailsResponse,
  ExcludeIncludeResourceRequest,
  ExcludedResourceRecord,
} from "./types";

const API_BASE = "/library-access-control";

// ApiResponse wrapper
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function useSchoolsWithAccess(params?: {
  resourceType?: string;
  subjectId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.resourceType) queryParams.set("resourceType", params.resourceType);
  if (params?.subjectId) queryParams.set("subjectId", params.subjectId);
  if (params?.isActive !== undefined) queryParams.set("isActive", String(params.isActive));
  if (params?.search) queryParams.set("search", params.search);
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  const queryString = queryParams.toString();

  return useQuery<SchoolsWithAccessResponse, AuthenticatedApiError>({
    queryKey: ["library-access-control", "schools", params],
    queryFn: async (): Promise<SchoolsWithAccessResponse> => {
      const response = await authenticatedApi.get<SchoolsWithAccessResponse>(
        `${API_BASE}/schools${queryString ? `?${queryString}` : ""}`
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch schools",
        400,
        response
      );
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useSchoolAccessDetails(schoolId: string | null, params?: {
  resourceType?: string;
  accessLevel?: string;
  isActive?: boolean;
  includeExpired?: boolean;
}) {
  const queryParams = new URLSearchParams();
  if (params?.resourceType) queryParams.set("resourceType", params.resourceType);
  if (params?.accessLevel) queryParams.set("accessLevel", params.accessLevel);
  if (params?.isActive !== undefined) queryParams.set("isActive", String(params.isActive));
  if (params?.includeExpired !== undefined) queryParams.set("includeExpired", String(params.includeExpired));
  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["library-access-control", "schools", schoolId, params],
    queryFn: async () => {
      const response = await authenticatedApi.get<ApiResponse<SchoolAccessDetailsResponse>>(
        `${API_BASE}/schools/${schoolId}${queryString ? `?${queryString}` : ""}`
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch school access details",
        400,
        response
      );
    },
    enabled: !!schoolId,
  });
}

export function useGrantSchoolAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GrantSchoolAccessRequest) => {
      const response = await authenticatedApi.post<ApiResponse<LibraryAccessGrant>>(
        `${API_BASE}/grant`,
        data
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to grant access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-access-control"] });
    },
  });
}

export function useBulkGrantSchoolAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: BulkGrantAccessRequest) => {
      const response = await authenticatedApi.post<ApiResponse<{
        successful: number;
        failed: number;
        total: number;
        results: Array<{ schoolId: string; status: string; id?: string }>;
      }>>(`${API_BASE}/grant-bulk`, data);
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to grant bulk access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-access-control"] });
    },
  });
}

export function useUpdateLibraryAccess(grantId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateAccessRequest) => {
      const response = await authenticatedApi.patch<ApiResponse<LibraryAccessGrant>>(
        `${API_BASE}/${grantId}`,
        data
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to update access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-access-control"] });
    },
  });
}

/** Update access by grant ID (pass grantId in payload) */
export function useUpdateLibraryAccessById() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ grantId, ...data }: UpdateAccessRequest & { grantId: string }) => {
      const response = await authenticatedApi.patch<ApiResponse<LibraryAccessGrant>>(
        `${API_BASE}/${grantId}`,
        data
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to update access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-access-control"] });
    },
  });
}

export function useRevokeLibraryAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ grantId, reason }: { grantId: string; reason?: string }) => {
      const response = await authenticatedApi.delete<ApiResponse<LibraryAccessGrant>>(
        `${API_BASE}/${grantId}`,
        reason ? { body: JSON.stringify({ reason }) } : undefined
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to revoke access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-access-control"] });
    },
  });
}

/** Exclude resource (turn off) under a subject grant. POST /library-access-control/exclude */
export function useExcludeResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ExcludeIncludeResourceRequest) => {
      const response = await authenticatedApi.post<ApiResponse<ExcludedResourceRecord>>(
        `${API_BASE}/exclude`,
        data
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to exclude resource",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-access-control"] });
    },
  });
}

/** Include resource (turn on) again under a subject grant. POST /library-access-control/include */
export function useIncludeResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ExcludeIncludeResourceRequest) => {
      const response = await authenticatedApi.post<ApiResponse<{ id: string; removed: boolean } | null>>(
        `${API_BASE}/include`,
        data
      );
      if (response.success !== false) return response.data ?? null;
      throw new AuthenticatedApiError(
        response.message || "Failed to include resource",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library-access-control"] });
    },
  });
}
