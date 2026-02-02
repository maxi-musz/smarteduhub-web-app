/**
 * Access Control API Types
 * Based on ACCESS-CONTROL-API.md
 */

export type LibraryResourceType =
  | "ALL"
  | "SUBJECT"
  | "TOPIC"
  | "VIDEO"
  | "MATERIAL"
  | "ASSESSMENT";

export type AccessLevel = "FULL" | "READ_ONLY" | "LIMITED";

// --- Library Access Control (Level 1) ---

export interface GrantSchoolAccessRequest {
  schoolId: string;
  resourceType: LibraryResourceType;
  subjectId?: string;
  topicId?: string;
  videoId?: string;
  materialId?: string;
  assessmentId?: string;
  accessLevel?: AccessLevel;
  expiresAt?: string;
  notes?: string;
}

export interface BulkGrantAccessRequest {
  schoolIds: string[];
  resourceType: LibraryResourceType;
  subjectId?: string;
  topicId?: string;
  videoId?: string;
  materialId?: string;
  assessmentId?: string;
  accessLevel?: AccessLevel;
  expiresAt?: string;
  notes?: string;
}

export interface LibraryAccessGrant {
  id: string;
  platformId: string;
  schoolId: string;
  resourceType: LibraryResourceType;
  subjectId: string | null;
  topicId: string | null;
  videoId: string | null;
  materialId: string | null;
  assessmentId: string | null;
  accessLevel: AccessLevel;
  grantedById: string;
  grantedAt: string;
  expiresAt: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  school?: {
    id: string;
    school_name: string;
    school_email: string;
    status?: string;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
    description?: string;
    thumbnailUrl?: string;
  };
}

/** School access details response; backend may include exclusions when school has subject grants */
export interface SchoolAccessDetailsResponse {
  school: {
    id: string;
    school_name: string;
    school_email: string;
    status: string;
  };
  accessGrants: LibraryAccessGrant[];
  summary: {
    total: number;
    active: number;
    expired: number;
    byResourceType: Record<string, number>;
  };
  /** Exclusions (turn-off list) for this school; backend may include when available */
  exclusions?: ResourceExclusionRef[] | ExcludedResourceRecord[];
}

export interface SchoolsWithAccessResponse {
  items: LibraryAccessGrant[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface UpdateAccessRequest {
  accessLevel?: AccessLevel;
  expiresAt?: string;
  isActive?: boolean;
  notes?: string;
}

/** Resource types that can be excluded/included under a subject grant (not SUBJECT or ALL) */
export type ExcludeIncludeResourceType = "TOPIC" | "VIDEO" | "MATERIAL" | "ASSESSMENT";

/** Request body for Exclude Resource (turn off) and Include Resource (turn on). Same shape for both. */
export interface ExcludeIncludeResourceRequest {
  schoolId: string;
  resourceType: ExcludeIncludeResourceType;
  topicId?: string;
  videoId?: string;
  materialId?: string;
  assessmentId?: string;
}

/** Response from POST /library-access-control/exclude */
export interface ExcludedResourceRecord {
  id: string;
  platformId: string;
  schoolId: string;
  resourceType: ExcludeIncludeResourceType;
  topicId: string | null;
  subjectId: string | null;
  videoId: string | null;
  materialId: string | null;
  assessmentId: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Optional exclusions list (backend may include in Get School Access Details or a dedicated endpoint) */
export interface ResourceExclusionRef {
  resourceType: ExcludeIncludeResourceType;
  topicId?: string | null;
  videoId?: string | null;
  materialId?: string | null;
  assessmentId?: string | null;
}

// --- School Access Control (Level 2) ---

export interface AvailableResource {
  id: string;
  resourceType: LibraryResourceType;
  accessLevel: AccessLevel;
  expiresAt: string | null;
  isActive: boolean;
  platform?: {
    id: string;
    name: string;
    slug: string;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
    description?: string;
    thumbnailUrl?: string;
  };
}

export interface GrantUserAccessRequest {
  libraryResourceAccessId: string;
  userId?: string;
  roleType?: "student" | "teacher" | "school_director" | "school_admin" | "parent" | "ict_staff";
  classId?: string;
  resourceType: LibraryResourceType;
  subjectId?: string;
  topicId?: string;
  videoId?: string;
  materialId?: string;
  assessmentId?: string;
  accessLevel?: AccessLevel;
  expiresAt?: string;
  notes?: string;
}

export interface SchoolAccessGrant {
  id: string;
  schoolId: string;
  libraryResourceAccessId: string;
  userId: string | null;
  roleType: string | null;
  classId: string | null;
  resourceType: LibraryResourceType;
  accessLevel: AccessLevel;
  grantedById: string;
  grantedAt: string;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

// --- Teacher Access Control (Level 3) ---

export interface TeacherAvailableResource {
  id: string;
  resourceType: LibraryResourceType;
  accessLevel: AccessLevel;
  libraryResourceAccess?: {
    subject?: { id: string; name: string; description?: string; thumbnailUrl?: string };
    topic?: { id: string; title: string; description?: string };
    video?: { id: string; title: string };
  };
}

export interface GrantStudentAccessRequest {
  schoolResourceAccessId: string;
  studentId?: string;
  classId?: string;
  resourceType: LibraryResourceType;
  subjectId?: string;
  topicId?: string;
  videoId?: string;
  materialId?: string;
  assessmentId?: string;
  accessLevel?: AccessLevel;
  expiresAt?: string;
  notes?: string;
}
