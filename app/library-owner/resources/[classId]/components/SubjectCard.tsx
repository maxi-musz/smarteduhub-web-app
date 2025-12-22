"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Subject } from "@/hooks/use-library-class-resources";
import { Layers, Video, FileText, ChevronDown, ChevronRight, BookOpen, Pencil, ExternalLink } from "lucide-react";
import { useState } from "react";
import { ChapterCard } from "./ChapterCard";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface SubjectCardProps {
  subject: Subject;
  onEdit?: (subject: Subject) => void;
}

export const SubjectCard = ({ subject, onEdit }: SubjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const params = useParams();
  const router = useRouter();
  const classId = params.classId as string;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(subject);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/library-owner/resources/${classId}/${subject.id}`);
  };

  return (
    <Card className="shadow-sm bg-white border border-brand-border">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {subject.thumbnailUrl ? (
              <div className="relative w-20 h-28 rounded-md overflow-hidden border-2 border-brand-border flex-shrink-0 shadow-md hover:shadow-lg transition-shadow bg-gray-100">
                <Image
                  src={subject.thumbnailUrl}
                  alt={subject.name}
                  fill
                  className="object-contain"
                  unoptimized={subject.thumbnailUrl.includes('s3.amazonaws.com')}
                  sizes="80px"
                />
              </div>
            ) : (
              <div
                className="w-20 h-28 rounded-md flex-shrink-0 flex flex-col items-center justify-center text-white font-semibold shadow-md border-2 border-brand-border"
                style={{ backgroundColor: subject.color }}
              >
                <span className="text-xs font-bold leading-tight text-center px-1">
                  {subject.code || subject.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-brand-heading text-lg">
                {subject.name}
              </h3>
              <p className="text-sm text-brand-light-accent-1 mt-0.5">
                {subject.code} • {subject.description || "No description"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-brand-light-accent-1" />
                <span className="text-brand-light-accent-1">{subject.chaptersCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4 text-brand-light-accent-1" />
                <span className="text-brand-light-accent-1">{subject.topicsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4 text-brand-light-accent-1" />
                <span className="text-brand-light-accent-1">{subject.totalVideos}</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4 text-brand-light-accent-1" />
                <span className="text-brand-light-accent-1">{subject.totalMaterials}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDetails}
                className="h-8 px-2"
                title="View details"
              >
                <ExternalLink className="h-4 w-4 text-brand-primary mr-1" />
                <span className="text-xs text-brand-primary">Manage</span>
              </Button>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditClick}
                  className="h-8 w-8 p-0"
                  title="Edit subject"
                >
                  <Pencil className="h-4 w-4 text-brand-light-accent-1" />
                </Button>
              )}
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-brand-light-accent-1" />
              ) : (
                <ChevronRight className="h-5 w-5 text-brand-light-accent-1" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3 border-t border-brand-border pt-4">
            {subject.chapters.length > 0 ? (
              subject.chapters.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))
            ) : (
              <p className="text-sm text-brand-light-accent-1 text-center py-4">
                No chapters found
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

