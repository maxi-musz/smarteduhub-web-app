"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";

interface UpcomingAssignmentsProps {
  pendingCount: number;
}

export function UpcomingAssignments({ pendingCount }: UpcomingAssignmentsProps) {
  return (
    <Card className="shadow-lg bg-white h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-400" />
          Upcoming Assignments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {pendingCount === 0 ? (
            <div className="text-center py-8 text-brand-light-accent-1">
              No pending assignments
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-brand-border bg-brand-bg text-center">
              <div className="text-3xl font-bold text-brand-primary mb-2">
                {pendingCount}
              </div>
              <div className="text-sm text-brand-light-accent-1">
                Pending Assessment{pendingCount !== 1 ? 's' : ''}
              </div>
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs mt-2">
                Pending
              </Badge>
            </div>
          )}
        </div>

        <Button
          onClick={() => alert("View All Performance Clicked")}
          className="w-full"
          variant="outline"
        >
          View All Performance
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
