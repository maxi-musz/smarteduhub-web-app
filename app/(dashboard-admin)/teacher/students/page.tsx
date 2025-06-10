"use client";

import React, { useState } from "react";
import { mockStudents } from "@/data/mockData";
import { Users } from "lucide-react";
import StudentsHeader from "@/components/teacher/students/StudentsHeader";
import StudentsFilters from "@/components/teacher/students/StudentsFilters";
import StudentCard from "@/components/teacher/students/StudentCard";

const classList = [
  "All Classes",
  "SS1A",
  "SS1B",
  "SS2A",
  "SS2B",
  "SS3A",
  "SS3B",
];

interface ExtendedStudent {
  id: string;
  name: string;
  grade: string;
  performance: number;
  attendance: number;
  avatar?: string;
  class?: string;
}

const TeacherStudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [classFilter, setClassFilter] = useState("All Classes");

  const extendedStudents = mockStudents as ExtendedStudent[];
  const grades = Array.from(
    new Set(mockStudents.map((student) => student.grade))
  );

  const filteredStudents = extendedStudents
    .filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (gradeFilter === "all" || student.grade === gradeFilter) &&
        (classFilter === "All Classes" || student.class === classFilter)
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "performance") {
        return b.performance - a.performance;
      } else if (sortBy === "attendance") {
        return b.attendance - a.attendance;
      }
      return 0;
    });

  const handleViewStudent = (studentId: string) => {
    console.log(`Viewing student with ID: ${studentId}`);
  };

  return (
    <div className="content-area space-y-6">
      <div className="sticky top-0 bg-white z-10 shadow-md p-4">
        <StudentsHeader
          classFilter={classFilter}
          setClassFilter={setClassFilter}
          classList={classList}
        />
        <StudentsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          gradeFilter={gradeFilter}
          setGradeFilter={setGradeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          grades={grades}
        />
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onView={handleViewStudent}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No students found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default TeacherStudentsPage;
