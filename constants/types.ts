export type GradeStatus = "all" | "graded" | "pending" | "draft";
export type AssignmentType =
  | "all"
  | "exam"
  | "lab-report"
  | "essay"
  | "book-report"
  | "homework"
  | "quiz";

export interface Grade {
  id: string;
  assignment: string;
  type: string;
  subject: string;
  studentName: string;
  class: string;
  status: string;
  score?: number;
  outOf: number;
  date: string;
}
