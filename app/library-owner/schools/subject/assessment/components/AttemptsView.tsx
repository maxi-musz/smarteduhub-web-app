"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";

interface AttemptsViewProps {
  data: { data?: unknown[]; statistics?: { attempted_count?: number } } | undefined;
  isLoading: boolean;
}

export function AttemptsView({ data, isLoading }: AttemptsViewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-brand-light-accent-1">Loading attempts...</CardContent>
      </Card>
    );
  }

  const stats = data?.statistics;
  const attempted = stats?.attempted_count ?? 0;
  const list = Array.isArray(data?.data) ? data.data : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-primary" />
            <div>
              <p className="text-sm text-brand-light-accent-1">Attempts</p>
              <p className="text-2xl font-bold text-brand-heading">{attempted}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      {list.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-brand-heading">Attempt list</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-light-accent-1">{list.length} attempt(s) recorded.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-brand-light-accent-1">No attempts yet.</CardContent>
        </Card>
      )}
    </div>
  );
}
