export type ExamBodyStatus = "active" | "inactive" | "archived";

export interface ExamBody {
  id: string;
  name: string;
  fullName: string;
  code: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  status: ExamBodyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExamBodySubjectSummary {
  id: string;
  name: string;
  code: string;
  iconUrl: string | null;
  order: number | null;
  status: "active" | "inactive" | "archived" | string;
}

export interface ExamBodyYearSummary {
  id: string;
  year: string;
  description: string | null;
  order: number | null;
  status: "active" | "inactive" | "archived" | string;
}

export interface ExamBodyDetail extends ExamBody {
  subjects: ExamBodySubjectSummary[];
  years: ExamBodyYearSummary[];
}

export interface ExamBodySubject {
  id: string;
  examBodyId: string;
  name: string;
  code: string;
  description: string | null;
  iconUrl: string | null;
  order: number | null;
  status: "active" | "inactive" | "archived" | string;
  examBody?: {
    id: string;
    name: string;
  };
}

export interface ExamBodyYear {
  id: string;
  examBodyId: string;
  year: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  order: number | null;
  status: "active" | "inactive" | "archived" | string;
  examBody?: {
    id: string;
    name: string;
  };
}

export type ExamBodyAssessmentType = "EXAM";

export interface ExamBodyAssessment {
  id: string;
  examBodyId: string;
  subjectId: string;
  yearId: string;
  title: string;
  description: string | null;
  instructions: string | null;
  duration: number | null;
  totalPoints: number;
  passingScore: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showFeedback: boolean;
  showExplanation: boolean;
  assessmentType: ExamBodyAssessmentType;
  isPublished: boolean;
  examBody?: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
  };
  year?: {
    id: string;
    year: string;
  };
}

export type ExamBodyQuestionType =
  | "MULTIPLE_CHOICE_SINGLE"
  | "MULTIPLE_CHOICE_MULTIPLE"
  | "TRUE_FALSE"
  | "SHORT_ANSWER"
  | "FILL_IN_BLANK"
  | "LONG_ANSWER"
  | "NUMERIC"
  | "DATE";

export interface ExamBodyQuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  order: number;
  isCorrect: boolean;
  imageUrl: string | null;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExamBodyQuestionOptionRequest {
  optionText: string;
  order: number;
  isCorrect: boolean;
}

export interface ExamBodyQuestion {
  id: string;
  assessmentId?: string;
  questionText: string;
  questionType: ExamBodyQuestionType;
  points: number;
  order: number;
  isRequired?: boolean;
  imageUrl?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
  explanation: string | null;
  options?: ExamBodyQuestionOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamBodyCorrectAnswer {
  id: string;
  questionId: string;
  answerText: string | null;
  answerNumber: number | null;
  answerDate: string | null;
  optionIds: string[];
  answerJson: any | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExamBodyQuestionListItem extends ExamBodyQuestion {
  options?: ExamBodyQuestionOption[];
  correctAnswers?: ExamBodyCorrectAnswer[];
}

export interface ExamBodyQuestionsResponse {
  questions: ExamBodyQuestionListItem[];
}

export interface CreateExamBodyRequest {
  name: string;
  fullName: string;
  icon: File;
  description?: string;
  websiteUrl?: string;
  status?: ExamBodyStatus;
}

export interface UpdateExamBodyRequest {
  name?: string;
  fullName?: string;
  icon?: File;
  description?: string;
  websiteUrl?: string;
  status?: ExamBodyStatus;
}

export interface CreateExamBodySubjectRequest {
  name: string;
  code: string;
  icon?: File;
  description?: string;
  order?: number;
}

export interface UpdateExamBodySubjectRequest {
  name?: string;
  code?: string;
  icon?: File;
  description?: string;
  order?: number;
}

export interface CreateExamBodyYearRequest {
  year: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface UpdateExamBodyYearRequest {
  year?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface CreateExamBodyAssessmentRequest {
  title: string;
  description?: string;
  instructions?: string;
  duration?: number;
  passingScore?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showCorrectAnswers?: boolean;
  showFeedback?: boolean;
  showExplanation?: boolean;
  assessmentType?: ExamBodyAssessmentType;
}

export interface UpdateExamBodyAssessmentRequest
  extends Partial<CreateExamBodyAssessmentRequest> {}

export interface CreateExamBodyQuestionRequest {
  questionText: string;
  questionType: ExamBodyQuestionType;
  points: number;
  order?: number;
  explanation?: string;
  imageUrl?: string | null;
  options: ExamBodyQuestionOptionRequest[];
}

export interface UpdateExamBodyQuestionRequest {
  questionText?: string;
  questionType?: ExamBodyQuestionType;
  points?: number;
  order?: number;
  explanation?: string;
  imageUrl?: string | null;
  options?: ExamBodyQuestionOptionRequest[];
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  statusCode?: number;
}
