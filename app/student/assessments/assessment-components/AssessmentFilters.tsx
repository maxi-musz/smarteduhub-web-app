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
import { Badge } from "@/components/ui/badge";
import type { SubjectWithStats } from "@/hooks/student/use-student-assessments";

interface AssessmentFiltersProps {
  status: string;
  type: string;
  subject: string;
  subjects: SubjectWithStats[];
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onSubjectChange: (subject: string) => void;
}

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Active", value: "ACTIVE" },
  { label: "Closed", value: "CLOSED" },
];

export const AssessmentFilters = ({
  status,
  type,
  subject,
  subjects,
  onStatusChange,
  onTypeChange,
  onSubjectChange,
}: AssessmentFiltersProps) => {
  const selectedSubject = subjects.find((s) => s.id === subject);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="space-y-2">
          <Label className="text-sm">Status</Label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((option) => {
              const isActive = option.value === status;
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
          <Select value={type} onValueChange={(value) => onTypeChange(value)}>
            <SelectTrigger id="type-filter" className="w-40">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="CBT">CBT</SelectItem>
              <SelectItem value="EXAM">Exam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject-filter" className="text-sm">
            Subject
          </Label>
          <Select
            value={subject}
            onValueChange={(value) => onSubjectChange(value)}
          >
            <SelectTrigger id="subject-filter" className="w-48">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subj) => (
                <SelectItem key={subj.id} value={subj.id}>
                  <div className="flex items-center gap-2">
                    {subj.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subj.color }}
                      />
                    )}
                    <span>{subj.name}</span>
                    <Badge variant="secondary" className="ml-2">
                      {subj.assessment_stats.total_assessments}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subject Stats Display */}
      {selectedSubject && subject !== "all" && (
        <div className="p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-3">
            {selectedSubject.color && (
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedSubject.color }}
              />
            )}
            <h3 className="font-semibold">{selectedSubject.name}</h3>
            {selectedSubject.code && (
              <Badge variant="outline">{selectedSubject.code}</Badge>
            )}
          </div>

          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedSubject.assessment_stats.total_assessments}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {selectedSubject.assessment_stats.completed}
              </p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-gray-500">Attempted</p>
              <p className="text-2xl font-bold text-blue-600">
                {selectedSubject.assessment_stats.attempted}
              </p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-gray-500">Not Attempted</p>
              <p className="text-2xl font-bold text-orange-600">
                {selectedSubject.assessment_stats.not_attempted}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

