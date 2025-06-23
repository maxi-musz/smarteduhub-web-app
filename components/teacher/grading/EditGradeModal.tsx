import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Grade {
  id: number;
  title: string;
  type: string;
  subject: string;
  studentName: string;
  studentInitial: string;
  class: string;
  score: string;
  date: string;
  status: string;
}

interface EditGradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grade: Grade | null;
}

export function EditGradeModal({
  open,
  onOpenChange,
  grade,
}: EditGradeModalProps) {
  const [formData, setFormData] = useState({
    score: "",
    maxScore: "100",
    status: "",
    feedback: "",
  });

  useEffect(() => {
    if (grade) {
      const [currentScore] = grade.score.split("/");
      setFormData({
        score: currentScore === "-" ? "" : currentScore,
        maxScore: "100",
        status: grade.status,
        feedback: "",
      });
    }
  }, [grade]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updating grade:", formData);
    // Handle form submission here
    onOpenChange(false);
  };

  if (!grade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Grade</DialogTitle>
        </DialogHeader>

        {/* Assignment and Student Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{grade.title}</h3>
            <Badge variant="outline">{grade.type}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium">
                {grade.studentInitial}
              </span>
            </div>
            <div>
              <p className="font-medium">{grade.studentName}</p>
              <p className="text-sm text-muted-foreground">
                {grade.class} • {grade.subject}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
                placeholder="Enter score"
                min="0"
                max={formData.maxScore}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScore">Max Score</Label>
              <Input
                id="maxScore"
                type="number"
                value={formData.maxScore}
                onChange={(e) =>
                  setFormData({ ...formData, maxScore: e.target.value })
                }
                placeholder="100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Graded">Graded</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              placeholder="Enter feedback for the student..."
              rows={3}
            />
          </div>

          {/* Grade Preview */}
          {formData.score && formData.maxScore && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Final Grade:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formData.score}/{formData.maxScore} (
                  {Math.round(
                    (parseInt(formData.score) / parseInt(formData.maxScore)) *
                      100
                  )}
                  %)
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Grade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
