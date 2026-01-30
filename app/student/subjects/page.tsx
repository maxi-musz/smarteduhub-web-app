"use client";

// Re-export the shared subjects list so students stay in StudentShell at /student/subjects.
// The shared page uses pathname for basePath, so at /student/subjects it will use /student for links.
export { default } from "@/app/general-pages/subjects/page";
