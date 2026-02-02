/**
 * Types for Library Users API (Management tab).
 * Base path: /library/users (base URL already includes /api/v1).
 */

export type LibraryUserRole =
  | "admin"
  | "manager"
  | "content_creator"
  | "reviewer"
  | "viewer";

export type LibraryUserType =
  | "libraryresourceowner"
  | "librarymanager"
  | "contentcreator"
  | "reviewer"
  | "viewer";

export type LibraryUserStatus = "active" | "inactive" | "suspended";

export type DashboardSortBy =
  | "createdAt"
  | "email"
  | "first_name"
  | "last_name"
  | "role"
  | "status";

export type SortOrder = "asc" | "desc";

export interface LibraryUserCounts {
  uploadedVideos: number;
  uploadedMaterials: number;
  uploadedAssignments: number;
  uploadedLinks: number;
  uploadedGeneralMaterials: number;
  createdAssessments: number;
}

export interface LibraryUserListItem {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: string;
  userType: string;
  permissions: string[];
  permissionLevel: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: LibraryUserCounts;
}

export interface LibraryInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
}

export interface DashboardSummary {
  totalUsers: number;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
}

export interface DashboardContentStats {
  subjects: number;
  topics: number;
  videos: number;
  materials: number;
  assessments: number;
  generalMaterials: number;
}

export interface LibraryUsersDashboardParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: DashboardSortBy;
  sortOrder?: SortOrder;
  role?: LibraryUserRole;
  status?: LibraryUserStatus;
}

export interface LibraryUsersDashboardMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface LibraryUsersDashboardResponse {
  library: LibraryInfo;
  summary: DashboardSummary;
  contentStats: DashboardContentStats;
  schoolsWithAccess: number;
  users: LibraryUserListItem[];
  meta: LibraryUsersDashboardMeta;
}

export interface UploadAnalyticsByType {
  videos: number;
  materials: number;
  assignments: number;
  links: number;
  generalMaterials: number;
  assessments: number;
}

export interface UploadAnalyticsUserCounts {
  uploadedVideos: number;
  uploadedMaterials: number;
  uploadedAssignments: number;
  uploadedLinks: number;
  uploadedGeneralMaterials: number;
  createdAssessments: number;
}

export interface UploadAnalyticsUploader {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  counts: UploadAnalyticsUserCounts;
}

export interface RecentUploadItem {
  resourceType: "video" | "material" | "assignment" | "link" | "general_material" | "assessment";
  resourceId: string;
  title?: string;
  uploadedBy: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  createdAt: string;
}

export interface UploadAnalyticsResponse {
  uploadersCount: number;
  byType: UploadAnalyticsByType;
  uploadsByUser: UploadAnalyticsUploader[];
  recentUploads: RecentUploadItem[];
}

export interface AvailablePermission {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

/** Profile shape returned by GET /library/users/:id (data.profile). */
export interface LibraryUserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: string;
  userType: string;
  permissions: string[];
  permissionLevel: number | null;
  status: string;
  platformId: string;
  createdAt: string;
  updatedAt: string;
  displayPicture: string | null;
}

/** Counts returned by GET /library/users/:id (data.counts). */
export interface LibraryUserDetailCounts {
  uploadedVideos: number;
  uploadedMaterials: number;
  uploadedAssignments: number;
  uploadedLinks: number;
  uploadedGeneralMaterials: number;
  uploadedChapterFiles: number;
  createdAssessments: number;
  comments: number;
  libraryResourceAccessGrants: number;
}

/** Subject ref in upload items. */
export interface SubjectRef {
  id: string;
  name: string;
  code: string | null;
}

/** Topic ref in upload items. */
export interface TopicRef {
  id: string;
  title: string;
  subject?: SubjectRef;
}

export interface LibraryUserDetailVideo {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  sizeBytes: number | null;
  views: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  topic?: TopicRef;
  subject?: SubjectRef;
}

export interface LibraryUserDetailMaterial {
  id: string;
  title: string;
  description: string | null;
  materialType: string;
  url: string;
  sizeBytes: number | null;
  pageCount: number | null;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  topic?: TopicRef;
  subject?: SubjectRef;
}

export interface LibraryUserDetailAssignment {
  id: string;
  title: string;
  description: string | null;
  assignmentType: string;
  instructions: string | null;
  attachmentUrl: string | null;
  dueDate: string | null;
  maxScore: number;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  topic?: TopicRef;
  subject?: SubjectRef;
}

export interface LibraryUserDetailLink {
  id: string;
  title: string;
  description: string | null;
  url: string;
  linkType: string | null;
  thumbnailUrl: string | null;
  domain: string | null;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  topic?: TopicRef;
  subject?: SubjectRef;
}

export interface LibraryUserDetailGeneralMaterial {
  id: string;
  title: string;
  description: string | null;
  author: string | null;
  materialType: string;
  url: string;
  sizeBytes: number | null;
  pageCount: number | null;
  thumbnailUrl: string | null;
  isFree: boolean;
  isAvailable: boolean;
  processingStatus: string;
  createdAt: string;
  updatedAt: string;
  subject: SubjectRef | null;
}

export interface LibraryUserDetailChapterFile {
  id: string;
  fileName: string;
  fileType: string;
  url: string;
  title: string | null;
  order: number;
  createdAt: string;
}

export interface LibraryUserDetailAssessment {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  assessmentType: string;
  gradingType: string;
  status: string;
  duration: number | null;
  timeLimit: number | null;
  maxAttempts: number;
  totalPoints: number;
  passingScore: number;
  createdAt: string;
  updatedAt: string;
  subject: SubjectRef;
  topic: { id: string; title: string } | null;
}

export interface LibraryUserDetailUploads {
  videos: LibraryUserDetailVideo[];
  materials: LibraryUserDetailMaterial[];
  assignments: LibraryUserDetailAssignment[];
  links: LibraryUserDetailLink[];
  generalMaterials: LibraryUserDetailGeneralMaterial[];
  chapterFiles: LibraryUserDetailChapterFile[];
}

/** Full response from GET /library/users/:id (data). */
export interface LibraryUserDetailResponse {
  profile: LibraryUserProfile;
  library: LibraryInfo;
  counts: LibraryUserDetailCounts;
  uploads: LibraryUserDetailUploads;
  createdAssessments: LibraryUserDetailAssessment[];
}

/** @deprecated Use LibraryUserDetailResponse for GET :id. */
export interface LibraryUserDetail extends Omit<LibraryUserListItem, "updatedAt"> {
  updatedAt: string;
}

export interface CreateLibraryUserPayload {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  role?: LibraryUserRole;
  userType?: LibraryUserType;
  permissions?: string[];
  permissionLevel?: number | null;
}

export interface UpdateLibraryUserPayload {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  role?: LibraryUserRole;
  userType?: LibraryUserType;
  permissions?: string[];
  permissionLevel?: number | null;
}

export interface LibraryUserCreated {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: string;
  userType: string;
  permissions: string[];
  permissionLevel: number | null;
  status: string;
  createdAt: string;
}

export interface LibraryUserUpdated extends LibraryUserCreated {
  updatedAt: string;
}
