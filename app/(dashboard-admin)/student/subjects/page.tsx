"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Book, FileText, Users } from "lucide-react";
import StudentHeader from "@/components/ui/student-header";
import { AIAgentLogo } from "@/components/AIAgentLogo";
import { AIAgentModal } from "@/components/AIAgentModal";

const subjects = [
  {
    id: 1,
    name: "Mathematics",
    teacher: "Mr. Adewale",
    progress: 75,
    nextClass: "Tomorrow, 10:00 AM",
  },
  {
    id: 2,
    name: "English Language",
    teacher: "Mrs. Okafor",
    progress: 82,
    nextClass: "Wednesday, 2:00 PM",
  },
  {
    id: 3,
    name: "Civic Education",
    teacher: "Mr. Chukwu",
    progress: 90,
    nextClass: "Thursday, 11:30 AM",
  },
  {
    id: 4,
    name: "Physics",
    teacher: "Mrs. Balogun",
    progress: 68,
    nextClass: "Friday, 9:00 AM",
  },
  {
    id: 5,
    name: "Biology",
    teacher: "Mr. Eze",
    progress: 77,
    nextClass: "Monday, 8:30 AM",
  },
  {
    id: 6,
    name: "Chemistry",
    teacher: "Mrs. Ogunleye",
    progress: 54,
    nextClass: "Tuesday, 1:00 PM",
  },
  {
    id: 7,
    name: "Further Mathematics",
    teacher: "Mr. Musa",
    progress: 80,
    nextClass: "Thursday, 12:00 PM",
  },
  {
    id: 8,
    name: "Geography",
    teacher: "Mrs. Danjuma",
    progress: 62,
    nextClass: "Wednesday, 10:30 AM",
  },
  {
    id: 9,
    name: "Computer Science",
    teacher: "Mr. Adebayo",
    progress: 71,
    nextClass: "Friday, 2:30 PM",
  },
];

const StudentSubjectsPage = () => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <StudentHeader
          studentName="Oluwajuwon Kayode"
          studentClass="SS3A"
          // avatarUrl="https://via.placeholder.com/150"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{subject.name}</span>
                  <button
                    onClick={() => {
                      // Handle AI Assistant click
                      handleAIClick(subject.name);
                    }}
                    className="p-1 rounded-full hover:bg-accent transition-colors"
                    aria-label="AI Assistant"
                  >
                    <AIAgentLogo size="sm" />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-brand-light-accent-1">
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
                    <p className="text-brand-light-accent-1">
                      {subject.nextClass}
                    </p>
                  </div>

                  <div className="flex flex-col lg:flex-row space-y-2 space-x-2 pt-2">
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

      <AIAgentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        subject={selectedSubject}
      />
    </>
  );
};

export default StudentSubjectsPage;
