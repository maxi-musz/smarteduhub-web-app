import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Book, FileText, Users } from "lucide-react";
import StudentHeader from "@/components/ui/student-header";

const subjects = [
  {
    id: 1,
    name: "Mathematics",
    teacher: "Dr. Smith",
    progress: 75,
    nextClass: "Tomorrow, 10:00 AM",
    topics: ["Calculus", "Integration", "Differentiation"],
  },
  {
    id: 2,
    name: "Physics",
    teacher: "Prof. Johnson",
    progress: 82,
    nextClass: "Wednesday, 2:00 PM",
    topics: ["Wave Motion", "Optics", "Mechanics"],
  },
  {
    id: 3,
    name: "Chemistry",
    teacher: "Dr. Williams",
    progress: 90,
    nextClass: "Thursday, 11:30 AM",
    topics: ["Organic Chemistry", "Chemical Bonding", "Reactions"],
  },
];

const StudentSubjectsPage = () => {
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6">My Subjects</h1> */}

      {/* Header */}
      <StudentHeader
        studentName="Oluwajuwon Kayode"
        studentClass="SS3A"
        // avatarUrl="https://via.placeholder.com/150"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{subject.name}</span>
                <Book className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{subject.teacher}</span>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Course Progress</span>
                    <span>{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>

                <div className="text-sm">
                  <p className="font-medium">Next Class:</p>
                  <p className="text-muted-foreground">{subject.nextClass}</p>
                </div>

                <div className="text-sm">
                  <p className="font-medium mb-2">Current Topics:</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {subject.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Materials
                  </Button>
                  <Button className="w-full">
                    <Book className="h-4 w-4 mr-2" />
                    View Course
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentSubjectsPage;
