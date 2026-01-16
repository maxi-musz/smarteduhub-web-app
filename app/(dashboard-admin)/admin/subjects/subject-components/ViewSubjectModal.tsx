"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Pencil, Users } from "lucide-react";
import { useSubjects } from "@/hooks/use-subjects-data";

interface ViewSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string | null;
  onEdit: (subjectId: string) => void;
}

export const ViewSubjectModal = ({
  open,
  onOpenChange,
  subjectId,
  onEdit,
}: ViewSubjectModalProps) => {
  const { data: subjectsData } = useSubjects({});
  
  const subject = subjectsData && "subjects" in subjectsData
    ? subjectsData.subjects.find((s) => s.id === subjectId)
    : null;

  if (!subjectId || !subject) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subject Details</DialogTitle>
          <DialogDescription>
            View complete information about this subject
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: subject.color || "#6B7280" }}
            />
            <div>
              <h3 className="font-semibold text-lg capitalize">{subject.name}</h3>
              {subject.code && (
                <Badge variant="outline" className="mt-1">{subject.code}</Badge>
              )}
            </div>
          </div>
          {subject.description && (
            <div>
              <Label className="text-gray-500">Description</Label>
              <p className="font-medium capitalize mt-1">{subject.description}</p>
            </div>
          )}
          {subject.class && (
            <div>
              <Label className="text-gray-500">Assigned Class</Label>
              <p className="font-medium mt-1">{subject.class.name}</p>
            </div>
          )}
          <div>
            <Label className="text-gray-500">Color</Label>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: subject.color || "#6B7280" }}
              />
              <span className="text-sm font-mono">{subject.color || "#6B7280"}</span>
            </div>
          </div>
          <div>
            <Label className="text-gray-500 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Assigned Teachers
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {subject.teachers.length > 0 ? (
                subject.teachers.map((teacher) => (
                  <Badge key={teacher.id} variant="secondary">
                    {teacher.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-400">No teachers assigned</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {subjectId && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(subjectId);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Subject
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

