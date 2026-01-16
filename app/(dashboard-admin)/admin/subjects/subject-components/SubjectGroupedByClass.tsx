"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { type ClassGroup } from "@/hooks/use-subjects-data";

interface SubjectGroupedByClassProps {
  classes: ClassGroup[];
  isLoading: boolean;
  onViewSubject?: (subjectId: string) => void;
}

const ClassGroupSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export const SubjectGroupedByClass = ({
  classes,
  isLoading,
  onViewSubject,
}: SubjectGroupedByClassProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ClassGroupSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No subjects found grouped by class
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {classes.map((classGroup) => (
        <Card key={classGroup.classId}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{classGroup.className}</span>
              <Badge variant="outline">{classGroup.subjectsCount} subjects</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {classGroup.subjects.length > 0 ? (
                classGroup.subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onViewSubject?.(subject.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: subject.color || "#6B7280" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm capitalize truncate">
                            {subject.name}
                          </div>
                          {subject.code && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {subject.code}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {subject.description && (
                      <p className="text-xs text-gray-500 capitalize line-clamp-2 mb-2">
                        {subject.description}
                      </p>
                    )}
                    {subject.teachers.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{subject.teachers.length} teacher(s)</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-4">
                  No subjects in this class
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

