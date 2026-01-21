"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLibraryResourcesByClass, ResourcesByClassResponse } from "@/hooks/library-owner/use-library-resources-by-class";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { AIAgentModal } from "@/components/AIAgentModal";
import { useState } from "react";
import {
  SubjectFilters,
  SubjectList,
} from "@/app/teacher/subjects/subject-components";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Video, FileText, Layers, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const LibraryOwnerClassSubjectsPage = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");

  const { data, isLoading, error } = useLibraryResourcesByClass(classId);
  
  // Type assertion for data
  const classData = data as ResourcesByClassResponse | undefined;

  const errorMessage = useMemo(() => {
    if (!error) return null;

    if (error && typeof error === "object" && "statusCode" in error) {
      const apiError = error as AuthenticatedApiError;
      if (apiError.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (apiError.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return apiError.message || "An error occurred";
      }
    }

    if (error && typeof error === "object" && "message" in error) {
      return (error as Error).message;
    }

    return "An unexpected error occurred while loading class resources.";
  }, [error]);

  const handleAIClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setAiModalOpen(true);
  };

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/library-owner/subjects/${subjectId}`);
  };

  // Transform subjects to match SubjectList interface
  const subjects = useMemo(() => {
    if (!classData?.subjects) return [];
    return classData.subjects
      .filter((subject) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          subject.name.toLowerCase().includes(query) ||
          subject.code?.toLowerCase().includes(query) ||
          subject.description?.toLowerCase().includes(query)
        );
      })
      .map((subject) => ({
        id: subject.id,
        name: subject.name,
        code: subject.code || null,
        color: subject.color,
        description: subject.description,
        thumbnail: subject.thumbnailUrl
          ? {
              secure_url: subject.thumbnailUrl,
              public_id: subject.thumbnailKey || "",
            }
          : null,
        school: {
          id: "",
          school_name: "",
        },
        academicSession: {
          id: "",
          academic_year: "",
          term: "",
        },
        topics: subject.topics || [],
        createdAt: subject.createdAt || new Date().toISOString(),
        updatedAt: subject.updatedAt || new Date().toISOString(),
      }));
  }, [classData?.subjects, searchQuery]);

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-red-600">{errorMessage}</div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="text-center py-8 text-brand-light-accent-1">
          No class data found.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-6 space-y-6 bg-brand-bg">
        {/* Back Button */}
        <div className="pl-0 pr-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/library-owner/subjects")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Subjects
          </Button>
        </div>

        {/* Class Header */}
        <div className="pl-0 pr-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-heading">
            {classData.class.name}
          </h1>
          <p className="text-sm sm:text-base text-brand-light-accent-1 mt-1">
            View and manage subjects for this class
          </p>
        </div>

        {/* Statistics Cards */}
        {classData.statistics && (
          <div className="pl-0 pr-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-brand-light-accent-1 mb-1">
                      Total Subjects
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-heading">
                      {classData.statistics.totalSubjects}
                    </p>
                  </div>
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-brand-light-accent-1 mb-1">
                      Total Topics
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-heading">
                      {classData.statistics.totalTopics}
                    </p>
                  </div>
                  <Layers className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-brand-light-accent-1 mb-1">
                      Total Videos
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-heading">
                      {classData.statistics.totalVideos}
                    </p>
                  </div>
                  <Video className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-brand-light-accent-1 mb-1">
                      Total Materials
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-heading">
                      {classData.statistics.totalMaterials}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search Filter */}
        <SubjectFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Subjects List */}
        <SubjectList
          subjects={subjects}
          isLoading={false}
          pagination={undefined}
          totalSubjects={subjects.length}
          searchQuery={searchQuery}
          onAIClick={handleAIClick}
          onSubjectClick={handleSubjectClick}
          basePath="/library-owner"
          canManage={true}
        />
      </div>

      <AIAgentModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        subject={selectedSubject}
      />
    </>
  );
};

export default LibraryOwnerClassSubjectsPage;
