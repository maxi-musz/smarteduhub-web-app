"use client";

/**
 * Constants for Chat Interface
 */

import { BookOpen, FileText, Lightbulb } from "lucide-react";
import type { StudyTool } from "./types";

export const MIN_WIDTH = 350;
export const MAX_WIDTH = 900;
export const DEFAULT_WIDTH = 600;

export const defaultStudyTools: StudyTool[] = [
  {
    id: "chapter-summary",
    label: "Chapter Summary",
    iconColor: "text-blue-500",
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    id: "important-notes",
    label: "Important Notes for Exams",
    iconColor: "text-amber-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "revision-notes",
    label: "Revision Notes",
    iconColor: "text-green-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "common-mistakes",
    label: "Common Mistakes",
    iconColor: "text-red-500",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "study-tricks",
    label: "Study Tricks",
    iconColor: "text-purple-500",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "create-definitions",
    label: "Create Definitions / Concepts",
    iconColor: "text-indigo-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "create-question-paper",
    label: "Create Question Paper",
    iconColor: "text-orange-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "create-questions-answers",
    label: "Create Questions and Answers",
    iconColor: "text-teal-500",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    id: "create-mcqs",
    label: "Create MCQs",
    iconColor: "text-cyan-500",
    icon: <FileText className="h-4 w-4" />,
  },
];
