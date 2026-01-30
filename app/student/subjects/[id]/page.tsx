"use client";

// Re-export the shared subject detail so students stay in StudentShell at /student/subjects/[id].
// Child components (VideoCard, MaterialCard, etc.) use pathname for basePath, so links stay under /student.
export { default } from "@/app/general-pages/subjects/[id]/page";
