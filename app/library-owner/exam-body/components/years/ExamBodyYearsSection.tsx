"use client";

import { useMemo, useState } from "react";
import { Plus, Edit, Trash2, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useExamBodyYears } from "@/hooks/exam-body/use-exam-body-years";
import type { ExamBodyYear } from "@/hooks/exam-body/types";
import { YearFormDialog } from "./YearFormDialog";
import { YearDeleteDialog } from "./YearDeleteDialog";

interface ExamBodyYearsSectionProps {
  examBodyId: string;
}

const statusClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "inactive":
      return "bg-yellow-100 text-yellow-700";
    case "archived":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const ExamBodyYearsSection = ({ examBodyId }: ExamBodyYearsSectionProps) => {
  const { data, isLoading } = useExamBodyYears(examBodyId);
  const years = useMemo(() => data || [], [data]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<ExamBodyYear | null>(null);
  const [deletingYear, setDeletingYear] = useState<ExamBodyYear | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-brand-heading">Years</h3>
          <p className="text-sm text-brand-light-accent-1">
            Track exam body year sessions and availability.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Year
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : years.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-brand-light-accent-1">
            No years defined for this exam body yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {years.map((year) => (
            <Card key={year.id} className="border-brand-border">
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-md bg-gray-100 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-brand-heading">{year.year}</p>
                      <Badge className={statusClass(year.status)}>
                        {year.status}
                      </Badge>
                    </div>
                    {year.description && (
                      <p className="text-sm text-brand-light-accent-1 mt-1">
                        {year.description}
                      </p>
                    )}
                    <div className="text-xs text-brand-light-accent-1 mt-2">
                      {formatDate(year.startDate)} - {formatDate(year.endDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingYear(year)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingYear(year)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <YearFormDialog
        open={isCreateOpen}
        mode="create"
        examBodyId={examBodyId}
        onOpenChange={setIsCreateOpen}
      />

      <YearFormDialog
        open={!!editingYear}
        mode="edit"
        examBodyId={examBodyId}
        year={editingYear}
        onOpenChange={(open) => {
          if (!open) setEditingYear(null);
        }}
      />

      <YearDeleteDialog
        open={!!deletingYear}
        examBodyId={examBodyId}
        year={deletingYear}
        onOpenChange={(open) => {
          if (!open) setDeletingYear(null);
        }}
      />
    </div>
  );
};
