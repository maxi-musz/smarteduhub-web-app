"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import type {
  GrantStudentAccessRequest,
  UpdateAccessRequest,
  TeacherAvailableResource,
  TeacherExcludeIncludeRequest,
  TeacherExclusionRecord,
} from "./types";

const API_BASE = "/school-access-control/teacher";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface TeacherAvailableResourcesResponse {
  items: TeacherAvailableResource[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export function useTeacherAvailableResources(params?: {
  resourceType?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  if (params?.resourceType) queryParams.set("resourceType", params.resourceType);
  if (params?.page) queryParams.set("page", String(params.page));
  if (params?.limit) queryParams.set("limit", String(params.limit));
  const queryString = queryParams.toString();

  return useQuery<TeacherAvailableResourcesResponse, AuthenticatedApiError>({
    queryKey: ["teacher-access-control", "available-resources", params],
    queryFn: async (): Promise<TeacherAvailableResourcesResponse> => {
      const response = await authenticatedApi.get<TeacherAvailableResourcesResponse>(
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

export function useGrantStudentAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: GrantStudentAccessRequest) => {
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
      queryClient.invalidateQueries({ queryKey: ["teacher-access-control"] });
    },
  });
}

export function useBulkGrantStudentAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      schoolResourceAccessId: string;
      studentIds?: string[];
      classIds?: string[];
      resourceType: string;
      topicId?: string;
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
      queryClient.invalidateQueries({ queryKey: ["teacher-access-control"] });
    },
  });
}

export function useUpdateTeacherAccess(grantId: string | null) {
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
      queryClient.invalidateQueries({ queryKey: ["teacher-access-control"] });
    },
  });
}

export function useRevokeTeacherAccess() {
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
      queryClient.invalidateQueries({ queryKey: ["teacher-access-control"] });
    },
  });
}

/** Exclude resource (teacher – turn off for student/class). POST /school-access-control/teacher/exclude */
export function useTeacherExcludeResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TeacherExcludeIncludeRequest) => {
      const response = await authenticatedApi.post<TeacherExclusionRecord>(
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
      queryClient.invalidateQueries({ queryKey: ["teacher-access-control"] });
    },
  });
}

/** Include resource (teacher – turn on). POST /school-access-control/teacher/include */
export function useTeacherIncludeResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: TeacherExcludeIncludeRequest) => {
      const response = await authenticatedApi.post<{ id: string; removed: boolean } | null>(
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
      queryClient.invalidateQueries({ queryKey: ["teacher-access-control"] });
    },
  });
}
