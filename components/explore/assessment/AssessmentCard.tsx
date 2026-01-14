"use client";

import { LibraryAssessment } from "@/hooks/explore/use-explore";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Clock, Target, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssessmentCardProps {
  assessment: LibraryAssessment;
  onTake?: () => void;
}

export function AssessmentCard({ assessment, onTake }: AssessmentCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Assessment Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <ClipboardList className="h-6 w-6 text-green-600" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-heading mb-1 line-clamp-2">
              {assessment.title}
            </h3>
            
            {assessment.description && (
              <p className="text-sm text-brand-light-accent-1 mb-3 line-clamp-2">
                {assessment.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-brand-light-accent-1 mb-4">
              <div className="flex items-center gap-1">
                <FileQuestion className="h-3 w-3" />
                <span>{assessment.questionsCount} questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{assessment.duration} mins</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>Pass: {assessment.passingScore}%</span>
              </div>
            </div>

            {/* Take Assessment Button */}
            {onTake && (
              <Button
                onClick={onTake}
                size="sm"
                className="w-full"
              >
                Take Assessment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

