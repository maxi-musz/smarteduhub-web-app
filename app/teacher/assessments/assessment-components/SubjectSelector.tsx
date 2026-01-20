"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Book } from "lucide-react";
import type { SubjectDashboardItem } from "@/hooks/teacher/use-teacher-data";

interface SubjectSelectorProps {
  subjects: SubjectDashboardItem[];
  selectedSubjectId: string | null;
  onSubjectChange: (subjectId: string) => void;
  isLoading?: boolean;
}

export const SubjectSelector = ({
  subjects,
  selectedSubjectId,
  onSubjectChange,
  isLoading = false,
}: SubjectSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Select Subject
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="subject-select">Subject</Label>
          <Select
            value={selectedSubjectId || ""}
            onValueChange={onSubjectChange}
            disabled={isLoading || subjects.length === 0}
          >
            <SelectTrigger id="subject-select">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.length === 0 ? (
                <SelectItem value="none" disabled>
                  No subjects available
                </SelectItem>
              ) : (
                subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} {subject.code && `(${subject.code})`}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};


