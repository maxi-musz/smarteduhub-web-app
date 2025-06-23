"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import StudentHeader from "@/components/ui/student-header";
import { AcademicResultsTable } from "@/components/student/results/AcademicResultsTable";

// const results = [
//   {
//     id: 1,
//     subject: "Mathematics",
//     type: "Exam",
//     score: 92,
//     grade: "A",
//     date: "2024-04-15",
//     feedback: "Excellent understanding of calculus concepts.",
//   },
//   {
//     id: 2,
//     subject: "Physics",
//     type: "Test",
//     score: 85,
//     grade: "B+",
//     date: "2024-03-20",
//     feedback: "Good grasp of mechanics, needs improvement in thermodynamics.",
//   },
//   {
//     id: 3,
//     subject: "Chemistry",
//     type: "Quiz",
//     score: 95,
//     grade: "A+",
//     date: "2024-04-01",
//     feedback: "Outstanding performance in organic chemistry.",
//   },
//   {
//     id: 4,
//     subject: "Biology",
//     type: "Exam",
//     score: 88,
//     grade: "A",
//     date: "2024-04-10",
//     feedback: "Strong understanding of genetics and evolution.",
//   },
//   {
//     id: 5,
//     subject: "English",
//     type: "Test",
//     score: 78,
//     grade: "B",
//     date: "2024-03-25",
//     feedback: "Good analysis of literary texts, needs improvement in grammar.",
//   },
//   {
//     id: 6,
//     subject: "History",
//     type: "Quiz",
//     score: 82,
//     grade: "B-",
//     date: "2024-04-05",
//     feedback:
//       "Good recall of historical events, needs better critical analysis.",
//   },
//   {
//     id: 7,
//     subject: "Geography",
//     type: "Exam",
//     score: 90,
//     grade: "A-",
//     date: "2024-04-12",
//     feedback: "Excellent understanding of physical geography.",
//   },
//   {
//     id: 8,
//     subject: "Art",
//     type: "Test",
//     score: 87,
//     grade: "B+",
//     date: "2024-03-30",
//     feedback: "Creative and innovative artwork.",
//   },
//   {
//     id: 9,
//     subject: "Music",
//     type: "Quiz",
//     score: 92,
//     grade: "A",
//     date: "2024-04-08",
//     feedback: "Outstanding performance in music theory.",
//   },
//   {
//     id: 10,
//     subject: "Physical Education",
//     type: "Exam",
//     score: 85,
//     grade: "B+",
//     date: "2024-04-18",
//     feedback: "Good physical fitness and sportsmanship.",
//   },
//   {
//     id: 11,
//     subject: "Computer Science",
//     type: "Test",
//     score: 94,
//     grade: "A",
//     date: "2024-03-28",
//     feedback: "Excellent programming skills and problem-solving.",
//   },
//   {
//     id: 12,
//     subject: "Economics",
//     type: "Quiz",
//     score: 89,
//     grade: "A-",
//     date: "2024-04-03",
//     feedback: "Strong understanding of economic principles.",
//   },
// ];

// const getGradeColor = (grade: string) => {
//   if (grade.startsWith("A")) return "bg-green-100 text-green-800";
//   if (grade.startsWith("B")) return "bg-blue-100 text-blue-800";
//   if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800";
//   return "bg-red-100 text-red-800";
// };

const StudentResultsPage = () => {
  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <StudentHeader
        studentName="Oluwajuwon Kayode"
        studentClass="SS3A"
        // avatarUrl="https://via.placeholder.com/150"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73/100</div>
            <p className="text-xs text-muted-foreground">
              Academic Year 2025-24
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Courses
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Out of 15 courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Achievement Points
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850</div>
            <p className="text-xs text-muted-foreground">Top 10% of class</p>
          </CardContent>
        </Card>
      </div>

      {/* Academic Results Tables */}
      <AcademicResultsTable />
    </div>
  );
};

export default StudentResultsPage;
