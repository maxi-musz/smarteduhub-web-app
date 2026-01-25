"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useExamBodySubjects } from "@/hooks/exam-body/use-exam-body-subjects";
import type { ExamBodySubject } from "@/hooks/exam-body/types";
import { SubjectFormDialog } from "./SubjectFormDialog";
import { SubjectDeleteDialog } from "./SubjectDeleteDialog";

interface ExamBodySubjectsSectionProps {
  examBodyId: string;
}

const statusClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-yellow-100 text-yellow-700";
    case "archived":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const ExamBodySubjectsSection = ({
  examBodyId,
}: ExamBodySubjectsSectionProps) => {
  const { data, isLoading } = useExamBodySubjects(examBodyId);
  const subjects = useMemo(() => data || [], [data]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<ExamBodySubject | null>(null);
  const [deletingSubject, setDeletingSubject] = useState<ExamBodySubject | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-heading">Subjects</h3>
          <p className="text-sm text-brand-light-accent-1">
            Manage exam body subjects and their metadata.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
            No subjects found for this exam body yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {subjects.map((subject) => (
            <Card key={subject.id} className="border-brand-border">
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="flex items-center gap-3">
                  {subject.iconUrl ? (
                    <Image
                      src={subject.iconUrl}
                      alt={`${subject.name} icon`}
                      width={44}
                      height={44}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-md bg-gray-100 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-brand-heading">{subject.name}</p>
                      <Badge className="bg-blue-100 text-blue-700">
                        {subject.code}
                      </Badge>
                      <Badge className={statusClass(subject.status)}>
                        {subject.status}
                      </Badge>
                    </div>
                    {subject.description && (
                      <p className="text-sm text-brand-light-accent-1 mt-1">
                        {subject.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingSubject(subject)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingSubject(subject)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SubjectFormDialog
        open={isCreateOpen}
        mode="create"
        examBodyId={examBodyId}
        onOpenChange={setIsCreateOpen}
      />

      <SubjectFormDialog
        open={!!editingSubject}
        mode="edit"
        examBodyId={examBodyId}
        subject={editingSubject}
        onOpenChange={(open) => {
          if (!open) setEditingSubject(null);
        }}
      />

      <SubjectDeleteDialog
        open={!!deletingSubject}
        examBodyId={examBodyId}
        subject={deletingSubject}
        onOpenChange={(open) => {
          if (!open) setDeletingSubject(null);
        }}
      />
    </div>
  );
};
