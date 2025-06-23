"use client";

import React, { useState } from "react";
import { mockSubjects } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, BarChart3, Users, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAgentLogo } from "@/components/AIAgentLogo";
import { AIAgentModal } from "@/components/AIAgentModal";

const TeacherSubjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // State for AI Assistant modal
  // and selected subject
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  const getBarHeight = (count: number, totalStudents: number) => {
    return Math.max((count / totalStudents) * 100, 10); // Minimum 10% height for visibility
  };

  // Filter subjects based on search
  const filteredSubjects = mockSubjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">Subjects</h1>
            <p className="text-brand-light-accent-1 text-sm">
              Manage your teaching subjects
            </p>
          </div>
          {/* Only Admin can add subjects for teachers */}
          {/* <Button className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-1" />
            Add Subject
          </Button> */}
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <Card
              key={subject.id}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="h-2" style={{ backgroundColor: subject.color }} />
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <h3>{subject.name}</h3>
                    <p className="text-sm font-normal text-muted-foreground">
                      {subject.code}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    style={{ color: subject.color }}
                    aria-label="AI Assistant"
                    onClick={() => handleAIClick(subject.name)}
                  >
                    <AIAgentLogo size="sm" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">Students</span>
                      </div>
                      <span className="font-medium">{subject.students}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">Avg. Grade</span>
                      </div>
                      <span className="font-medium">
                        {subject.averageGrade}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">Next Class</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {subject.nextClass}
                      </span>
                    </div>
                  </TabsContent>

                  <TabsContent value="performance">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Class Average</span>
                          <span className="text-sm font-medium">
                            {subject.averageGrade}%
                          </span>
                        </div>
                        <Progress
                          value={subject.averageGrade}
                          className="h-2"
                        />
                      </div>

                      <div className="text-sm">
                        <div className="flex justify-between mb-2">
                          <span>Grade Distribution</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {(["A", "B", "C", "D"] as const).map((grade) => {
                            const count = subject.gradeDistribution[grade];
                            const height = getBarHeight(
                              count,
                              subject.students
                            );
                            return (
                              <div key={grade} className="text-center">
                                <div className="h-16 bg-muted rounded-t-sm relative">
                                  <div
                                    className="absolute bottom-0 left-0 right-0 rounded-t-sm flex items-center justify-center text-white text-xs font-medium"
                                    style={{
                                      height: `${height}%`,
                                      backgroundColor: subject.color,
                                      opacity:
                                        grade === "A"
                                          ? 1
                                          : grade === "B"
                                          ? 0.8
                                          : grade === "C"
                                          ? 0.6
                                          : 0.4,
                                    }}
                                  >
                                    {count > 0 && <span>{count}</span>}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs font-medium">
                                  {grade}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No subjects found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      <AIAgentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        subject={selectedSubject}
      />
    </>
  );
};

export default TeacherSubjectsPage;
