"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamBody } from "@/hooks/exam-body/types";

interface ExamBodyListProps {
  examBodies: ExamBody[];
  isLoading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const statusLabel = (status: ExamBody["status"]) => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "archived":
      return "Archived";
    default:
      return status;
  }
};

const statusClass = (status: ExamBody["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-yellow-100 text-yellow-700";
    case "archived":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const ExamBodyList = ({
  examBodies,
  isLoading,
  selectedId,
  onSelect,
}: ExamBodyListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Exam Bodies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-14 bg-gray-100 rounded animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Exam Bodies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {examBodies.length === 0 ? (
          <div className="text-center py-8 text-sm text-brand-light-accent-1">
            No exam bodies available yet.
          </div>
        ) : (
          examBodies.map((examBody) => (
            <button
              key={examBody.id}
              type="button"
              onClick={() => onSelect(examBody.id)}
              className={`w-full text-left border rounded-lg p-3 transition ${
                selectedId === examBody.id
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-brand-border hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {examBody.logoUrl ? (
                    <Image
                      src={examBody.logoUrl}
                      alt={`${examBody.name} logo`}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-brand-heading">
                        {examBody.name}
                      </p>
                      <Badge className={statusClass(examBody.status)}>
                        {statusLabel(examBody.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-light-accent-1">
                      {examBody.fullName}
                    </p>
                    {examBody.websiteUrl && (
                      <Link
                        href={examBody.websiteUrl}
                        className="text-xs text-brand-primary hover:underline"
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {examBody.websiteUrl}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </CardContent>
    </Card>
  );
};
