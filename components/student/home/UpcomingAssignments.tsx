"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: "pending" | "overdue";
  progress: string;
}

const upcomingAssignments: Assignment[] = [
  {
    id: "1",
    title: "Math Problem Set",
    subject: "Mathematics",
    dueDate: "2024-06-15",
    status: "overdue",
    progress: "Not Started",
  },
  {
    id: "2",
    title: "Science Lab Report",
    subject: "Biology",
    dueDate: "2024-06-18",
    status: "pending",
    progress: "Not Started",
  },
  {
    id: "3",
    title: "Essay: Modern Literature",
    subject: "English Literature",
    dueDate: "2024-06-20",
    status: "pending",
    progress: "In Progress",
  },
];

const getStatusBadge = (status: Assignment["status"]) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-xs">
          Pending
        </Badge>
      );
    case "overdue":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-200 text-xs">
          Past Due
        </Badge>
      );
  }
};

export function UpcomingAssignments() {
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
          {upcomingAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-3 rounded-lg border border-brand-border bg-brand-bg space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium text-sm">{assignment.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {assignment.subject}
                  </div>
                </div>
                {getStatusBadge(assignment.status)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-muted-foreground">
                  {assignment.progress}
                </span>
              </div>
            </div>
          ))}
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
