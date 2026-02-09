"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  AcademicSessionSummary,
  CurrentSessionSummary,
  DashboardClass,
  DashboardSubject,
} from "../hooks/use-library-school-results";

interface ResultsDashboardFiltersProps {
  sessions: AcademicSessionSummary[];
  currentSession: CurrentSessionSummary | null;
  classes: DashboardClass[];
  subjects: DashboardSubject[];
  selectedSessionId: string | null;
  selectedClassId: string | null;
  selectedSubjectId: string | null;
  onSessionChange: (value: string | null) => void;
  onClassChange: (value: string | null) => void;
  onSubjectChange: (value: string | null) => void;
}

export function ResultsDashboardFilters({
  sessions,
  currentSession,
  classes,
  subjects,
  selectedSessionId,
  selectedClassId,
  selectedSubjectId,
  onSessionChange,
  onClassChange,
  onSubjectChange,
}: ResultsDashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-light-accent-1 whitespace-nowrap">Session</span>
        <Select
          value={selectedSessionId ?? "current"}
          onValueChange={(v) => onSessionChange(v === "current" ? null : v)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">
              {currentSession
                ? `${currentSession.academic_year} – ${currentSession.term} (current)`
                : "Current session"}
            </SelectItem>
            {sessions.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.academic_year} – {s.term}
                {s.is_current ? " (current)" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-light-accent-1 whitespace-nowrap">Class</span>
        <Select
          value={selectedClassId ?? "all"}
          onValueChange={(v) => onClassChange(v === "all" ? null : v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({c.student_count} students)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-brand-light-accent-1 whitespace-nowrap">Subject</span>
        <Select
          value={selectedSubjectId ?? "all"}
          onValueChange={(v) => onSubjectChange(v === "all" ? null : v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
