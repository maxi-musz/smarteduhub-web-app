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
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2 } from "lucide-react";
import {
  useAddTeacher,
  useClassesSubjects,
  type AddTeacherRequest,
} from "@/hooks/teacher/use-teachers-data";

interface AddTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTeacherModal = ({ open, onOpenChange }: AddTeacherModalProps) => {
  const [formData, setFormData] = useState<AddTeacherRequest & { status?: "active" | "inactive" | "suspended" }>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "male",
    status: "active",
    subjectsTeaching: [],
    classesManaging: [],
  });

  const { data: classesSubjectsData } = useClassesSubjects();
  const addTeacherMutation = useAddTeacher();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        gender: "male",
        status: "active",
        subjectsTeaching: [],
        classesManaging: [],
      });
    }
  }, [open]);

  const handleAddTeacher = async () => {
    try {
      await addTeacherMutation.mutateAsync(formData);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Teacher</DialogTitle>
          <DialogDescription>
            Fill in the teacher&apos;s information below. Credentials will be sent to their email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number *</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: "male" | "female" | "other") =>
                  setFormData({ ...formData, gender: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
                            id={`subject-${subject.id}`}
                            checked={formData.subjectsTeaching?.includes(subject.id)}
                            onCheckedChange={() => toggleSubject(subject.id)}
                          />
                          <Label
                            htmlFor={`subject-${subject.id}`}
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
                            id={`class-${classItem.id}`}
                            checked={formData.classesManaging?.includes(classItem.id)}
                            onCheckedChange={() => toggleClass(classItem.id)}
                            disabled={classItem.hasClassTeacher}
                          />
                          <Label
                            htmlFor={`class-${classItem.id}`}
                            className={`text-sm font-normal ${
                              classItem.hasClassTeacher
                                ? "text-gray-400 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            {classItem.name}
                            {classItem.hasClassTeacher && (
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
            onClick={handleAddTeacher}
            disabled={
              addTeacherMutation.isPending ||
              !formData.first_name ||
              !formData.last_name ||
              !formData.email ||
              !formData.phone_number
            }
          >
            {addTeacherMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Teacher"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

