"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

interface BookDetailErrorProps {
  error: Error | AuthenticatedApiError;
  onRetry?: () => void;
}

export function BookDetailError({ error, onRetry }: BookDetailErrorProps) {
  const router = useRouter();

  let errorMessage =
    "An unexpected error occurred while loading the book details.";

  if (error instanceof AuthenticatedApiError) {
    if (error.statusCode === 401) {
      errorMessage = "Your session has expired. Please login again.";
    } else if (error.statusCode === 403) {
      errorMessage = "You don't have permission to access this book.";
    } else if (error.statusCode === 404) {
      errorMessage = "The requested book was not found.";
    } else {
      errorMessage = error.message || errorMessage;
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error Loading Book
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
            <div className="flex gap-2">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
              {onRetry && (
                <Button onClick={onRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

