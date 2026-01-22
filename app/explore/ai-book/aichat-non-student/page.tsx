"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AIChatNonStudentPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const bookId = params?.bookId as string;

  useEffect(() => {
    // Redirect if user is a student
    if (status === "authenticated" && session?.user?.role === "student") {
      // Redirect to student chat page
      router.replace(`/explore/ai-book/aichat-student${bookId ? `/${bookId}` : ""}`);
    }
  }, [session, status, router, bookId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-light-accent-1">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-heading text-lg mb-4">Please login to continue</p>
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const role = session?.user?.role;
  const isStudent = role === "student";

  return (
    <div className="min-h-screen bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-brand-border p-8">
          <h1 className="text-3xl font-bold text-brand-heading mb-4">
            AI Chat - Non-Student View
          </h1>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-purple-800 font-semibold">
                ✅ You are viewing as: <span className="uppercase">{role || "Unknown"}</span>
              </p>
              <p className="text-purple-700 mt-2">
                {!isStudent
                  ? "This is the non-student interface for chatting with AI books."
                  : "You should be redirected to the student view."}
              </p>
            </div>
            {bookId && (
              <div className="p-4 bg-brand-bg rounded-lg">
                <p className="text-brand-light-accent-1">
                  Book ID: <span className="font-mono text-brand-heading">{bookId}</span>
                </p>
              </div>
            )}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                <strong>User Info:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
                <li>Role: {role || "Not set"}</li>
                <li>Email: {session?.user?.email || "Not available"}</li>
                <li>Name: {session?.user?.name || "Not available"}</li>
                <li>User Type: {session?.user?.userType || "Not set"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
