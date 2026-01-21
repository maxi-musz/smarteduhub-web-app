"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useExploreSubjects, LibrarySubject } from "@/hooks/explore/use-explore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, BookOpen, Layers, Video, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  SubjectFilters,
  SubjectList,
} from "@/app/teacher/subjects/subject-components";

const ExploreClassSubjectsPage = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useExploreSubjects({
    classId,
    search: searchQuery || undefined,
    page: 1,
    limit: 100, // Get all subjects for this class
  });

  const handleSubjectClick = (subjectId: string) => {
    router.push(`/explore/subjects/${subjectId}`);
  };

  const subjects = useMemo(() => {
    if (!data?.items) return [];
    // Transform explore subjects to match teacher subject structure
    return data.items.map((subject: LibrarySubject) => ({
      id: subject.id,
      name: subject.name,
      code: subject.code || null,
      color: subject.color,
      description: subject.description,
      thumbnail: subject.thumbnailUrl ? {
        secure_url: subject.thumbnailUrl,
        public_id: "",
      } : null,
      school: {
        id: "",
        school_name: "",
      },
      academicSession: {
        id: "",
        academic_year: "",
        term: "",
      },
      topics: [],
      createdAt: subject.createdAt || new Date().toISOString(),
      updatedAt: subject.createdAt || new Date().toISOString(),
    }));
  }, [data?.items]);

  // Calculate statistics from subjects
  const statistics = useMemo(() => {
    const subjectsList = data?.items || [];
    const totalVideos = subjectsList.reduce((sum: number, s: LibrarySubject) => sum + (s.videosCount || 0), 0);
    const totalTopics = subjectsList.reduce((sum: number, s: LibrarySubject) => sum + (s.topicsCount || 0), 0);
    const totalMaterials = 0; // Not available in explore API

    return {
      totalSubjects: subjectsList.length,
      totalTopics,
      totalVideos,
      totalMaterials,
    };
  }, [data?.items]);

  // Get class name from first subject (if available)
  const className = data?.items?.[0]?.class?.name || "Class";

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading class subjects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load class subjects</p>
            <Button onClick={() => router.push("/explore")}>Go Back</Button>
          </div>
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
            onClick={() => router.push("/explore")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
        </div>

        {/* Class Header */}
        <div className="pl-0 pr-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-heading">
            {className}
          </h1>
          <p className="text-sm sm:text-base text-brand-light-accent-1 mt-1">
            View and explore subjects for this class
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="pl-0 pr-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-brand-light-accent-1 mb-1">
                      Total Subjects
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-brand-heading">
                      {statistics.totalSubjects}
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
                      {statistics.totalTopics}
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
                      {statistics.totalVideos}
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
                      {statistics.totalMaterials}
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
          onAIClick={() => {}}
          onSubjectClick={handleSubjectClick}
          basePath="/explore"
          canManage={false}
        />
      </div>
    </>
  );
};

export default ExploreClassSubjectsPage;
