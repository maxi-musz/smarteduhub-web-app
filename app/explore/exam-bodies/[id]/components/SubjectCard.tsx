"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import type { ExploreExamBodySubject } from "@/hooks/explore/use-explore-exam-bodies";

interface SubjectCardProps {
  subject: ExploreExamBodySubject;
}

export const SubjectCard = ({ subject }: SubjectCardProps) => {
  const [imageError, setImageError] = useState(false);
  const isS3Image = subject.iconUrl?.includes("s3.amazonaws.com");

  return (
    <Card className="border-brand-border">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {subject.iconUrl && !imageError ? (
            <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-brand-border">
              <Image
                src={subject.iconUrl}
                alt={subject.name}
                fill
                className="object-contain"
                unoptimized={isS3Image}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-brand-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-brand-heading">{subject.name}</h3>
            <p className="text-xs text-brand-light-accent-1">{subject.code}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
