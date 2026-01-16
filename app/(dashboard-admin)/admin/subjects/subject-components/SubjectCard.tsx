"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { type ApiSubject } from "@/hooks/use-subjects-data";

interface SubjectCardProps {
  subject: ApiSubject;
  onView?: (subjectId: string) => void;
}

export const SubjectCard = ({ subject, onView }: SubjectCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView?.(subject.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: subject.color || "#6B7280" }}
              />
              <h3 className="font-semibold text-lg capitalize">{subject.name}</h3>
              {subject.code && (
                <Badge variant="outline" className="text-xs">
                  {subject.code}
                </Badge>
              )}
            </div>
            {subject.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2 capitalize">
                {subject.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {subject.class && (
                <div>
                  <span className="font-medium">Class:</span> {subject.class.name}
                </div>
              )}
              {subject.teachers.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{subject.teachers.length} teacher(s)</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {subject.teachers.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex flex-wrap gap-2">
              {subject.teachers.map((teacher) => (
                <Badge key={teacher.id} variant="secondary" className="text-xs">
                  {teacher.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

