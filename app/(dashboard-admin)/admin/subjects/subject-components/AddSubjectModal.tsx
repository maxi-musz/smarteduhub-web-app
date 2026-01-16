"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, Loader2 } from "lucide-react";
import {
  useCreateSubject,
  useAvailableTeachersClasses,
  type CreateSubjectRequest,
} from "@/hooks/use-subjects-data";

interface AddSubjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const AddSubjectModal = ({ open, onOpenChange }: AddSubjectModalProps) => {
  const [formData, setFormData] = useState<CreateSubjectRequest>({
    subject_name: "",
    code: "",
    description: "",
    color: SUBJECT_COLORS[0].value,
    class_taking_it: undefined,
    teacher_taking_it: undefined,
  });

  const { data: availableData } = useAvailableTeachersClasses();
  const createSubjectMutation = useCreateSubject();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        subject_name: "",
        code: "",
        description: "",
        color: SUBJECT_COLORS[0].value,
        class_taking_it: undefined,
        teacher_taking_it: undefined,
      });
    }
  }, [open]);

  const handleCreateSubject = async () => {
    try {
      const payload: CreateSubjectRequest = {
        subject_name: formData.subject_name,
        ...(formData.code && { code: formData.code }),
        ...(formData.description && { description: formData.description }),
        ...(formData.color && { color: formData.color }),
        ...(formData.class_taking_it && formData.class_taking_it !== "all" && {
          class_taking_it: formData.class_taking_it,
        }),
        ...(formData.teacher_taking_it && formData.teacher_taking_it !== "all" && {
          teacher_taking_it: formData.teacher_taking_it,
        }),
      };
      await createSubjectMutation.mutateAsync(payload);
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Fill in the subject information below. Teachers will be notified via email when assigned.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="subject_name">Subject Name *</Label>
            <Input
              id="subject_name"
              value={formData.subject_name}
              onChange={(e) =>
                setFormData({ ...formData, subject_name: e.target.value })
              }
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g., MATH101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
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
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Subject description"
            />
          </div>
          {availableData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="class_taking_it">Assign to Class</Label>
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
                    <SelectValue placeholder="Select a class (optional)" />
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
                <Label htmlFor="teacher_taking_it">Assign Teacher</Label>
                <Select
                  value={formData.teacher_taking_it || "all"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      teacher_taking_it: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">No teacher assignment</SelectItem>
                    {availableData.teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateSubject}
            disabled={createSubjectMutation.isPending || !formData.subject_name}
          >
            {createSubjectMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Subject"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

