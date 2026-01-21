"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, Calendar, GraduationCap } from "lucide-react";
import { useState, useMemo } from "react";
import type { CurrentSession, SubjectWithStats } from "@/hooks/student/use-student-assessments";

interface AssessmentHeaderProps {
  currentSession?: CurrentSession;
  subjects?: SubjectWithStats[];
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const AssessmentHeader = ({ 
  currentSession, 
  subjects = [],
  onSearch, 
  searchQuery 
}: AssessmentHeaderProps) => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.refetchQueries({
        queryKey: ["student", "assessments"],
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calculate overall statistics from all subjects
  const overallStats = useMemo(() => {
    if (!subjects || subjects.length === 0) {
      return {
        total_assessments: 0,
        completed: 0,
        attempted: 0,
        not_attempted: 0,
      };
    }

    return subjects.reduce(
      (acc, subject) => ({
        total_assessments: acc.total_assessments + subject.assessment_stats.total_assessments,
        completed: acc.completed + subject.assessment_stats.completed,
        attempted: acc.attempted + subject.assessment_stats.attempted,
        not_attempted: acc.not_attempted + subject.assessment_stats.not_attempted,
      }),
      { total_assessments: 0, completed: 0, attempted: 0, not_attempted: 0 }
    );
  }, [subjects]);

  // Format session text with proper capitalization
  const formatSessionText = (text: string): string => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-brand-heading">My Assessments</h1>
          <p className="text-brand-light-accent-1 text-sm">
            View and Attempt Your Assessments, Quizzes, and Exams
          </p>
          {currentSession && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                <GraduationCap className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-900">
                  Academic Year:
                </span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  {currentSession.academic_year}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900">
                  Term:
                </span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                  {formatSessionText(currentSession.term)}
                </Badge>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Overall Statistics Card */}
      {subjects && subjects.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <Badge variant="outline" className="bg-white">
              {subjects.length} {subjects.length === 1 ? "Subject" : "Subjects"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.total_assessments}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {overallStats.completed}
              </p>
              {overallStats.total_assessments > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  {Math.round((overallStats.completed / overallStats.total_assessments) * 100)}%
                </p>
              )}
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Attempted</p>
              <p className="text-2xl font-bold text-blue-600">
                {overallStats.attempted}
              </p>
              {overallStats.total_assessments > 0 && (
                <p className="text-xs text-blue-600 mt-1">
                  {Math.round((overallStats.attempted / overallStats.total_assessments) * 100)}%
                </p>
              )}
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Not Attempted</p>
              <p className="text-2xl font-bold text-orange-600">
                {overallStats.not_attempted}
              </p>
              {overallStats.total_assessments > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  {Math.round((overallStats.not_attempted / overallStats.total_assessments) * 100)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Assessments..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};


