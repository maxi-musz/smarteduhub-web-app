"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, FileText, GraduationCap, Calendar } from "lucide-react";

interface Stats {
  totalSubjects: number;
  totalVideos: number;
  totalMaterials: number;
  totalClasses: number;
}

interface AcademicSession {
  id: string;
  academic_year: string;
  term: string;
}

interface SubjectStatsCardsProps {
  stats: Stats;
  isLoading: boolean;
  academicSession?: AcademicSession | null;
}

export const SubjectStatsCards = ({
  stats,
  isLoading,
  academicSession,
}: SubjectStatsCardsProps) => {

  if (isLoading) {
    return (
      <>
        {academicSession && (
          <div className="mb-4">
            <Card>
              <CardContent className="p-4">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {academicSession && (
        <div className="mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Academic Session</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-sm font-normal">
                      {academicSession.academic_year}
                    </Badge>
                    <Badge variant="outline" className="text-sm font-normal">
                      {academicSession.term} Term
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Subjects</p>
            <p className="text-2xl font-bold">{stats.totalSubjects}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Video className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Videos</p>
            <p className="text-2xl font-bold">{stats.totalVideos}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Materials</p>
            <p className="text-2xl font-bold">{stats.totalMaterials}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Classes</p>
            <p className="text-2xl font-bold">{stats.totalClasses}</p>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  );
};


