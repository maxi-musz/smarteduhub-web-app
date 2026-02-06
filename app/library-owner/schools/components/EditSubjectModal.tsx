"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateLibrarySchoolSubject } from "@/hooks/library-owner/use-update-library-school-subject";
import { useToast } from "@/hooks/use-toast";
import { formatTitle } from "@/lib/text-formatter";
import { Loader2 } from "lucide-react";
import type { Class, Teacher } from "@/hooks/library-owner/use-library-owner-school";

const SUBJECT_COLORS = [
  { name: "Red", value: "#E74C3C" },
  { name: "Blue", value: "#3498DB" },
  { name: "Green", value: "#2ECC71" },
  { name: "Orange", value: "#E67E22" },
  { name: "Purple", value: "#9B59B6" },
  { name: "Teal", value: "#1ABC9C" },
  { name: "Indigo", value: "#3F51B5" },
];

export interface SubjectForEdit {
  id: string;
  name: string;
  code: string | null;
  color: string;
}

interface EditSubjectModalProps {
  schoolId: string;
  subject: SubjectForEdit | null;
  availableClasses: Class[];
  availableTeachers: Teacher[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditSubjectModal({
  schoolId,
  subject,
  availableClasses,
  availableTeachers,
  isOpen,
  onClose,
  onSuccess,
}: EditSubjectModalProps) {
  const { toast } = useToast();
  const updateSubject = useUpdateLibrarySchoolSubject();
  const [subjectName, setSubjectName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(SUBJECT_COLORS[0].value);
  const [classId, setClassId] = useState<string>("none");
  const [teacherIds, setTeacherIds] = useState<string[]>([]);

  useEffect(() => {
    if (!subject || !isOpen) return;
    setSubjectName(subject.name);
    setCode(subject.code ?? "");
    setDescription("");
    setColor(subject.color || SUBJECT_COLORS[0].value);
    setClassId("none");
    setTeacherIds([]);
  }, [subject, isOpen]);

  const handleToggleTeacher = (teacherId: string, checked: boolean) => {
    setTeacherIds((prev) =>
      checked ? [...prev, teacherId] : prev.filter((id) => id !== teacherId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) return;
    const name = subjectName.trim();
    if (!name) return;
    try {
      await updateSubject.mutateAsync({
        schoolId,
        subjectId: subject.id,
        subject_name: formatTitle(name),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        color: color.trim() || undefined,
        class_taking_it: classId && classId !== "none" ? classId : undefined,
        teachers_taking_it: teacherIds.length > 0 ? teacherIds : undefined,
      });
      toast({
        title: "Subject updated",
        description: "Subject has been updated successfully.",
      });
      onClose();
      onSuccess?.();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to update subject",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  if (!subject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="edit-subject-name" className="text-xs">
              Subject name *
            </Label>
            <Input
              id="edit-subject-name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              onBlur={(e) => setSubjectName(formatTitle(e.target.value))}
              placeholder="e.g. Mathematics"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-subject-code" className="text-xs">
              Code
            </Label>
            <Input
              id="edit-subject-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. MATH101"
              className="h-9"
            />
          </div>
          {availableClasses.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">Class</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {availableClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {availableTeachers.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs">Teachers assigned</Label>
              <div className="border border-brand-border rounded-md p-2 max-h-32 overflow-y-auto space-y-2 bg-white">
                {availableTeachers.map((t) => (
                  <label
                    key={t.id}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={teacherIds.includes(t.id)}
                      onCheckedChange={(checked) =>
                        handleToggleTeacher(t.id, checked === true)
                      }
                    />
                    <span className="text-brand-heading">
                      {t.first_name} {t.last_name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-subject-desc" className="text-xs">
              Description
            </Label>
            <Input
              id="edit-subject-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="h-9"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={updateSubject.isPending || !subjectName.trim()}
              className="bg-brand-primary text-white hover:bg-brand-primary/90"
            >
              {updateSubject.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
