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
import { Users } from "lucide-react";
import type { AttendanceClass } from "@/hooks/teacher/use-teacher-data";

interface ClassSelectorProps {
  classes: AttendanceClass[];
  selectedClassId: string | null;
  onClassChange: (classId: string) => void;
  isLoading?: boolean;
}

export const ClassSelector = ({
  classes,
  selectedClassId,
  onClassChange,
  isLoading = false,
}: ClassSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Select Class
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="class-select">Class</Label>
          <Select
            value={selectedClassId || ""}
            onValueChange={onClassChange}
            disabled={isLoading || classes.length === 0}
          >
            <SelectTrigger id="class-select">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.length === 0 ? (
                <SelectItem value="none" disabled>
                  No classes available
                </SelectItem>
              ) : (
                classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name} ({classItem.total_students} students)
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {selectedClassId && classes.length > 0 && (
            <div className="text-sm text-gray-600 mt-2">
              {(() => {
                const selectedClass = classes.find((c) => c.id === selectedClassId);
                return selectedClass ? (
                  <>
                    <p>Room: {selectedClass.room}</p>
                    <p>Subject: {selectedClass.subject}</p>
                  </>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
