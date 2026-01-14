"use client";

import { LibrarySubject } from "@/hooks/explore/use-explore";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isLightColor } from "@/lib/utils/explore";

interface SubjectCardProps {
  subject: LibrarySubject;
  onClick?: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const subjectColor = subject.color || "#4f46e5";
  const useLightText = isLightColor(subjectColor);

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.02] w-full max-w-[140px] mx-auto border border-brand-border overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Book Cover Image */}
        {subject.thumbnailUrl ? (
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <Image
              src={subject.thumbnailUrl}
              alt={subject.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        ) : (
          <div
            className="w-full aspect-[3/4] flex items-center justify-center"
            style={{ backgroundColor: subjectColor }}
          >
            <span
              className={cn(
                "text-xs font-semibold text-center px-2 line-clamp-3",
                useLightText ? "text-gray-900" : "text-white"
              )}
            >
              {subject.name}
            </span>
          </div>
        )}

        {/* Minimal Content - Like Book Title */}
        <div className="p-2 bg-white">
          <h3 className="font-semibold text-brand-heading text-xs mb-1 line-clamp-2 leading-tight min-h-[2rem]">
            {subject.name}
          </h3>
          {subject.code && (
            <p className="text-[10px] text-brand-light-accent-1 line-clamp-1">
              {subject.code}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

