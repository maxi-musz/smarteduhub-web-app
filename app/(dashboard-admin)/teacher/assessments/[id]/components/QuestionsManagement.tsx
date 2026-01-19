"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileQuestion, Trash2, Edit, X } from "lucide-react";
import { useCreateQuestion, useDeleteQuestion, useDeleteQuestionImage, type QuestionsResponse, type Assessment, type Question } from "@/hooks/use-teacher-assessments";
import { useState } from "react";
import { CreateQuestionDialog } from "./CreateQuestionDialog";
import { EditQuestionDialog } from "./EditQuestionDialog";

interface QuestionsManagementProps {
  assessmentId: string;
  assessment: Assessment;
  questionsData: QuestionsResponse | undefined;
  isLoading: boolean;
}

export const QuestionsManagement = ({
  assessmentId,
  assessment,
  questionsData,
  isLoading,
}: QuestionsManagementProps) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const deleteMutation = useDeleteQuestion();
  const deleteImageMutation = useDeleteQuestionImage();

  const questions = questionsData?.questions || [];
  const canEdit = assessment.status === "DRAFT" || assessment.status === "PUBLISHED";

  const handleDelete = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question? This cannot be undone if students have already answered it.")) {
      deleteMutation.mutate({ assessmentId, questionId });
    }
  };

  const handleDeleteImage = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question image?")) {
      deleteImageMutation.mutate({ assessmentId, questionId });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-gray-500">Loading questions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Questions</h2>
          <p className="text-sm text-gray-600">
            Total: {questionsData?.total_questions || 0} questions, {questionsData?.total_points || 0} points
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        )}
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileQuestion className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">
              Add questions to your assessment to get started
            </p>
            {canEdit && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Question
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question, index) => {
            // Some API responses may use camelCase (imageUrl) instead of snake_case (image_url)
            const imageUrl =
              (question as any).image_url ??
              (question as any).imageUrl ??
              null;

            // Temporary debug log so you can confirm what the backend sends
            if (process.env.NODE_ENV === "development") {
              // eslint-disable-next-line no-console
              console.log("[QuestionsManagement] Question image URL:", {
                id: question.id,
                image_url: (question as any).image_url,
                imageUrl: (question as any).imageUrl,
              });
            }

            return (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        Question {index + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({question.points} points)
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {question.question_type.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 rounded">
                        {question.difficulty_level}
                      </span>
                    </div>
                    <CardTitle className="text-base">{question.question_text}</CardTitle>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditQuestion(question)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {imageUrl && (
                  <div className="space-y-2">
                    <div className="relative w-full max-w-md border rounded-md overflow-hidden bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Question image"
                        className="w-full h-auto max-h-96 object-contain"
                        onError={(e) => {
                          // Fallback if image fails to load
                          console.error("Failed to load question image:", imageUrl);
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    {canEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteImage(question.id)}
                        disabled={deleteImageMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Image
                      </Button>
                    )}
                  </div>
                )}

                {question.options && question.options.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Options:</p>
                    <ul className="space-y-1">
                      {question.options.map((option) => (
                        <li
                          key={option.id}
                          className={`text-sm p-2 rounded ${
                            option.is_correct
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-gray-50 text-gray-800"
                          }`}
                        >
                          {option.option_text}
                          {option.is_correct && (
                            <span className="ml-2 text-xs font-semibold">✓ Correct</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {question.explanation && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-900 mb-1">Explanation:</p>
                    <p className="text-sm text-blue-800">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )})}
        </div>
      )}

      <CreateQuestionDialog
        assessmentId={assessmentId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        nextOrder={(questionsData?.questions.length || 0) + 1}
      />

      {editQuestion && (
        <EditQuestionDialog
          assessmentId={assessmentId}
          question={editQuestion}
          open={!!editQuestion}
          onOpenChange={(open) => !open && setEditQuestion(null)}
        />
      )}
    </>
  );
};

