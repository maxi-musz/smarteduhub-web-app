"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import type { StudentTabResponse } from "@/hooks/use-teacher-data";

interface StudentFiltersProps {
  searchQuery: string;
  selectedClassId: string;
  classes: StudentTabResponse["classes"];
  onSearchChange: (value: string) => void;
  onClassChange: (classId: string) => void;
}

export const StudentFilters = ({
  searchQuery,
  selectedClassId,
  classes,
  onSearchChange,
  onClassChange,
}: StudentFiltersProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters & Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Class Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Filter by Class
          </label>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedClassId === "" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onClassChange("")}
            >
              All Classes
            </Badge>
            {classes.map((classItem) => (
              <Badge
                key={classItem.id}
                variant={selectedClassId === classItem.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onClassChange(classItem.id)}
              >
                {classItem.name} ({classItem.student_count})
              </Badge>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students by name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

