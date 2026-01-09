"use client";

import { LibraryClass } from "@/hooks/explore/use-explore";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassCardProps {
  class: LibraryClass;
  isActive?: boolean;
  onClick?: () => void;
}

export function ClassCard({ class: classItem, isActive, onClick }: ClassCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] flex-shrink-0 w-[200px] border border-brand-border",
        isActive && "ring-2 ring-brand-primary shadow-md"
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "p-2 rounded-lg flex-shrink-0",
            isActive ? "bg-brand-primary" : "bg-gray-100"
          )}>
            <GraduationCap className={cn(
              "h-5 w-5",
              isActive ? "text-white" : "text-brand-primary"
            )} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-heading text-sm truncate">{classItem.name}</h3>
            <p className="text-xs text-brand-light-accent-1">
              {classItem.subjectsCount} {classItem.subjectsCount === 1 ? "subject" : "subjects"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

