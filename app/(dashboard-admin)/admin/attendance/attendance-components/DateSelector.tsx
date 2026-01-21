"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import type { AcademicSession } from "@/hooks/teacher/use-teacher-data";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  academicSessions: AcademicSession[];
}

export const DateSelector = ({
  selectedDate,
  onDateChange,
  academicSessions,
}: DateSelectorProps) => {
  const currentSession = academicSessions.find((s) => s.is_current);

  // Get date restrictions from current session
  const getDateRestrictions = () => {
    if (currentSession) {
      return {
        min: currentSession.term_start_date,
        max: currentSession.term_end_date,
      };
    }
    // Default to current year if no session
    const currentYear = new Date().getFullYear();
    return {
      min: `${currentYear}-01-01`,
      max: `${currentYear}-12-31`,
    };
  };

  const { min, max } = getDateRestrictions();

  // Format term dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format term name (capitalize first letter)
  const formatTerm = (term: string) => {
    return term.charAt(0).toUpperCase() + term.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Select Date
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="date-select">Date</Label>
          <Input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            min={min}
            max={max}
            className="cursor-pointer"
          />
          {currentSession && (
            <div className="text-sm text-gray-600 mt-3 space-y-1 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="font-medium text-gray-700">
                {currentSession.academic_year} - {formatTerm(currentSession.term)} Term
              </p>
              <p className="text-xs text-gray-500">
                Available dates: {formatDate(currentSession.term_start_date)} to{" "}
                {formatDate(currentSession.term_end_date)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
