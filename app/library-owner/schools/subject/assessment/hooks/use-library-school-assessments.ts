import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { useToast } from "@/hooks/use-toast";

const BASE = (schoolId: string) => `/library/schools/${schoolId}/assessments`;

// Minimal types matching API (aligned with teacher assessment types)
export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ACTIVE" | "CLOSED" | "ARCHIVED";
export type AssessmentType = "CBT" | "EXAM" | "QUIZ" | string;
export type GradingType = "AUTOMATIC" | "MANUAL" | "MIXED";

export interface LibrarySchoolAssessment {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  subject_id: string;
  topic_id: string | null;
  duration: number | null;
  max_attempts: number;
  passing_score: number;
  total_points: number;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  show_correct_answers: boolean;
  show_feedback: boolean;
  allow_review: boolean;
  start_date: string | null;
  end_date: string | null;
  time_limit: number | null;
  grading_type: GradingType;
  auto_submit: boolean;
  tags: string[];
  assessment_type: AssessmentType;
  status: AssessmentStatus;
  school_id: string;
  created_at: string;
  updated_at: string;
  subject?: { id: string; name: string; code: string | null };
  topic?: { id: string; title: string };
  _count?: { questions: number; attempts: number };
}

export interface AssessmentPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ListAssessmentsParams {
  schoolId: string;
  subject_id: string;
  status?: AssessmentStatus;
  topic_id?: string;
  assessment_type?: string;
  page?: number;
  limit?: number;
}

// Backend response: when assessment_type provided → data.assessments is array;
// when not provided → data.assessments is Record<string, AssessmentItem[]>
interface ListApiResponse {
  success?: boolean;
  data?: {
    assessments?: LibrarySchoolAssessment[] | Record<string, LibrarySchoolAssessment[]>;
    pagination?: { page?: number; limit?: number; total?: number; totalPages?: number };
    counts?: Record<string, number>;
    total?: number;
  };
}

function extractAssessmentsFromResponse(raw: ListApiResponse): LibrarySchoolAssessment[] {
  const d = raw.data;
  if (!d || typeof d !== "object") return [];
  const a = d.assessments;
  if (!a) return [];
  if (Array.isArray(a)) return a;
  // Record<string, AssessmentItem[]> — flatten grouped assessments
  return Object.values(a).flatMap((arr) => (Array.isArray(arr) ? arr : []));
}

function extractTotalFromResponse(raw: ListApiResponse, fallback: number): number {
  const d = raw.data;
  if (!d || typeof d !== "object") return fallback;
  if (typeof d.total === "number") return d.total;
  if (d.pagination && typeof d.pagination.total === "number") return d.pagination.total;
  return fallback;
}

export interface CreateAssessmentPayload {
  title: string;
  subject_id: string;
  topic_id?: string;
  description?: string;
  instructions?: string;
  duration?: number;
  max_attempts?: number;
  passing_score?: number;
  total_points?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  show_correct_answers?: boolean;
  show_feedback?: boolean;
  allow_review?: boolean;
  start_date?: string;
  end_date?: string;
  time_limit?: number;
  grading_type?: GradingType;
  auto_submit?: boolean;
  tags?: string[];
  assessment_type?: string;
}

export interface UpdateAssessmentPayload {
  title?: string;
  description?: string;
  instructions?: string;
  subject_id?: string;
  topic_id?: string;
  duration?: number;
  max_attempts?: number;
  passing_score?: number;
  total_points?: number;
  shuffle_questions?: boolean;
  shuffle_options?: boolean;
  show_correct_answers?: boolean;
  show_feedback?: boolean;
  allow_review?: boolean;
  start_date?: string;
  end_date?: string;
  time_limit?: number;
  grading_type?: GradingType;
  auto_submit?: boolean;
  tags?: string[];
  assessment_type?: string;
  status?: AssessmentStatus;
}

function handleApiResponse<T>(response: { success?: boolean; data?: T; message?: string; statusCode?: number }): T {
  if (response.success && response.data !== undefined) return response.data as T;
  throw new AuthenticatedApiError(
    response.message ?? "Request failed",
    response.statusCode ?? 400,
    { success: false, message: response.message, statusCode: response.statusCode }
  );
}

export function useLibrarySchoolAssessments(params: ListAssessmentsParams) {
  const { schoolId, subject_id, status, topic_id, assessment_type, page = 1, limit = 10 } = params;
  return useQuery({
    queryKey: ["library-school-assessments", schoolId, subject_id, status, topic_id, assessment_type, page, limit],
    queryFn: async () => {
      const q = new URLSearchParams({ subject_id });
      if (status) q.set("status", status);
      if (topic_id) q.set("topic_id", topic_id);
      if (assessment_type) q.set("assessment_type", assessment_type);
      q.set("page", String(page));
      q.set("limit", String(limit));
      const res = await authenticatedApi.get<ListApiResponse>(`${BASE(schoolId)}?${q.toString()}`);
      const raw = res as ListApiResponse;
      if (!raw.success) throw new AuthenticatedApiError((raw as { message?: string }).message ?? "Failed to fetch", 400, res);
      const arr = extractAssessmentsFromResponse(raw);
      const total = extractTotalFromResponse(raw, arr.length);
      const totalPages = Math.max(1, Math.ceil(total / limit));
      return {
        assessments: arr,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      };
    },
    enabled: !!schoolId && !!subject_id,
  });
}

export function useLibrarySchoolAssessmentById(schoolId: string | null, assessmentId: string | null) {
  return useQuery({
    queryKey: ["library-school-assessments", schoolId, assessmentId],
    queryFn: async () => {
      if (!schoolId || !assessmentId) throw new AuthenticatedApiError("schoolId and assessmentId required", 400);
      const res = await authenticatedApi.get<LibrarySchoolAssessment>(`${BASE(schoolId)}/${assessmentId}`);
      return handleApiResponse<LibrarySchoolAssessment>(res as { success?: boolean; data?: LibrarySchoolAssessment });
    },
    enabled: !!schoolId && !!assessmentId,
  });
}

/** Consolidated response from GET .../assessments/:id (assessment + questions + attempts in one call) */
export interface LibrarySchoolAssessmentWithDetailsResponse {
  assessment: LibrarySchoolAssessment;
  questions: LibrarySchoolQuestion[] | { questions: LibrarySchoolQuestion[]; total_questions?: number; total_points?: number };
  attempts?: {
    statistics?: { attempted_count?: number; studentsAttempted?: number; totalAttempts?: number };
    students?: unknown[];
    data?: unknown[];
  };
}

export interface LibrarySchoolAssessmentWithDetails {
  assessment: LibrarySchoolAssessment;
  questionsData: { questions: LibrarySchoolQuestion[]; total_questions: number; total_points: number };
  attemptsData: { data: unknown[]; statistics?: { attempted_count?: number } };
}

/** Single call to GET .../assessments/:id; returns assessment, questions, and attempts. Use this on the assessment detail page instead of three separate hooks. */
export function useLibrarySchoolAssessmentWithDetails(schoolId: string | null, assessmentId: string | null) {
  return useQuery({
    queryKey: ["library-school-assessments", schoolId, assessmentId, "details"],
    queryFn: async (): Promise<LibrarySchoolAssessmentWithDetails> => {
      if (!schoolId || !assessmentId) throw new AuthenticatedApiError("schoolId and assessmentId required", 400);
      const res = await authenticatedApi.get<{ success?: boolean; data?: LibrarySchoolAssessmentWithDetailsResponse }>(
        `${BASE(schoolId)}/${assessmentId}`
      );
      const raw = handleApiResponse<LibrarySchoolAssessmentWithDetailsResponse>(
        res as { success?: boolean; data?: LibrarySchoolAssessmentWithDetailsResponse }
      );
      const assessment = raw.assessment;
      const questionsRaw = raw.questions ?? (assessment as { questions?: LibrarySchoolQuestion[] })?.questions;
      const questionsArray = Array.isArray(questionsRaw)
        ? questionsRaw
        : Array.isArray((questionsRaw as { questions?: LibrarySchoolQuestion[] })?.questions)
          ? (questionsRaw as { questions: LibrarySchoolQuestion[] }).questions
          : [];
      const totalQuestions = Array.isArray(questionsRaw)
        ? questionsRaw.length
        : (questionsRaw as { total_questions?: number })?.total_questions ?? questionsArray.length;
      const totalPoints = Array.isArray(questionsRaw)
        ? questionsArray.reduce((s, q) => s + (q.points ?? 0), 0)
        : (questionsRaw as { total_points?: number })?.total_points ?? questionsArray.reduce((s, q) => s + (q.points ?? 0), 0);
      const attempts = raw.attempts;
      const attemptedCount =
        attempts?.statistics?.attempted_count ??
        attempts?.statistics?.studentsAttempted ??
        attempts?.statistics?.totalAttempts ??
        0;
      const attemptsList = Array.isArray(attempts?.data) ? attempts.data : Array.isArray(attempts?.students) ? attempts.students : [];

      return {
        assessment,
        questionsData: {
          questions: questionsArray,
          total_questions: totalQuestions,
          total_points: totalPoints,
        },
        attemptsData: {
          data: attemptsList,
          statistics: { attempted_count: attemptedCount },
        },
      };
    },
    enabled: !!schoolId && !!assessmentId,
  });
}

export function useCreateLibrarySchoolAssessment(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: CreateAssessmentPayload) => {
      const res = await authenticatedApi.post<LibrarySchoolAssessment>(BASE(schoolId), payload);
      return handleApiResponse<LibrarySchoolAssessment>(res as { success?: boolean; data?: LibrarySchoolAssessment });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId] });
      toast({ title: "Assessment created", description: data.title });
    },
    onError: (e) => {
      toast({ title: "Failed to create assessment", description: e.message, variant: "destructive" });
    },
  });
}

export function useUpdateLibrarySchoolAssessment(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAssessmentPayload }) => {
      const res = await authenticatedApi.patch<LibrarySchoolAssessment>(`${BASE(schoolId)}/${id}`, data);
      return handleApiResponse<LibrarySchoolAssessment>(res as { success?: boolean; data?: LibrarySchoolAssessment });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, data.id] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, data.id, "details"] });
      toast({ title: "Assessment updated", description: data.title });
    },
    onError: (e) => {
      toast({ title: "Failed to update assessment", description: e.message, variant: "destructive" });
    },
  });
}

export function useDeleteLibrarySchoolAssessment(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedApi.delete(`${BASE(schoolId)}/${id}`);
      if ((res as { success?: boolean }).success) return;
      throw new AuthenticatedApiError("Delete failed", 400, res);
    },
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId] });
      qc.removeQueries({ queryKey: ["library-school-assessments", schoolId, id] });
      qc.removeQueries({ queryKey: ["library-school-assessments", schoolId, id, "details"] });
      toast({ title: "Assessment deleted" });
    },
    onError: (e) => {
      toast({ title: "Failed to delete assessment", description: e.message, variant: "destructive" });
    },
  });
}

export function usePublishLibrarySchoolAssessment(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedApi.post<LibrarySchoolAssessment>(`${BASE(schoolId)}/${id}/publish`);
      return handleApiResponse<LibrarySchoolAssessment>(res as { success?: boolean; data?: LibrarySchoolAssessment });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, data.id] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, data.id, "details"] });
      toast({ title: "Assessment published", description: "Students can now access it" });
    },
    onError: (e) => {
      toast({ title: "Failed to publish", description: e.message, variant: "destructive" });
    },
  });
}

export function useUnpublishLibrarySchoolAssessment(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await authenticatedApi.post<LibrarySchoolAssessment>(`${BASE(schoolId)}/${id}/unpublish`);
      return handleApiResponse<LibrarySchoolAssessment>(res as { success?: boolean; data?: LibrarySchoolAssessment });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, data.id] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, data.id, "details"] });
      toast({ title: "Assessment unpublished" });
    },
    onError: (e) => {
      toast({ title: "Failed to unpublish", description: e.message, variant: "destructive" });
    },
  });
}

// Questions (simplified types for library)
export interface LibrarySchoolQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  question_type: string;
  order: number;
  points: number;
  options?: Array<{ id?: string; option_text: string; order: number; is_correct: boolean }>;
  correct_answers?: Array<{ id?: string; answer_text?: string; option_ids?: string[] }>;
}

export type LibrarySchoolQuestionType = "MULTIPLE_CHOICE_SINGLE" | "MULTIPLE_CHOICE_MULTIPLE" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface CreateQuestionOption {
  option_text: string;
  order: number;
  is_correct: boolean;
}

export interface CreateQuestionPayload {
  question_text: string;
  question_type: string;
  order?: number;
  points?: number;
  is_required?: boolean;
  options?: CreateQuestionOption[];
}

export interface QuestionsListResponse {
  questions: LibrarySchoolQuestion[];
  total_questions?: number;
  total_points?: number;
}

export function useCreateLibrarySchoolQuestion(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({
      assessmentId,
      data,
    }: {
      assessmentId: string;
      data: CreateQuestionPayload;
    }) => {
      const res = await authenticatedApi.post<LibrarySchoolQuestion>(
        `${BASE(schoolId)}/${assessmentId}/questions`,
        data
      );
      return handleApiResponse<LibrarySchoolQuestion>(res as { success?: boolean; data?: LibrarySchoolQuestion });
    },
    onSuccess: (_, { assessmentId }) => {
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, assessmentId, "questions"] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId, assessmentId, "details"] });
      qc.invalidateQueries({ queryKey: ["library-school-assessments", schoolId] });
      toast({ title: "Question added" });
    },
    onError: (e) => {
      toast({ title: "Failed to add question", description: e.message, variant: "destructive" });
    },
  });
}

export function useLibrarySchoolAssessmentQuestions(schoolId: string | null, assessmentId: string | null) {
  return useQuery({
    queryKey: ["library-school-assessments", schoolId, assessmentId, "questions"],
    queryFn: async () => {
      if (!schoolId || !assessmentId) throw new AuthenticatedApiError("IDs required", 400);
      const res = await authenticatedApi.get<LibrarySchoolQuestion[] | QuestionsListResponse>(`${BASE(schoolId)}/${assessmentId}/questions`);
      const data = handleApiResponse<LibrarySchoolQuestion[] | QuestionsListResponse>(res as { success?: boolean; data?: LibrarySchoolQuestion[] | QuestionsListResponse });
      if (Array.isArray(data)) {
        const questions = data as LibrarySchoolQuestion[];
        return {
          questions,
          total_questions: questions.length,
          total_points: questions.reduce((s, q) => s + (q.points ?? 0), 0),
        };
      }
      const obj = data as QuestionsListResponse;
      return {
        questions: Array.isArray(obj.questions) ? obj.questions : [],
        total_questions: obj.total_questions ?? 0,
        total_points: obj.total_points ?? 0,
      };
    },
    enabled: !!schoolId && !!assessmentId,
  });
}

// Attempts (simplified)
export interface AttemptsListResponse {
  data?: unknown[];
  statistics?: { attempted_count?: number };
}

export function useLibrarySchoolAssessmentAttempts(schoolId: string | null, assessmentId: string | null) {
  return useQuery({
    queryKey: ["library-school-assessments", schoolId, assessmentId, "attempts"],
    queryFn: async () => {
      if (!schoolId || !assessmentId) throw new AuthenticatedApiError("IDs required", 400);
      const res = await authenticatedApi.get<AttemptsListResponse>(`${BASE(schoolId)}/${assessmentId}/attempts`);
      return handleApiResponse<AttemptsListResponse>(res as { success?: boolean; data?: AttemptsListResponse });
    },
    enabled: !!schoolId && !!assessmentId,
  });
}
