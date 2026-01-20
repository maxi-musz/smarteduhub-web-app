"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, FileText, Video, Calendar, Clock, Loader2 } from "lucide-react";
import StudentHeader from "@/components/ui/student-header";
import { AIAgentLogo } from "@/components/AIAgentLogo";
import { AIAgentModal } from "@/components/AIAgentModal";
import { useStudentSubjects, type StudentSubjectsData, type StudentSubject } from "@/hooks/use-student-subjects";
import { useStudentDashboard, type StudentDashboardData } from "@/hooks/use-student-dashboard";
import Link from "next/link";

const StudentSubjectsPage = () => {
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const page = 1;
  const limit = 20;

  const { data: subjectsData, isLoading, error } = useStudentSubjects({ page, limit });
  const { data: dashboardData } = useStudentDashboard();

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  const formatDay = (day: string) => {
    const dayMap: Record<string, string> = {
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
    };
    return dayMap[day] || day;
  };

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading subjects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !subjectsData) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load subjects</p>
            {error && (
              <p className="text-sm text-gray-600 mb-4">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            )}
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  const { subjects, stats } = subjectsData as StudentSubjectsData;

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        {/* Header */}
        <StudentHeader
          studentName={(dashboardData as StudentDashboardData)?.general_info?.student?.name || "Student"}
          studentClass={(dashboardData as StudentDashboardData)?.general_info?.student_class?.name || ""}
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Book className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Subjects</p>
                  <p className="text-2xl font-bold">{stats.totalSubjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Video className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Videos</p>
                  <p className="text-2xl font-bold">{stats.totalVideos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Materials</p>
                  <p className="text-2xl font-bold">{stats.totalMaterials}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Book className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Assignments</p>
                  <p className="text-2xl font-bold">{stats.totalAssignments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No subjects found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subjects.map((subject: StudentSubject) => {
              const nextClass = subject.timetableEntries[0];
              
              return (
                <Link key={subject.id} href={`/student/subjects/${subject.id}`}>
                  <Card className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
                    <div
                      className="h-2"
                      style={{ backgroundColor: subject.color || "#6B7280" }}
                    />
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div>
                          <span className="capitalize">{subject.name}</span>
                          {subject.code && (
                            <p className="text-sm font-normal text-gray-600 mt-1">
                              {subject.code}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAIClick(subject.name);
                          }}
                          className="p-1 rounded-full hover:bg-accent transition-colors"
                          style={{ color: subject.color || "#6B7280" }}
                          aria-label="AI Assistant"
                        >
                          <AIAgentLogo size="sm" />
                        </button>
                      </CardTitle>
                    </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Content Counts */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <Video className="h-4 w-4 mx-auto text-purple-600 mb-1" />
                          <p className="text-xs text-gray-600">Videos</p>
                          <p className="font-semibold">{subject.contentCounts.totalVideos}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <FileText className="h-4 w-4 mx-auto text-green-600 mb-1" />
                          <p className="text-xs text-gray-600">Materials</p>
                          <p className="font-semibold">{subject.contentCounts.totalMaterials}</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <Book className="h-4 w-4 mx-auto text-orange-600 mb-1" />
                          <p className="text-xs text-gray-600">Tasks</p>
                          <p className="font-semibold">{subject.contentCounts.totalAssignments}</p>
                        </div>
                      </div>

                      {/* Next Class */}
                      {nextClass && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-900">Next Class</p>
                          </div>
                          <div className="space-y-1 text-sm text-blue-800">
                            <p className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {formatDay(nextClass.day_of_week)} • {nextClass.startTime} - {nextClass.endTime}
                            </p>
                            {nextClass.room && (
                              <p className="text-xs text-blue-700">Room: {nextClass.room}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Classes */}
                      {subject.classesTakingSubject.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {subject.classesTakingSubject.map((cls) => (
                            <Badge key={cls.id} variant="outline" className="text-xs">
                              {cls.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1" 
                          size="sm"
                          onClick={(e) => e.preventDefault()}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Materials
                        </Button>
                        <Button 
                          className="flex-1" 
                          size="sm"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Book className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </Link>
              );
            })}
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

export default StudentSubjectsPage;
