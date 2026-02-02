"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import type {
  GrantUserAccessRequest,
  UpdateAccessRequest,
  AvailableResource,
  SchoolExcludeIncludeSubjectRequest,
  SchoolSubjectExclusionRecord,
  ExcludedSubjectsResponse,
  IncludeAllSubjectsResponse,
} from "./types";

const API_BASE = "/school-access-control";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AvailableResourcesResponse {
  items: AvailableResource[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function useAvailableResources(params?: {
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

  return useQuery<AvailableResourcesResponse, AuthenticatedApiError>({
    queryKey: ["school-access-control", "available-resources", params],
    queryFn: async (): Promise<AvailableResourcesResponse> => {
      const response = await authenticatedApi.get<AvailableResourcesResponse>(
        `${API_BASE}/available-resources${queryString ? `?${queryString}` : ""}`
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch available resources",
        400,
        response
      );
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useGrantUserAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GrantUserAccessRequest) => {
      const response = await authenticatedApi.post<ApiResponse<unknown>>(
        `${API_BASE}/grant`,
        data
      );
      if (response.success) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to grant access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-access-control"] });
    },
  });
}

export function useBulkGrantSchoolUserAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      libraryResourceAccessId: string;
      userIds?: string[];
      classIds?: string[];
      resourceType: string;
      subjectId?: string;
      accessLevel?: string;
      expiresAt?: string;
      notes?: string;
    }) => {
      const response = await authenticatedApi.post<ApiResponse<unknown>>(
        `${API_BASE}/grant-bulk`,
        data
      );
      if (response.success) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to grant bulk access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-access-control"] });
    },
  });
}

export function useUpdateSchoolAccess(grantId: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateAccessRequest) => {
      const response = await authenticatedApi.patch<ApiResponse<unknown>>(
        `${API_BASE}/${grantId}`,
        data
      );
      if (response.success) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to update access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-access-control"] });
    },
  });
}

export function useRevokeSchoolAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ grantId, reason }: { grantId: string; reason?: string }) => {
      const response = await authenticatedApi.delete<ApiResponse<unknown>>(
        `${API_BASE}/${grantId}`,
        reason ? { body: JSON.stringify({ reason }) } : undefined
      );
      if (response.success) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to revoke access",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-access-control"] });
    },
  });
}

/** Exclude subject (turn off for school). POST /school-access-control/exclude-subject. School directors/admins only. */
export function useExcludeSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SchoolExcludeIncludeSubjectRequest) => {
      const response = await authenticatedApi.post<SchoolSubjectExclusionRecord>(
        `${API_BASE}/exclude-subject`,
        data
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to exclude subject",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-access-control"] });
    },
  });
}

/** Include subject (turn on for school). POST /school-access-control/include-subject. School directors/admins only. */
export function useIncludeSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SchoolExcludeIncludeSubjectRequest) => {
      const response = await authenticatedApi.post<{ id: string; removed: boolean } | null>(
        `${API_BASE}/include-subject`,
        data
      );
      if (response.success !== false) return response.data ?? null;
      throw new AuthenticatedApiError(
        response.message || "Failed to include subject",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-access-control"] });
    },
  });
}

/** Get excluded subjects (for "Visible to school" toggle state). GET /school-access-control/excluded-subjects. */
export function useExcludedSubjects() {
  return useQuery({
    queryKey: ["school-access-control", "excluded-subjects"],
    queryFn: async (): Promise<ExcludedSubjectsResponse> => {
      const response = await authenticatedApi.get<ExcludedSubjectsResponse>(
        `${API_BASE}/excluded-subjects`
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to fetch excluded subjects",
        400,
        response
      );
    },
    staleTime: 1 * 60 * 1000,
  });
}

/** Include all subjects (turn on all). POST /school-access-control/include-all-subjects. Clears stale exclusions. */
export function useIncludeAllSubjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await authenticatedApi.post<IncludeAllSubjectsResponse>(
        `${API_BASE}/include-all-subjects`,
        {}
      );
      if (response.success && response.data) return response.data;
      throw new AuthenticatedApiError(
        response.message || "Failed to include all subjects",
        400,
        response
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["school-access-control"] });
    },
  });
}
