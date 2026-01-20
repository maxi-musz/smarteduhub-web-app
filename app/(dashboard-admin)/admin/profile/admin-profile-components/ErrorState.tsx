"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  error: Error | null;
}

export const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="py-6 space-y-6 bg-brand-bg">
    <Card className="bg-white">
      <CardContent className="py-12 text-center">
        <p className="text-red-600 mb-2">Failed to load profile information.</p>
        {error && <p className="text-sm text-gray-600">{error.message}</p>}
      </CardContent>
    </Card>
  </div>
);

