"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { AssessmentStatus, AssessmentType } from "@/hooks/use-teacher-assessments";

interface AssessmentFiltersProps {
  status?: string;
  type?: string;
  topicId?: string;
  onStatusChange: (status: string | undefined) => void;
  onTypeChange: (type: string | undefined) => void;
  onTopicChange: (topicId: string | undefined) => void;
}

export const AssessmentFilters = ({
  status,
  type,
  onStatusChange,
  onTypeChange,
}: AssessmentFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="space-y-2">
        <Label htmlFor="status-filter" className="text-sm">
          Status
        </Label>
        <Select
          value={status || "all"}
          onValueChange={(value) => onStatusChange(value === "all" ? undefined : value)}
        >
          <SelectTrigger id="status-filter" className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type-filter" className="text-sm">
          Type
        </Label>
        <Select
          value={type || "all"}
          onValueChange={(value) => onTypeChange(value === "all" ? undefined : value)}
        >
          <SelectTrigger id="type-filter" className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="CBT">CBT</SelectItem>
            <SelectItem value="QUIZ">Quiz</SelectItem>
            <SelectItem value="EXAM">Exam</SelectItem>
            <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
            <SelectItem value="TEST">Test</SelectItem>
            <SelectItem value="FORMATIVE">Formative</SelectItem>
            <SelectItem value="SUMMATIVE">Summative</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

