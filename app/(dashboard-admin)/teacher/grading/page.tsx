"use client";

import React, { useState } from "react";
import { mockGrades, mockSubjects } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PenLine } from "lucide-react";
import { GradeStatus, AssignmentType, Grade } from "@/constants/types";
import GradingHeader from "@/components/teacher/grading/GradingHeader";
import GradingFilters from "@/components/teacher/grading/GradingFilters";
import GradeItem from "@/components/teacher/grading/GradeItem";

const classList = [
  "All Classes",
  "SS1A",
  "SS1B",
  "SS2A",
  "SS2B",
  "SS3A",
  "SS3B",
];

const assignmentTypes = [
  { id: "all", label: "All Types" },
  { id: "exam", label: "Exam" },
  { id: "lab-report", label: "Lab Report" },
  { id: "essay", label: "Essay" },
  { id: "book-report", label: "Book Report" },
  { id: "homework", label: "Homework" },
  { id: "quiz", label: "Quiz" },
];

const TeacherGradingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<GradeStatus>("all");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [assignmentTypeFilter, setAssignmentTypeFilter] =
    useState<AssignmentType>("all");

  // Cast mockGrades to Grade[] to ensure type compatibility
  const filteredGrades = (mockGrades as unknown as Grade[]).filter(
    (grade) =>
      (activeTab === "all" || grade.status === activeTab) &&
      (assignmentTypeFilter === "all" || grade.type === assignmentTypeFilter) &&
      (searchTerm === "" ||
        grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.assignment.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (subjectFilter === "all" || grade.subject === subjectFilter) &&
      (classFilter === "All Classes" || grade.class === classFilter)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Graded
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            Pending
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Draft
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="">
      <GradingHeader
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        classList={classList}
      />

      <GradingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        assignmentTypeFilter={assignmentTypeFilter}
        setAssignmentTypeFilter={setAssignmentTypeFilter}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        assignmentTypes={assignmentTypes}
        subjects={mockSubjects}
      />

      <Tabs
        defaultValue="all"
        onValueChange={(value) => setActiveTab(value as GradeStatus)}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="graded">Graded</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <GradesList
                grades={filteredGrades}
                getStatusBadge={getStatusBadge}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <GradesList
                grades={filteredGrades}
                getStatusBadge={getStatusBadge}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graded">
          <Card>
            <CardContent className="p-0">
              <GradesList
                grades={filteredGrades}
                getStatusBadge={getStatusBadge}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardContent className="p-0">
              <GradesList
                grades={filteredGrades}
                getStatusBadge={getStatusBadge}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface GradesListProps {
  grades: Grade[];
  getStatusBadge: (status: string) => React.ReactElement | null;
}

const GradesList: React.FC<GradesListProps> = ({ grades, getStatusBadge }) => {
  if (grades.length === 0) {
    return (
      <div className="text-center py-12">
        <PenLine className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No grades found</h3>
        <p className="text-gray-500">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {grades.map((grade) => (
        <GradeItem
          key={grade.id}
          grade={grade}
          getStatusBadge={getStatusBadge}
        />
      ))}
    </div>
  );
};

export default TeacherGradingPage;
