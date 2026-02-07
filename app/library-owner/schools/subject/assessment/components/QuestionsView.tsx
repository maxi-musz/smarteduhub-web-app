"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";
import type { LibrarySchoolQuestion } from "../hooks/use-library-school-assessments";

interface QuestionsViewProps {
  questions: LibrarySchoolQuestion[];
  isLoading: boolean;
}

export function QuestionsView({ questions, isLoading }: QuestionsViewProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-brand-light-accent-1">Loading questions...</CardContent>
      </Card>
    );
  }

  if (!questions.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileQuestion className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-brand-light-accent-1">No questions yet. Add questions to this assessment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((q, i) => (
        <Card key={q.id}>
          <CardContent className="pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-light-accent-1 mb-1">Question {i + 1} · {q.question_type} · {q.points} pts</p>
                <p className="text-sm font-medium text-brand-heading">{q.question_text}</p>
                {q.options?.length ? (
                  <ul className="mt-2 space-y-1 text-sm text-brand-light-accent-1">
                    {q.options.map((opt, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span>{String.fromCharCode(65 + j)}.</span>
                        <span>{opt.option_text}</span>
                        {opt.is_correct && <span className="text-green-600 text-xs">(correct)</span>}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
