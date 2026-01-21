import { getSession, signOut } from "next-auth/react";
import { logger } from "@/lib/logger";

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
};

export class AuthenticatedApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: ApiResponse
  ) {
    super(message);
    this.name = "AuthenticatedApiError";
  }
}

// Function to handle automatic logout
async function handleAuthenticationError(message: string) {
  logger.error("[Auth] Authentication failed, logging out user", { message });
  
  // Sign out the user
  await signOut({ 
    callbackUrl: "/login",
    redirect: true 
  });
  
  // This will redirect, so the error below won't be shown
  // but we throw it anyway for consistency
  throw new AuthenticatedApiError(message, 401);
}

export async function makeAuthenticatedRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Get the current session to access the token
    const session = await getSession();

    if (!session?.user?.accessToken) {
      await handleAuthenticationError(
        "Your session has expired. Please login again."
      );
    }

    // Prepare headers with Authorization
    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session!.user.accessToken}`,
      ...((options.headers as Record<string, string>) || {}),
    };
    
    // Only set Content-Type for non-FormData requests
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Make the API request
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!baseUrl) {
      throw new AuthenticatedApiError(
        "Backend URL not configured. Please check your environment variables.",
        500
      );
    }

    const fullUrl = `${baseUrl}${endpoint}`;
    const method = options.method || "GET";
    
    // Log API call to terminal (only if logging is enabled)
    if (process.env.ENABLE_LOGGING === "true") {
      logger.info(`[API Call] ${method} ${fullUrl}`, {
        timestamp: new Date().toISOString(),
        method,
        endpoint,
        fullUrl,
      });
    }

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    const data = await response.json();

    // Log API response to terminal (only if logging is enabled)
    if (process.env.ENABLE_LOGGING === "true") {
      logger.info(`[API Response] ${method} ${fullUrl}`, {
        status: response.status,
        success: data.success,
        timestamp: new Date().toISOString(),
        statusText: response.statusText,
      });
    }

    // Handle authentication errors - automatically log out user
    if (response.status === 401) {
      await handleAuthenticationError(
        "Your session has expired. Please login again."
      );
    }

    // Handle other errors
    if (!response.ok) {
      throw new AuthenticatedApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AuthenticatedApiError) {
      throw error;
    }

    // Handle network errors
    throw new AuthenticatedApiError(
      "Network error occurred. Please check your connection.",
      0
    );
  }
}

// Convenience methods for different HTTP methods
export const authenticatedApi = {
  get: <T = unknown>(endpoint: string, options?: RequestInit) =>
    makeAuthenticatedRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ) => {
    // If data is FormData, use it directly; otherwise stringify as JSON
    const body = data instanceof FormData 
      ? data 
      : data 
        ? JSON.stringify(data) 
        : undefined;
    
    return makeAuthenticatedRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put: <T = unknown>(endpoint: string, data?: unknown, options?: RequestInit) =>
    makeAuthenticatedRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ) => {
    // If data is FormData, use it directly; otherwise stringify as JSON
    const body = data instanceof FormData 
      ? data 
      : data 
        ? JSON.stringify(data) 
        : undefined;
    
    return makeAuthenticatedRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete: <T = unknown>(endpoint: string, options?: RequestInit) => {
    // If body is provided, stringify it and set Content-Type
    const body = options?.body 
      ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body))
      : undefined;
    
    const headers = body 
      ? { ...((options?.headers as Record<string, string>) || {}), 'Content-Type': 'application/json' }
      : (options?.headers as Record<string, string>);
    
    return makeAuthenticatedRequest<T>(endpoint, { 
      ...options, 
      method: "DELETE",
      body,
      headers,
    });
  },
};
