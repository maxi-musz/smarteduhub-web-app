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
import { Pencil } from "lucide-react";
import { useTeacherById } from "@/hooks/use-teachers-data";

interface ViewTeacherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacherId: string | null;
  onEdit: (teacherId: string) => void;
}

export const ViewTeacherModal = ({
  open,
  onOpenChange,
  teacherId,
  onEdit,
}: ViewTeacherModalProps) => {
  const { data: selectedTeacher } = useTeacherById(teacherId);

  if (!teacherId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
          <DialogDescription>
            View complete information about this teacher
          </DialogDescription>
        </DialogHeader>
        {selectedTeacher && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500">First Name</Label>
                <p className="font-medium">{selectedTeacher.first_name}</p>
              </div>
              <div>
                <Label className="text-gray-500">Last Name</Label>
                <p className="font-medium">{selectedTeacher.last_name}</p>
              </div>
            </div>
            <div>
              <Label className="text-gray-500">Email</Label>
              <p className="font-medium">{selectedTeacher.email}</p>
            </div>
            <div>
              <Label className="text-gray-500">Phone Number</Label>
              <p className="font-medium">{selectedTeacher.phone_number}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500">Gender</Label>
                <p className="font-medium capitalize">{selectedTeacher.gender}</p>
              </div>
              <div>
                <Label className="text-gray-500">Status</Label>
                <Badge
                  variant={
                    selectedTeacher.status === "active"
                      ? "secondary"
                      : selectedTeacher.status === "suspended"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {selectedTeacher.status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-gray-500">Subjects Teaching</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTeacher.subjectsTeaching.length > 0 ? (
                  selectedTeacher.subjectsTeaching.map((item) => (
                    <Badge key={item.id} variant="outline">
                      {item.subject.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No subjects assigned</p>
                )}
              </div>
            </div>
            <div>
              <Label className="text-gray-500">Classes Managing</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTeacher.classesManaging.length > 0 ? (
                  selectedTeacher.classesManaging.map((classItem) => (
                    <Badge key={classItem.id} variant="outline">
                      {classItem.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No classes assigned</p>
                )}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {teacherId && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onEdit(teacherId);
              }}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Teacher
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

