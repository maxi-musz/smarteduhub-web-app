"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Plus, Edit3 } from "lucide-react";
import TimetableGrid from "@/components/teacher/schedules/TimetableGrid";
import AddPeriodDialog from "@/components/teacher/schedules/AddPeriodDialog";

// Define a type for a period
type Period = {
  id: string;
  classId: string;
  day: string;
  timeSlot: string;
  subjectId: string;
  teacherId: string;
};

const classes = [
  { id: "jss1", name: "JSS1" },
  { id: "jss2", name: "JSS2" },
  { id: "jss3", name: "JSS3" },
  { id: "ss1", name: "SS1" },
  { id: "ss2", name: "SS2" },
  { id: "ss3", name: "SS3" },
];

const subjects = [
  { id: "math", name: "Mathematics", color: "#3B82F6" },
  { id: "english", name: "English Language", color: "#10B981" },
  { id: "physics", name: "Physics", color: "#8B5CF6" },
  { id: "chemistry", name: "Chemistry", color: "#F59E0B" },
  { id: "biology", name: "Biology", color: "#EF4444" },
  { id: "history", name: "History", color: "#6B7280" },
];

const teachers = [
  { id: "teacher1", name: "Mr. Johnson" },
  { id: "teacher2", name: "Mrs. Smith" },
  { id: "teacher3", name: "Dr. Williams" },
  { id: "teacher4", name: "Ms. Brown" },
];

// Mock timetable data
const mockTimetableData: Period[] = [
  {
    id: "1",
    classId: "jss1",
    day: "Monday",
    timeSlot: "08:00-09:00",
    subjectId: "math",
    teacherId: "teacher1",
  },
  {
    id: "2",
    classId: "jss1",
    day: "Monday",
    timeSlot: "09:00-10:00",
    subjectId: "english",
    teacherId: "teacher2",
  },
  {
    id: "3",
    classId: "jss1",
    day: "Tuesday",
    timeSlot: "08:00-09:00",
    subjectId: "physics",
    teacherId: "teacher3",
  },
];

import { useEffect } from "react";

const AdminSchedulesPage = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  // Set default selected class on mount
  useEffect(() => {
    if (selectedClass === "" && classes.length > 0) {
      setSelectedClass(classes[0].id);
    }
  }, [selectedClass]);

  const handleAddPeriod = (periodData: Period) => {
    console.log("Adding period:", periodData);
    // Here you would make an API call to save the period
    setIsAddDialogOpen(false);
  };

  const handleEditPeriod = (period: Period) => {
    setEditingPeriod(period);
    setIsAddDialogOpen(true);
  };

  const selectedClassData = classes.find((c) => c.id === selectedClass);
  const classSchedule = mockTimetableData.filter(
    (item) => item.classId === selectedClass
  );

  return (
    <div className="min-h-screen py-6 space-y-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-heading">
              Class Schedules
            </h1>
            <p className="text-brand-light-accent-1 mt-1">
              Manage and view class timetables
            </p>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            disabled={!selectedClass}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </Button>
        </div>

        {/* Class Selection as Badges */}
        <div className="flex items-center gap-2 mb-2">
          {classes.map((cls, idx) => (
            <button
              key={cls.id}
              type="button"
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors
          ${
            selectedClass
              ? selectedClass === cls.id
                ? "bg-brand-primary text-white"
                : "border border-brand-border bg-white text-brand-light-accent-1 cursor-pointer"
              : idx === 0
              ? "bg-brand-primary text-white"
              : "border border-brand-border bg-white text-brand-light-accent-1"
          }
              `}
              onClick={() => setSelectedClass(cls.id)}
            >
              {cls.name}
            </button>
          ))}
        </div>
        {selectedClassData && (
          <div className="text-sm text-brand-light-accent-1 my-4">
            Viewing timetable for <strong>{selectedClassData.name}</strong>
          </div>
        )}

        {/* Timetable Grid */}
        {selectedClass && (
          <Card>
            <CardHeader>
              <CardTitle>
                Weekly Timetable - {selectedClassData?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableGrid
                periods={classSchedule}
                subjects={subjects}
                teachers={teachers}
                onEdit={handleEditPeriod}
              />
            </CardContent>
          </Card>
        )}

        {!selectedClass && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-muted-foreground">
                <Edit3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a class to view its timetable</p>
                <p className="text-sm">
                  Choose from the dropdown above to get started
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add/Edit Period Dialog */}
        <AddPeriodDialog
          isOpen={isAddDialogOpen}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingPeriod(null);
          }}
          onSubmit={handleAddPeriod}
          subjects={subjects}
          teachers={teachers}
          editingPeriod={editingPeriod ?? undefined}
          selectedClass={selectedClass}
        />
      </div>
    </div>
  );
};

export default AdminSchedulesPage;
