"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

interface ErrorStateProps {
  error: Error | null;
}

export const ErrorState = ({ error }: ErrorStateProps) => {
  let errorMessage = "Failed to load profile information.";
  
  if (error instanceof AuthenticatedApiError) {
    if (error.statusCode === 401) {
      errorMessage = "Your session has expired. Please login again.";
    } else if (error.statusCode === 404) {
      errorMessage = "Profile not found.";
    } else {
      errorMessage = error.message || errorMessage;
    }
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <Card className="bg-white">
        <CardContent className="py-12 text-center">
          <p className="text-red-600 mb-2">{errorMessage}</p>
          {error && errorMessage !== error.message && (
            <p className="text-sm text-gray-600">{error.message}</p>
          )}
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
