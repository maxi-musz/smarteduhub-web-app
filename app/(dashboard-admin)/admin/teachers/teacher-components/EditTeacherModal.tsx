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
  useUpdateTeacher,
  useTeacherById,
  useClassesSubjects,
  type UpdateTeacherRequest,
} from "@/hooks/use-teachers-data";

interface EditTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string | null;
}

export const EditTeacherModal = ({
  open,
  onOpenChange,
  teacherId,
}: EditTeacherModalProps) => {
  const [formData, setFormData] = useState<UpdateTeacherRequest & { 
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string;
    status?: "active" | "inactive" | "suspended";
  }>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    status: "active",
    subjectsTeaching: [],
    classesManaging: [],
  });

  const { data: selectedTeacher } = useTeacherById(teacherId);
  const { data: classesSubjectsData } = useClassesSubjects();
  const updateTeacherMutation = useUpdateTeacher();

  // Load teacher data for edit
  useEffect(() => {
    if (selectedTeacher && open) {
      setFormData({
        first_name: selectedTeacher.first_name,
        last_name: selectedTeacher.last_name,
        email: selectedTeacher.email,
        phone_number: selectedTeacher.phone_number,
        status: selectedTeacher.status,
        display_picture: selectedTeacher.display_picture || undefined,
        subjectsTeaching: selectedTeacher.subjectsTeaching.map((s) => s.subject.id),
        classesManaging: selectedTeacher.classesManaging.map((c) => c.id),
      });
    }
  }, [selectedTeacher, open]);

  const handleUpdateTeacher = async () => {
    if (!teacherId) return;
    try {
      const updateData: UpdateTeacherRequest = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        status: formData.status as "active" | "inactive" | "suspended" | undefined,
        display_picture: formData.display_picture,
        subjectsTeaching: formData.subjectsTeaching,
        classesManaging: formData.classesManaging,
      };
      await updateTeacherMutation.mutateAsync({
        teacherId,
        data: updateData,
      });
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const toggleSubject = (subjectId: string) => {
    setFormData((prev) => ({
      ...prev,
      subjectsTeaching: prev.subjectsTeaching?.includes(subjectId)
        ? prev.subjectsTeaching.filter((id) => id !== subjectId)
        : [...(prev.subjectsTeaching || []), subjectId],
    }));
  };

  const toggleClass = (classId: string) => {
    setFormData((prev) => ({
      ...prev,
      classesManaging: prev.classesManaging?.includes(classId)
        ? prev.classesManaging.filter((id) => id !== classId)
        : [...(prev.classesManaging || []), classId],
    }));
  };

  if (!teacherId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Teacher</DialogTitle>
          <DialogDescription>
            Update the teacher&apos;s information below
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_first_name">First Name *</Label>
              <Input
                id="edit_first_name"
                value={formData.first_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_last_name">Last Name *</Label>
              <Input
                id="edit_last_name"
                value={formData.last_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_email">Email *</Label>
            <Input
              id="edit_email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_phone_number">Phone Number *</Label>
            <Input
              id="edit_phone_number"
              value={formData.phone_number || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "suspended") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {classesSubjectsData && (
            <>
              <div className="space-y-2">
                <Label>Assign Subjects</Label>
                <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                  {classesSubjectsData.subjects.length === 0 ? (
                    <p className="text-sm text-gray-500">No subjects available</p>
                  ) : (
                    <div className="space-y-2">
                      {classesSubjectsData.subjects.map((subject) => (
                        <div key={subject.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-subject-${subject.id}`}
                            checked={formData.subjectsTeaching?.includes(subject.id)}
                            onCheckedChange={() => toggleSubject(subject.id)}
                          />
                          <Label
                            htmlFor={`edit-subject-${subject.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {subject.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Assign Classes (Class Teacher)</Label>
                <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                  {classesSubjectsData.classes.length === 0 ? (
                    <p className="text-sm text-gray-500">No classes available</p>
                  ) : (
                    <div className="space-y-2">
                      {classesSubjectsData.classes.map((classItem) => (
                        <div key={classItem.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-class-${classItem.id}`}
                            checked={formData.classesManaging?.includes(classItem.id)}
                            onCheckedChange={() => toggleClass(classItem.id)}
                            disabled={
                              classItem.hasClassTeacher &&
                              !formData.classesManaging?.includes(classItem.id)
                            }
                          />
                          <Label
                            htmlFor={`edit-class-${classItem.id}`}
                            className={`text-sm font-normal ${
                              classItem.hasClassTeacher &&
                              !formData.classesManaging?.includes(classItem.id)
                                ? "text-gray-400 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            {classItem.name}
                            {classItem.hasClassTeacher &&
                              !formData.classesManaging?.includes(classItem.id) && (
                                <span className="ml-2 text-xs text-gray-500">
                                  (Has teacher)
                                </span>
                              )}
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
            onClick={handleUpdateTeacher}
            disabled={
              updateTeacherMutation.isPending ||
              !formData.first_name ||
              !formData.last_name ||
              !formData.email ||
              !formData.phone_number
            }
          >
            {updateTeacherMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Teacher"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

