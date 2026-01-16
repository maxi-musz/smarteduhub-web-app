"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import {
  useUpdateSubject,
  useSubjects,
  useAvailableTeachersClasses,
  type UpdateSubjectRequest,
} from "@/hooks/use-subjects-data";

interface EditSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string | null;
}

const SUBJECT_COLORS = [
  { name: "Red", value: "#E74C3C" },
  { name: "Blue", value: "#3498DB" },
  { name: "Green", value: "#2ECC71" },
  { name: "Orange", value: "#E67E22" },
  { name: "Purple", value: "#9B59B6" },
  { name: "Yellow", value: "#F1C40F" },
  { name: "Teal", value: "#1ABC9C" },
  { name: "Pink", value: "#E91E63" },
  { name: "Indigo", value: "#3F51B5" },
  { name: "Cyan", value: "#00BCD4" },
];

export const EditSubjectModal = ({
  open,
  onOpenChange,
  subjectId,
}: EditSubjectModalProps) => {
  const [formData, setFormData] = useState<UpdateSubjectRequest & {
    subject_name?: string;
  }>({
    subject_name: "",
    code: "",
    description: "",
    color: SUBJECT_COLORS[0].value,
    class_taking_it: undefined,
    teachers_taking_it: [],
  });

  // Fetch subject data
  const { data: subjectsData } = useSubjects({});
  const { data: availableData } = useAvailableTeachersClasses();
  const updateSubjectMutation = useUpdateSubject();

  // Find the subject to edit
  const subjectToEdit = subjectsData && "subjects" in subjectsData
    ? subjectsData.subjects.find((s) => s.id === subjectId)
    : null;

  // Load subject data for edit
  useEffect(() => {
    if (subjectToEdit && open) {
      setFormData({
        subject_name: subjectToEdit.name,
        code: subjectToEdit.code,
        description: subjectToEdit.description,
        color: subjectToEdit.color || SUBJECT_COLORS[0].value,
        class_taking_it: subjectToEdit.class?.id,
        teachers_taking_it: subjectToEdit.teachers.map((t) => t.id),
      });
    }
  }, [subjectToEdit, open]);

  const handleUpdateSubject = async () => {
    if (!subjectId) return;
    try {
      const payload: UpdateSubjectRequest = {
        ...(formData.subject_name && { subject_name: formData.subject_name }),
        ...(formData.code && { code: formData.code }),
        ...(formData.description && { description: formData.description }),
        ...(formData.color && { color: formData.color }),
        ...(formData.class_taking_it && formData.class_taking_it !== "all" && {
          class_taking_it: formData.class_taking_it,
        }),
        ...(formData.teachers_taking_it && formData.teachers_taking_it.length > 0 && {
          teachers_taking_it: formData.teachers_taking_it,
        }),
      };
      await updateSubjectMutation.mutateAsync({
        subjectId,
        data: payload,
      });
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const toggleTeacher = (teacherId: string) => {
    setFormData((prev) => ({
      ...prev,
      teachers_taking_it: prev.teachers_taking_it?.includes(teacherId)
        ? prev.teachers_taking_it.filter((id) => id !== teacherId)
        : [...(prev.teachers_taking_it || []), teacherId],
    }));
  };

  if (!subjectId || !subjectToEdit) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>
            Update the subject information below. Teachers will be notified of changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit_subject_name">Subject Name *</Label>
            <Input
              id="edit_subject_name"
              value={formData.subject_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, subject_name: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_code">Subject Code</Label>
              <Input
                id="edit_code"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData({ ...formData, color: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_description">Description</Label>
            <Input
              id="edit_description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          {availableData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="edit_class">Assign to Class</Label>
                <Select
                  value={formData.class_taking_it || "all"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      class_taking_it: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">No class assignment</SelectItem>
                    {availableData.classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign Teachers (Multiple)</Label>
                <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                  {availableData.teachers.length === 0 ? (
                    <p className="text-sm text-gray-500">No teachers available</p>
                  ) : (
                    <div className="space-y-2">
                      {availableData.teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-teacher-${teacher.id}`}
                            checked={formData.teachers_taking_it?.includes(teacher.id)}
                            onCheckedChange={() => toggleTeacher(teacher.id)}
                          />
                          <Label
                            htmlFor={`edit-teacher-${teacher.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {teacher.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateSubject}
            disabled={updateSubjectMutation.isPending || !formData.subject_name}
          >
            {updateSubjectMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Subject"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

