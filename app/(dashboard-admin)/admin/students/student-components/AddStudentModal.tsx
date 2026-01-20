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
import { Loader2 } from "lucide-react";
import {
  useEnrollNewStudent,
  useAvailableClasses,
  type EnrollNewStudentRequest,
} from "@/hooks/student/use-students-data";

interface AddStudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddStudentModal = ({ open, onOpenChange }: AddStudentModalProps) => {
  const [formData, setFormData] = useState<EnrollNewStudentRequest>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    gender: "male",
    class_id: "",
  });

  const { data: availableClassesData } = useAvailableClasses();
  const enrollNewStudentMutation = useEnrollNewStudent();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        gender: "male",
        class_id: "",
      });
    }
  }, [open]);

  const handleEnrollStudent = async () => {
    try {
      await enrollNewStudentMutation.mutateAsync(formData);
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll New Student</DialogTitle>
          <DialogDescription>
            Fill in the student&apos;s information below. Credentials will be sent to their email.
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
              <Label htmlFor="class_id">Class *</Label>
              <Select
                value={formData.class_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, class_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClassesData?.classes.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No classes available
                    </SelectItem>
                  ) : (
                    availableClassesData?.classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {classItem.name}
                        {classItem.class_teacher && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({classItem.class_teacher.name})
                          </span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth || ""}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admission_number">Admission Number</Label>
            <Input
              id="admission_number"
              value={formData.admission_number || ""}
              onChange={(e) =>
                setFormData({ ...formData, admission_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardian_name">Guardian Name</Label>
            <Input
              id="guardian_name"
              value={formData.guardian_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, guardian_name: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guardian_phone">Guardian Phone</Label>
              <Input
                id="guardian_phone"
                value={formData.guardian_phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, guardian_phone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guardian_email">Guardian Email</Label>
              <Input
                id="guardian_email"
                type="email"
                value={formData.guardian_email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, guardian_email: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleEnrollStudent}
            disabled={
              enrollNewStudentMutation.isPending ||
              !formData.first_name ||
              !formData.last_name ||
              !formData.email ||
              !formData.phone_number ||
              !formData.class_id
            }
          >
            {enrollNewStudentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enrolling...
              </>
            ) : (
              "Enroll Student"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
