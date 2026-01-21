/**
 * Role-based permissions utility
 * Determines what actions each role can perform
 */

export type UserRole = "teacher" | "school_director" | "student" | "libraryresourceowner";

/**
 * Check if a role can edit subjects/topics
 */
export function canEditSubjects(role?: UserRole | string): boolean {
  return role === "teacher" || role === "school_director";
}

/**
 * Check if a role can delete subjects/topics
 */
export function canDeleteSubjects(role?: UserRole | string): boolean {
  return role === "teacher" || role === "school_director";
}

/**
 * Check if a role can create topics
 */
export function canCreateTopics(role?: UserRole | string): boolean {
  return role === "teacher" || role === "school_director";
}

/**
 * Check if a role can upload videos/materials
 */
export function canUploadContent(role?: UserRole | string): boolean {
  return role === "teacher" || role === "school_director";
}

/**
 * Check if a role can view subjects (all roles can view)
 */
export function canViewSubjects(role?: UserRole | string): boolean {
  return role === "teacher" || role === "school_director" || role === "student";
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role?: UserRole | string) {
  return {
    canEdit: canEditSubjects(role),
    canDelete: canDeleteSubjects(role),
    canCreate: canCreateTopics(role),
    canUpload: canUploadContent(role),
    canView: canViewSubjects(role),
  };
}

