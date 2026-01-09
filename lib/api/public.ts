/**
 * Public API utility for unauthenticated endpoints
 * Used for Explore module which doesn't require authentication
 */

type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
};

export class PublicApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: ApiResponse
  ) {
    super(message);
    this.name = "PublicApiError";
  }
}

export async function makePublicRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!baseUrl) {
      throw new PublicApiError(
        "Backend URL not configured. Please check your environment variables.",
        500
      );
    }

    const fullUrl = `${baseUrl}${endpoint}`;
    const method = options.method || "GET";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new PublicApiError(
        data.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof PublicApiError) {
      throw error;
    }

    // Handle network errors
    throw new PublicApiError(
      "Network error occurred. Please check your connection.",
      0
    );
  }
}

// Convenience methods for different HTTP methods
export const publicApi = {
  get: <T = unknown>(endpoint: string, options?: RequestInit) =>
    makePublicRequest<T>(endpoint, { ...options, method: "GET" }),
};

