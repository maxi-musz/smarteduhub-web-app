// Type definitions for CBT Assessment System

export type QuestionType =
  | 'MULTIPLE_CHOICE_SINGLE'
  | 'MULTIPLE_CHOICE_MULTIPLE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'LONG_ANSWER'
  | 'FILL_IN_BLANK'
  | 'MATCHING'
  | 'ORDERING'
  | 'FILE_UPLOAD'
  | 'NUMERIC'
  | 'DATE'
  | 'RATING_SCALE';

export type GradingType = 'AUTOMATIC' | 'MANUAL' | 'MIXED';
export type CBTStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';

export interface CBT {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  assessmentType: 'CBT';
  gradingType: GradingType;
  status: CBTStatus;
  duration: number | null;
  timeLimit: number | null;
  startDate: string | null;
  endDate: string | null;
  maxAttempts: number;
  passingScore: number;
  totalPoints: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  showFeedback: boolean;
  studentCanViewGrading: boolean;
  allowReview: boolean;
  autoSubmit: boolean;
  tags: string[];
  order: number;
  isPublished: boolean;
  publishedAt: string | null;
  isResultReleased: boolean;
  resultReleasedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  subject: {
    id: string;
    name: string;
    code: string | null;
  };
  chapter: {
    id: string;
    title: string;
  } | null;
  topic: {
    id: string;
    title: string;
  } | null;
  _count: {
    questions: number;
    attempts: number;
  };
}

export interface QuestionOption {
  id?: string;
  optionText: string;
  order: number;
  isCorrect: boolean;
  imageUrl?: string | null;
  audioUrl?: string | null;
}

export interface CorrectAnswer {
  id?: string;
  answerText?: string | null;
  answerNumber?: number | null;
  answerDate?: string | null;
  optionIds?: string[];
  answerJson?: any | null;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  order: number;
  points: number;
  isRequired: boolean;
  timeLimit: number | null;
  imageUrl: string | null;
  imageS3Key: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
  allowMultipleAttempts: boolean;
  showHint: boolean;
  hintText: string | null;
  minLength: number | null;
  maxLength: number | null;
  minValue: number | null;
  maxValue: number | null;
  explanation: string | null;
  difficultyLevel: DifficultyLevel;
  options: QuestionOption[];
  correctAnswers: CorrectAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCBTRequest {
  title: string;
  subjectId: string;
  description?: string;
  instructions?: string;
  chapterId?: string;
  topicId?: string;
  duration?: number;
  timeLimit?: number;
  startDate?: string;
  endDate?: string;
  maxAttempts?: number;
  passingScore?: number;
  totalPoints?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showCorrectAnswers?: boolean;
  showFeedback?: boolean;
  studentCanViewGrading?: boolean;
  allowReview?: boolean;
  gradingType?: GradingType;
  autoSubmit?: boolean;
  tags?: string[];
  order?: number;
}

export interface UpdateCBTRequest {
  title?: string;
  description?: string;
  instructions?: string;
  duration?: number;
  timeLimit?: number;
  startDate?: string;
  endDate?: string;
  maxAttempts?: number;
  passingScore?: number;
  totalPoints?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showCorrectAnswers?: boolean;
  showFeedback?: boolean;
  studentCanViewGrading?: boolean;
  allowReview?: boolean;
  gradingType?: GradingType;
  autoSubmit?: boolean;
  tags?: string[];
  order?: number;
  status?: CBTStatus;
}

export interface CreateQuestionRequest {
  questionText: string;
  questionType: QuestionType;
  order?: number;
  points?: number;
  isRequired?: boolean;
  timeLimit?: number;
  imageUrl?: string;
  imageS3Key?: string;
  audioUrl?: string;
  videoUrl?: string;
  allowMultipleAttempts?: boolean;
  showHint?: boolean;
  hintText?: string;
  explanation?: string;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  difficultyLevel?: DifficultyLevel;
  options?: QuestionOption[];
  correctAnswers?: CorrectAnswer[];
}

export interface UpdateQuestionRequest {
  questionText?: string;
  questionType?: QuestionType;
  order?: number;
  points?: number;
  isRequired?: boolean;
  timeLimit?: number;
  imageUrl?: string;
  imageS3Key?: string;
  audioUrl?: string;
  videoUrl?: string;
  allowMultipleAttempts?: boolean;
  showHint?: boolean;
  hintText?: string;
  explanation?: string;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  difficultyLevel?: DifficultyLevel;
  options?: QuestionOption[];
  correctAnswers?: CorrectAnswer[];
}

export interface UploadImageResponse {
  imageUrl: string;
  imageS3Key: string;
}

export interface CBTListResponse {
  success: boolean;
  message: string;
  data: CBT[];
  statusCode: number;
}

export interface CBTResponse {
  success: boolean;
  message: string;
  data: CBT;
  statusCode: number;
}

export interface QuestionsResponse {
  success: boolean;
  message: string;
  data: Question[];
  statusCode: number;
}

export interface QuestionResponse {
  success: boolean;
  message: string;
  data: Question;
  statusCode: number;
}

