"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAssessment, type Assessment, type UpdateAssessmentRequest } from "@/hooks/teacher/use-teacher-assessments";

interface EditAssessmentDialogProps {
  assessment: Assessment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditAssessmentDialog = ({
  assessment,
  open,
  onOpenChange,
}: EditAssessmentDialogProps) => {
  const updateMutation = useUpdateAssessment();
  const [formData, setFormData] = useState<UpdateAssessmentRequest>({
    title: assessment.title,
    description: assessment.description || undefined,
    instructions: assessment.instructions || undefined,
    duration: assessment.duration || undefined,
    max_attempts: assessment.max_attempts,
    passing_score: assessment.passing_score,
    total_points: assessment.total_points,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      { id: assessment.id, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Assessment</DialogTitle>
          <DialogDescription>
            Update assessment details. Note: Some fields may not be editable if students have already attempted this assessment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-duration">Duration (minutes)</Label>
              <Input
                id="edit-duration"
                type="number"
                min="1"
                max="300"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value ? Number(e.target.value) : undefined })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-total_points">Total Points</Label>
              <Input
                id="edit-total_points"
                type="number"
                min="1"
                value={formData.total_points}
                onChange={(e) => setFormData({ ...formData, total_points: Number(e.target.value) })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


