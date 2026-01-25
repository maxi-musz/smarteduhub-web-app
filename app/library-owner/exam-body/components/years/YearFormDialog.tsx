"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  useCreateExamBodyYear,
  useUpdateExamBodyYear,
} from "@/hooks/exam-body/use-exam-body-years";
import type { ExamBodyYear } from "@/hooks/exam-body/types";

type Mode = "create" | "edit";

interface YearFormDialogProps {
  open: boolean;
  mode: Mode;
  examBodyId: string;
  year?: ExamBodyYear | null;
  onOpenChange: (open: boolean) => void;
}

const toDateInputValue = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export const YearFormDialog = ({
  open,
  mode,
  examBodyId,
  year,
  onOpenChange,
}: YearFormDialogProps) => {
  const createMutation = useCreateExamBodyYear(examBodyId);
  const updateMutation = useUpdateExamBodyYear(examBodyId);

  const [yearValue, setYearValue] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errors, setErrors] = useState<{ year?: string }>({});

  useEffect(() => {
    if (mode === "edit" && year) {
      setYearValue(year.year);
      setDescription(year.description || "");
      setStartDate(toDateInputValue(year.startDate));
      setEndDate(toDateInputValue(year.endDate));
    }
  }, [mode, year]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const isFormValid = useMemo(() => {
    return yearValue.trim().length > 0;
  }, [yearValue]);

  const resetForm = () => {
    setYearValue("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setErrors({});
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      resetForm();
    }
  };

  const validate = () => {
    const nextErrors: { year?: string } = {};
    if (!yearValue.trim()) {
      nextErrors.year = "Year is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };


  const toIso = (value: string) => {
    if (!value.trim()) return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      year: yearValue.trim(),
      description: description.trim() || undefined,
      startDate: toIso(startDate),
      endDate: toIso(endDate),
    };

    if (mode === "create") {
      await createMutation.mutateAsync(payload);
      handleClose();
      return;
    }

    if (mode === "edit" && year) {
      await updateMutation.mutateAsync({ id: year.id, data: payload });
      handleClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Year" : "Edit Year"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exam-body-year-value">
              Year <span className="text-red-500">*</span>
            </Label>
            <Input
              id="exam-body-year-value"
              value={yearValue}
              onChange={(event) => {
                setYearValue(event.target.value);
                if (errors.year) {
                  setErrors((prev) => ({ ...prev, year: undefined }));
                }
              }}
              placeholder="2024/2025"
              required
              className={errors.year ? "border-red-500" : ""}
            />
            {errors.year && (
              <p className="text-xs text-red-500">{errors.year}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="exam-body-year-description">Description</Label>
            <Textarea
              id="exam-body-year-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="exam-body-year-start">Start Date</Label>
              <Input
                id="exam-body-year-start"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-body-year-end">End Date</Label>
              <Input
                id="exam-body-year-end"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : mode === "create" ? (
                "Create Year"
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
