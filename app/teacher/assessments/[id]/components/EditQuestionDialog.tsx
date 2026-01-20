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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateQuestion, useUploadQuestionImage, type Question, type UpdateQuestionRequest } from "@/hooks/teacher/use-teacher-assessments";
import { Upload } from "lucide-react";

interface EditQuestionDialogProps {
  assessmentId: string;
  question: Question;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditQuestionDialog = ({
  assessmentId,
  question,
  open,
  onOpenChange,
}: EditQuestionDialogProps) => {
  const updateMutation = useUpdateQuestion();
  const uploadMutation = useUploadQuestionImage();
  const [formData, setFormData] = useState<UpdateQuestionRequest>({
    question_text: question.question_text,
    points: question.points,
    explanation: question.explanation || undefined,
    options: question.options,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (question) {
      setFormData({
        question_text: question.question_text,
        points: question.points,
        explanation: question.explanation || undefined,
        options: question.options,
      });
    }
  }, [question]);

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      const result = await uploadMutation.mutateAsync({
        assessmentId,
        image: imageFile,
      });
      setFormData((prev) => ({
        ...prev,
        image_url: result.image_url,
        image_s3_key: result.image_s3_key,
      }));
      setImageFile(null);
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        assessmentId,
        questionId: question.id,
        data: formData,
        imageFile: imageFile || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Update question details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-question_text">Question Text *</Label>
            <Textarea
              id="edit-question_text"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-points">Points</Label>
              <Input
                id="edit-points"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-image">Update Image (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageUpload}
                  disabled={uploadMutation.isPending}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-explanation">Explanation</Label>
            <Textarea
              id="edit-explanation"
              value={formData.explanation || ""}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={2}
            />
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


