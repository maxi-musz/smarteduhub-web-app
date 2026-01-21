"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AssessmentFiltersProps {
  status?: string;
  type?: string;
  topicId?: string;
  onStatusChange: (status: string | undefined) => void;
  onTypeChange: (type: string | undefined) => void;
  onTopicChange: (topicId: string | undefined) => void;
}

const STATUS_OPTIONS: { label: string; value?: string }[] = [
  { label: "All", value: undefined },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Closed", value: "CLOSED" },
  { label: "Archived", value: "ARCHIVED" },
];

const TYPE_OPTIONS: { label: string; value?: string }[] = [
  { label: "All Types", value: undefined },
  { label: "CBT", value: "CBT" },
  { label: "Exam", value: "EXAM" },
];

export const AssessmentFilters = ({
  status,
  type,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  topicId: _topicId,
  onStatusChange,
  onTypeChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTopicChange: _onTopicChange,
}: AssessmentFiltersProps) => {
  return (
    <div className="flex items-center gap-6">
      <div className="space-y-2">
        <Label className="text-sm">Status</Label>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive =
              (option.value === undefined && !status) || option.value === status;
            return (
              <Button
                key={option.label}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={
                  "rounded-full px-4 py-1 text-xs font-medium " +
                  (isActive ? "" : "bg-white")
                }
                onClick={() => onStatusChange(option.value)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
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
            {TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.label} value={option.value || "all"}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

