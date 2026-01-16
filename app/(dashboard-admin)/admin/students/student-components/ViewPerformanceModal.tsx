"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { type ApiStudent } from "@/hooks/use-students-data";

interface ViewPerformanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: ApiStudent | null;
}

export const ViewPerformanceModal = ({
  open,
  onOpenChange,
  student,
}: ViewPerformanceModalProps) => {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Student Performance - {student.first_name} {student.last_name}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">CGPA</div>
                <div className="text-2xl font-bold text-blue-700">
                  {student.performance.cgpa.toFixed(2)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Term Average</div>
                <div className="text-2xl font-bold text-green-700">
                  {student.performance.term_average}%
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Class Position</div>
                <div className="text-2xl font-bold text-purple-700">
                  #{student.performance.position}
                </div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-orange-600 font-medium">Attendance Rate</div>
                <div className="text-2xl font-bold text-orange-700">
                  {student.performance.attendance_rate}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 font-medium mb-2">Improvement Rate</div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-bold text-gray-700">
                  {student.performance.improvement_rate > 0 ? "+" : ""}
                  {student.performance.improvement_rate}%
                </div>
                {student.performance.improvement_rate > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {student.performance.improvement_rate > 0
                  ? "Improving"
                  : student.performance.improvement_rate < 0
                  ? "Declining"
                  : "Stable"}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">Student Info</div>
            <div className="text-sm text-blue-700">
              <div>ID: {student.student_id}</div>
              <div>Class: {student.current_class.toUpperCase()}</div>
              <div>
                Status: <span className="capitalize">{student.status}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

