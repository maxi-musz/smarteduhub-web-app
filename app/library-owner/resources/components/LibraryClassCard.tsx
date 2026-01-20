"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LibraryClass } from "@/hooks/library-owner/use-library-owner-resources";
import { BookOpen, Video, FileText, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface LibraryClassCardProps {
  classItem: LibraryClass;
}

export const LibraryClassCard = ({ classItem }: LibraryClassCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/library-owner/resources/${classItem.id}`);
  };

  return (
    <Card 
      className="shadow-sm bg-white hover:shadow-md transition-all cursor-pointer border border-brand-border hover:border-brand-primary"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-brand-heading text-base">
            {classItem.name}
          </h3>
          <ArrowRight className="h-4 w-4 text-brand-light-accent-1" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="h-3.5 w-3.5 text-brand-primary" />
            </div>
            <p className="text-xs text-brand-light-accent-1 mb-0.5">Subjects</p>
            <p className="text-sm font-semibold text-brand-heading">
              {classItem.subjectsCount}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Video className="h-3.5 w-3.5 text-brand-primary" />
            </div>
            <p className="text-xs text-brand-light-accent-1 mb-0.5">Videos</p>
            <p className="text-sm font-semibold text-brand-heading">
              {classItem.videosCount}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <FileText className="h-3.5 w-3.5 text-brand-primary" />
            </div>
            <p className="text-xs text-brand-light-accent-1 mb-0.5">Materials</p>
            <p className="text-sm font-semibold text-brand-heading">
              {classItem.materialsCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

