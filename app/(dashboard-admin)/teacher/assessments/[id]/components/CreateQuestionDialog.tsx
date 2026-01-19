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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateQuestion, useUploadQuestionImage, type CreateQuestionRequest, type QuestionType, type DifficultyLevel } from "@/hooks/use-teacher-assessments";
import { Upload } from "lucide-react";

interface CreateQuestionDialogProps {
  assessmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextOrder: number;
}

export const CreateQuestionDialog = ({
  assessmentId,
  open,
  onOpenChange,
  nextOrder,
}: CreateQuestionDialogProps) => {
  const createMutation = useCreateQuestion();
  const uploadMutation = useUploadQuestionImage();
  const [formData, setFormData] = useState<CreateQuestionRequest>({
    question_text: "",
    question_type: "MULTIPLE_CHOICE_SINGLE",
    order: nextOrder,
    points: 1,
    is_required: true,
    difficulty_level: "MEDIUM",
    options: [],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
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
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { assessmentId, data: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData({
            question_text: "",
            question_type: "MULTIPLE_CHOICE_SINGLE",
            order: nextOrder,
            points: 1,
            is_required: true,
            difficulty_level: "MEDIUM",
            options: [],
          });
          setImageFile(null);
        },
      }
    );
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        {
          option_text: "",
          order: (prev.options?.length || 0) + 1,
          is_correct: false,
        },
      ],
    }));
  };

  const updateOption = (index: number, field: string, value: unknown) => {
    setFormData((prev) => {
      const options = [...(prev.options || [])];
      options[index] = { ...options[index], [field]: value };
      return { ...prev, options };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Create a new question for this assessment
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text *</Label>
            <Textarea
              id="question_text"
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question_type">Question Type *</Label>
              <Select
                value={formData.question_type}
                onValueChange={(value) => setFormData({ ...formData, question_type: value as QuestionType })}
              >
                <SelectTrigger id="question_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MULTIPLE_CHOICE_SINGLE">Multiple Choice (Single)</SelectItem>
                  <SelectItem value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice (Multiple)</SelectItem>
                  <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                  <SelectItem value="LONG_ANSWER">Long Answer</SelectItem>
                  <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty_level">Difficulty</Label>
              <Select
                value={formData.difficulty_level}
                onValueChange={(value) => setFormData({ ...formData, difficulty_level: value as DifficultyLevel })}
              >
                <SelectTrigger id="difficulty_level">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Question Image (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingImage ? "Uploading..." : "Upload"}
                </Button>
              )}
            </div>
            {formData.image_url && (
              <p className="text-sm text-green-600">Image uploaded successfully</p>
            )}
          </div>

          {(formData.question_type === "MULTIPLE_CHOICE_SINGLE" ||
            formData.question_type === "MULTIPLE_CHOICE_MULTIPLE") && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button type="button" variant="outline" size="sm" onClick={addOption}>
                  Add Option
                </Button>
              </div>
              {formData.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option.option_text}
                    onChange={(e) => updateOption(index, "option_text", e.target.value)}
                    placeholder="Option text"
                  />
                  <Button
                    type="button"
                    variant={option.is_correct ? "default" : "outline"}
                    onClick={() => updateOption(index, "is_correct", !option.is_correct)}
                  >
                    {option.is_correct ? "Correct" : "Mark Correct"}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              value={formData.explanation || ""}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending || !formData.question_text}>
              {createMutation.isPending ? "Creating..." : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


