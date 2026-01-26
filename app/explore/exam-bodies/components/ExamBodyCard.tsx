"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Calendar } from "lucide-react";
import Image from "next/image";
import type { ExploreExamBody } from "@/hooks/explore/use-explore-exam-bodies";

interface ExamBodyCardProps {
  examBody: ExploreExamBody;
  onClick: () => void;
}

export const ExamBodyCard = ({ examBody, onClick }: ExamBodyCardProps) => {
  const [imageError, setImageError] = useState(false);
  const isS3Image = examBody.logoUrl?.includes("s3.amazonaws.com");

  return (
    <Card
      className="border-brand-border hover:border-brand-primary/50 transition-all cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {examBody.logoUrl && !imageError ? (
            <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-brand-border">
              <Image
                src={examBody.logoUrl}
                alt={examBody.name}
                fill
                className="object-contain"
                unoptimized={isS3Image}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-brand-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-heading text-lg mb-1">
              {examBody.name}
            </h3>
            <p className="text-sm text-brand-light-accent-1 line-clamp-2">
              {examBody.fullName}
            </p>
            {examBody.status === "active" && (
              <Badge variant="outline" className="mt-2 text-xs">
                Active
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
          <div className="flex items-center gap-2 text-sm text-brand-light-accent-1">
            <BookOpen className="h-4 w-4" />
            <span>{examBody.subjects.length} Subjects</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-brand-light-accent-1">
            <Calendar className="h-4 w-4" />
            <span>{examBody.years.length} Years</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
