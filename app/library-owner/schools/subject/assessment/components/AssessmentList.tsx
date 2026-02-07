"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClipboardList, Eye, FileQuestion, Users, Send, X, Trash2 } from "lucide-react";
import type { LibrarySchoolAssessment } from "../hooks/use-library-school-assessments";
import {
  useDeleteLibrarySchoolAssessment,
  usePublishLibrarySchoolAssessment,
  useUnpublishLibrarySchoolAssessment,
} from "../hooks/use-library-school-assessments";

interface AssessmentListProps {
  schoolId: string;
  subjectId: string;
  subjectName: string;
  assessments: LibrarySchoolAssessment[];
  isLoading: boolean;
}

export function AssessmentList({
  schoolId,
  subjectId,
  subjectName,
  assessments,
  isLoading,
}: AssessmentListProps) {
  const deleteMutation = useDeleteLibrarySchoolAssessment(schoolId);
  const publishMutation = usePublishLibrarySchoolAssessment(schoolId);
  const unpublishMutation = useUnpublishLibrarySchoolAssessment(schoolId);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishId, setPublishId] = useState<string | null>(null);
  const [unpublishId, setUnpublishId] = useState<string | null>(null);

  const basePath = `/library-owner/schools/subject/assessment/${schoolId}/${subjectId}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "PUBLISHED": return "bg-blue-100 text-blue-800";
      case "ACTIVE": return "bg-green-100 text-green-800";
      case "CLOSED": return "bg-purple-100 text-purple-800";
      case "ARCHIVED": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CBT": return "bg-indigo-100 text-indigo-800";
      case "EXAM": return "bg-red-100 text-red-800";
      case "QUIZ": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader><div className="h-6 w-3/4 bg-gray-200 rounded" /></CardHeader>
            <CardContent><div className="h-4 w-full bg-gray-200 rounded mb-2" /><div className="h-4 w-2/3 bg-gray-200 rounded" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!assessments.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-brand-heading mb-2">No assessments yet</h3>
          <p className="text-brand-light-accent-1 mb-4">Create an assessment for {subjectName}</p>
          <Button asChild>
            <Link href={`${basePath}/create`}>Create assessment</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {assessments.map((a) => (
          <Card key={a.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-2">{a.title}</CardTitle>
                  {a.description && <p className="text-sm text-brand-light-accent-1 mb-3 line-clamp-2">{a.description}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={getStatusColor(a.status)}>{a.status}</Badge>
                    <Badge className={getTypeColor(a.assessment_type)}>{a.assessment_type}</Badge>
                    {a.topic && <Badge variant="outline">{a.topic.title}</Badge>}
                    {a._count && (
                      <>
                        <span className="flex items-center gap-1 text-sm text-brand-light-accent-1">
                          <FileQuestion className="h-4 w-4" /> {a._count.questions} questions
                        </span>
                        <span className="flex items-center gap-1 text-sm text-brand-light-accent-1">
                          <Users className="h-4 w-4" /> {a._count.attempts} attempts
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${basePath}/${a.id}`}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Link>
                  </Button>
                  {a.status === "DRAFT" && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => setPublishId(a.id)} disabled={publishMutation.isPending || (a._count?.questions ?? 0) < 5}>
                        <Send className="h-4 w-4 mr-1" /> Publish
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteId(a.id)} disabled={deleteMutation.isPending}>
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </>
                  )}
                  {(a.status === "PUBLISHED" || a.status === "ACTIVE") && (
                    <Button variant="ghost" size="sm" onClick={() => setUnpublishId(a.id)} disabled={unpublishMutation.isPending}>
                      <X className="h-4 w-4 mr-1" /> Unpublish
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div><span className="text-brand-light-accent-1">Duration:</span> <span className="ml-2 font-medium">{a.duration ? `${a.duration} min` : "N/A"}</span></div>
                <div><span className="text-brand-light-accent-1">Points:</span> <span className="ml-2 font-medium">{a.total_points}</span></div>
                <div><span className="text-brand-light-accent-1">Passing:</span> <span className="ml-2 font-medium">{a.passing_score}%</span></div>
                <div><span className="text-brand-light-accent-1">Max attempts:</span> <span className="ml-2 font-medium">{a.max_attempts}</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete assessment</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone. Students with attempts may prevent deletion.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => deleteId && deleteMutation.mutate(deleteId, { onSettled: () => setDeleteId(null) })}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!publishId} onOpenChange={(o) => !o && setPublishId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publish assessment?</AlertDialogTitle>
            <AlertDialogDescription>Students will be able to see and attempt this assessment.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => publishId && publishMutation.mutate(publishId, { onSettled: () => setPublishId(null) })}>Publish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={!!unpublishId} onOpenChange={(o) => !o && setUnpublishId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unpublish assessment?</AlertDialogTitle>
            <AlertDialogDescription>Students will no longer see or access this assessment.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => unpublishId && unpublishMutation.mutate(unpublishId, { onSettled: () => setUnpublishId(null) })}>Unpublish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
