"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Define types for subject and teacher
interface Subject {
  id: string;
  name: string;
  color: string;
}
interface Teacher {
  id: string;
  name: string;
}
interface PeriodFormData {
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
}
interface Period {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "08:00-09:00",
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
];

interface AddPeriodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Period) => void;
  subjects: Subject[];
  teachers: Teacher[];
  editingPeriod?: Period;
  selectedClass: string;
}

const AddPeriodDialog: React.FC<AddPeriodDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  subjects,
  teachers,
  editingPeriod,
  selectedClass,
}) => {
  const [formData, setFormData] = useState<PeriodFormData>({
    day: "",
    timeSlot: "",
    subjectId: "",
    teacherId: "",
  });

  useEffect(() => {
    if (editingPeriod) {
      setFormData({
        day: editingPeriod.day || "",
        timeSlot: editingPeriod.timeSlot || "",
        subjectId: editingPeriod.subjectId || "",
        teacherId: editingPeriod.teacherId || "",
      });
    } else {
      setFormData({
        day: "",
        timeSlot: "",
        subjectId: "",
        teacherId: "",
      });
    }
  }, [editingPeriod, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      classId: selectedClass,
      id: editingPeriod?.id || Date.now().toString(),
    });
    setFormData({
      day: "",
      timeSlot: "",
      subjectId: "",
      teacherId: "",
    });
  };

  const selectedSubject = subjects.find((s) => s.id === formData.subjectId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingPeriod?.id ? "Edit Period" : "Add New Period"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={formData.day}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, day: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Select
                value={formData.timeSlot}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, timeSlot: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot.replace("-", " - ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={formData.subjectId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, subjectId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      {subject.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSubject && (
              <Badge
                style={{
                  backgroundColor: selectedSubject.color,
                  color: "white",
                }}
                className="mt-1"
              >
                {selectedSubject.name}
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacher">Teacher</Label>
            <Select
              value={formData.teacherId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, teacherId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                !formData.day ||
                !formData.timeSlot ||
                !formData.subjectId ||
                !formData.teacherId
              }
            >
              {editingPeriod?.id ? "Update Period" : "Add Period"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPeriodDialog;
