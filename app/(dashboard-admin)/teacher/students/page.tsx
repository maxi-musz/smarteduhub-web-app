"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentsTable } from "@/components/teacher/students/StudentsTable";
import { Plus, Search, Users } from "lucide-react";

const classes = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const sortOptions = ["Performance", "Attendance"];

export default function TeacherStudentsPage() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Performance");

  return (
    <div className="py-6 space-y-6 min-h-screen bg-brand-bg ">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-brand-heading">Students</h1>
          </div>
          <p className="text-brand-light-accent-1 text-sm lg:text-lg">
            Manage and monitor student performance and attendance.
          </p>
        </div>

        {/* Filters and Actions */}
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
                  variant={selectedClass === "" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedClass("")}
                >
                  All Classes
                </Badge>
                {classes.map((className) => (
                  <Badge
                    key={className}
                    variant={
                      selectedClass === className ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => setSelectedClass(className)}
                  >
                    {className}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option}
                    variant={sortBy === option ? "default" : "outline"}
                    onClick={() => setSortBy(option)}
                    size="sm"
                  >
                    Best {option}
                  </Button>
                ))}
              </div>

              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <StudentsTable
          selectedClass={selectedClass}
          searchQuery={searchQuery}
          sortBy={sortBy}
        />
      </div>
    </div>
  );
}
