import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  authenticatedApi,
  AuthenticatedApiError,
} from "@/lib/api/authenticated";
import { useToast } from "@/hooks/use-toast";

const BASE = (schoolId: string) => `/library/schools/${schoolId}/results`;

// --- Dashboard types (from RESULT-IMPLEMENTATION.md) ---

export interface AcademicSessionSummary {
  id: string;
  academic_year: string;
  term: string;
  start_date: string;
  end_date: string;
  status: string;
  is_current: boolean;
  _count: { results: number };
}

export interface CurrentSessionSummary {
  id: string;
  academic_year: string;
  term: string;
  status: string;
  is_current: boolean;
}

export interface ClassTeacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface DashboardClass {
  id: string;
  name: string;
  classTeacher: ClassTeacher | null;
  student_count: number;
  subject_count: number;
}

export interface DashboardSubject {
  id: string;
  name: string;
  code: string;
  color: string | null;
  description: string | null;
}

export interface ResultStudent {
  id: string;
  userId: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  displayPicture: string | null;
}

export interface SubjectScore {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  obtained: number | null;
  obtainable: number | null;
  percentage: number | null;
  grade: string | null;
  isAvailable: boolean;
}

export interface ResultRow {
  student: ResultStudent;
  subjectScores: Record<string, SubjectScore>;
  totalObtained: number;
  totalObtainable: number;
  percentage: number;
  grade: string;
  position: number;
  isReleased: boolean;
}

export interface ResultsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ResultsDashboardData {
  academic_sessions: AcademicSessionSummary[];
  current_session: CurrentSessionSummary | null;
  classes: DashboardClass[];
  subjects: DashboardSubject[];
  selected_filters: {
    sessionId: string | null;
    classId: string | null;
    subjectId: string | null;
  };
  total_students_in_class: number;
  results: ResultRow[] | null;
  result_message: string | null;
  pagination: ResultsPagination | null;
}

export interface ResultsDashboardParams {
  schoolId: string;
  session_id?: string | null;
  class_id?: string | null;
  subject_id?: string | null;
  page?: number;
  limit?: number;
}

// --- Release/Unrelease response types ---

export interface SessionInfo {
  id: string;
  academic_year: string;
  term: string;
}

export interface ReleaseSchoolResponse {
  total_students: number;
  processed: number;
  errors: number;
  session: SessionInfo;
}

export interface ReleaseStudentResponse {
  student_id: string;
  session: SessionInfo;
}

export interface ReleaseClassResponse {
  class_id: string;
  total_students: number;
  processed: number;
  errors: number;
  session: SessionInfo;
}

export interface ReleaseStudentsResponse {
  total_requested: number;
  total_found: number;
  processed: number;
  errors: number;
  not_found?: string[];
  session: SessionInfo;
}

export interface UnreleaseSchoolResponse {
  total_updated: number;
  session: SessionInfo;
}

export interface UnreleaseStudentResponse {
  student_id: string;
  session: SessionInfo;
}

export interface UnreleaseStudentsResponse {
  total_requested: number;
  total_updated: number;
  session: SessionInfo;
}

export interface UnreleaseClassResponse {
  class_id: string;
  total_students: number;
  updated: number;
  session: SessionInfo;
}

function handleApiResponse<T>(response: { success?: boolean; data?: T; message?: string; statusCode?: number }): T {
  if (response.success && response.data !== undefined) return response.data as T;
  throw new AuthenticatedApiError(
    response.message ?? "Request failed",
    response.statusCode ?? 400,
    { success: false, message: response.message, statusCode: response.statusCode }
  );
}

// --- Dashboard query ---

export function useResultsDashboard(params: ResultsDashboardParams) {
  const { schoolId, session_id, class_id, subject_id, page = 1, limit = 20 } = params;
  return useQuery({
    queryKey: ["library-school-results-dashboard", schoolId, session_id, class_id, subject_id, page, limit],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (session_id) q.set("session_id", session_id);
      if (class_id) q.set("class_id", class_id);
      if (subject_id) q.set("subject_id", subject_id);
      q.set("page", String(page));
      q.set("limit", String(limit));
      const queryString = q.toString();
      const url = queryString ? `${BASE(schoolId)}/dashboard?${queryString}` : `${BASE(schoolId)}/dashboard?page=${page}&limit=${limit}`;
      const res = await authenticatedApi.get<{ success?: boolean; data?: ResultsDashboardData }>(url);
      return handleApiResponse<ResultsDashboardData>(res as { success?: boolean; data?: ResultsDashboardData });
    },
    enabled: !!schoolId,
  });
}

// --- Release mutations ---

export function useReleaseResultsSchool(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async () => {
      const res = await authenticatedApi.post<ReleaseSchoolResponse>(`${BASE(schoolId)}/release`);
      return handleApiResponse<ReleaseSchoolResponse>(res as { success?: boolean; data?: ReleaseSchoolResponse });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results released", description: data.message ?? `Processed ${data.processed} students` });
    },
    onError: (e) => {
      toast({ title: "Release failed", description: e.message, variant: "destructive" });
    },
  });
}

export function useReleaseResultsStudent(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ studentId, sessionId }: { studentId: string; sessionId?: string | null }) => {
      const q = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
      const res = await authenticatedApi.post<ReleaseStudentResponse>(
        `${BASE(schoolId)}/release/student/${studentId}${q}`
      );
      return handleApiResponse<ReleaseStudentResponse>(res as { success?: boolean; data?: ReleaseStudentResponse });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results released", description: "Results released for student" });
    },
    onError: (e) => {
      toast({ title: "Release failed", description: e.message, variant: "destructive" });
    },
  });
}

export function useReleaseResultsClass(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ classId, sessionId }: { classId: string; sessionId?: string | null }) => {
      const q = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
      const res = await authenticatedApi.post<ReleaseClassResponse>(
        `${BASE(schoolId)}/release/class/${classId}${q}`
      );
      return handleApiResponse<ReleaseClassResponse>(res as { success?: boolean; data?: ReleaseClassResponse });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results released", description: data.message ?? `Processed ${data.processed} students` });
    },
    onError: (e) => {
      toast({ title: "Release failed", description: e.message, variant: "destructive" });
    },
  });
}

export function useReleaseResultsStudents(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ studentIds, sessionId }: { studentIds: string[]; sessionId?: string | null }) => {
      const res = await authenticatedApi.post<ReleaseStudentsResponse>(`${BASE(schoolId)}/release/students`, {
        studentIds,
        ...(sessionId ? { sessionId } : {}),
      });
      return handleApiResponse<ReleaseStudentsResponse>(res as { success?: boolean; data?: ReleaseStudentsResponse });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results released", description: data.message ?? `Processed ${data.processed} students` });
    },
    onError: (e) => {
      toast({ title: "Release failed", description: e.message, variant: "destructive" });
    },
  });
}

// --- Unrelease mutations ---

export function useUnreleaseResultsSchool(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (sessionId?: string | null) => {
      const q = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
      const res = await authenticatedApi.post<UnreleaseSchoolResponse>(`${BASE(schoolId)}/unrelease${q}`);
      return handleApiResponse<UnreleaseSchoolResponse>(res as { success?: boolean; data?: UnreleaseSchoolResponse });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results unreleased", description: data.message ?? `Updated ${data.total_updated} students` });
    },
    onError: (e) => {
      toast({ title: "Unrelease failed", description: e.message, variant: "destructive" });
    },
  });
}

export function useUnreleaseResultsStudent(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ studentId, sessionId }: { studentId: string; sessionId?: string | null }) => {
      const q = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
      const res = await authenticatedApi.post<UnreleaseStudentResponse>(
        `${BASE(schoolId)}/unrelease/student/${studentId}${q}`
      );
      return handleApiResponse<UnreleaseStudentResponse>(res as { success?: boolean; data?: UnreleaseStudentResponse });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results unreleased", description: "Results unreleased for student" });
    },
    onError: (e) => {
      toast({ title: "Unrelease failed", description: e.message, variant: "destructive" });
    },
  });
}

export function useUnreleaseResultsStudents(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ studentIds, sessionId }: { studentIds: string[]; sessionId?: string | null }) => {
      const res = await authenticatedApi.post<UnreleaseStudentsResponse>(`${BASE(schoolId)}/unrelease/students`, {
        studentIds,
        ...(sessionId ? { sessionId } : {}),
      });
      return handleApiResponse<UnreleaseStudentsResponse>(res as { success?: boolean; data?: UnreleaseStudentsResponse });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results unreleased", description: data.message ?? `Updated ${data.total_updated} students` });
    },
    onError: (e) => {
      toast({ title: "Unrelease failed", description: e.message, variant: "destructive" });
    },
  });
}

export function useUnreleaseResultsClass(schoolId: string) {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ classId, sessionId }: { classId: string; sessionId?: string | null }) => {
      const q = sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : "";
      const res = await authenticatedApi.post<UnreleaseClassResponse>(
        `${BASE(schoolId)}/unrelease/class/${classId}${q}`
      );
      return handleApiResponse<UnreleaseClassResponse>(res as { success?: boolean; data?: UnreleaseClassResponse });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["library-school-results-dashboard", schoolId] });
      toast({ title: "Results unreleased", description: data.message ?? `Updated ${data.updated} students` });
    },
    onError: (e) => {
      toast({ title: "Unrelease failed", description: e.message, variant: "destructive" });
    },
  });
}
