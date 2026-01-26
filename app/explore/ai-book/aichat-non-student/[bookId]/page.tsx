"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Loader2, AlertCircle, BookOpen, ArrowLeft } from "lucide-react";
import { BookDisplay, ChatInterface, type BookChapter, type ChatMessage } from "../../shared/components";
import { TeacherDashboard } from "../../shared/components/TeacherDashboard";
import { useAIBookChapters, useAIBookChapter } from "@/hooks/explore/use-ai-book-chapters";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function AIChatNonStudentBookPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const bookId = params?.bookId as string;

  // Fetch all chapters for the book
  const { data: chaptersData, isLoading: isChaptersLoading, error: chaptersError } = useAIBookChapters(bookId);

  // State
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [showChatUI, setShowChatUI] = useState(false);
  const [showBookView, setShowBookView] = useState(false);
  const [programmaticMessage, setProgrammaticMessage] = useState<{ message: string; displayContent?: string } | null>(null);

  // Fetch selected chapter details (only when a chapter is selected)
  const { data: selectedChapterData, isLoading: isChapterLoading } = useAIBookChapter(
    bookId,
    selectedChapterId
  );

  // Transform chapters from API to BookChapter format
  const chapters: BookChapter[] = useMemo(() => {
    if (!chaptersData) return [];
    const transformed = chaptersData.map((ch) => ({
      id: ch.id,
      title: ch.title,
      order: ch.order,
    }));
    return transformed;
  }, [chaptersData]);

  // Redirect if user is a student
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "student") {
      router.replace(`/explore/ai-book/aichat-student/${bookId}`);
    }
  }, [session, status, router, bookId]);

  // When Book View is clicked, open both book and chat
  const handleBookViewClick = () => {
    if (showBookView) {
      // If already open, close both
      setShowBookView(false);
      setShowChatUI(false);
    } else {
      // Open both book and chat
      setShowBookView(true);
      setShowChatUI(true);
    }
  };

  // Determine PDF URL from selected chapter's files
  const pdfUrl = useMemo(() => {
    if (!selectedChapterData?.files || selectedChapterData.files.length === 0) {
      return null;
    }
    const sortedFiles = [...selectedChapterData.files].sort((a, b) => a.order - b.order);
    return sortedFiles[0].url;
  }, [selectedChapterData]);

  // Calculate pagination
  const currentPage = selectedChapterData?.pageStart || 1;
  const totalPages = selectedChapterData?.pageEnd || selectedChapterData?.pageStart || 1;
  const readingProgress = selectedChapterData?.pageEnd && selectedChapterData?.pageStart
    ? Math.round(((currentPage - selectedChapterData.pageStart + 1) / (selectedChapterData.pageEnd - selectedChapterData.pageStart + 1)) * 100)
    : 0;

  const handleSendMessage = (message: string) => {
    // This is only used when useSocket is false
    // When useSocket is true, ChatInterface handles everything internally via socket
    console.log("Message would be sent (non-socket mode):", message);
  };

  const handleStudyToolClick = (toolId: string) => {
    console.log("Study tool clicked:", toolId);
  };

  const handleToolClick = (backendMessage: string, displayMessage: string) => {
    // Ensure a chapter is selected first
    if (!selectedChapterId) {
      // Show chat UI anyway so user can see they need to select a chapter
      if (!showChatUI) {
        setShowChatUI(true);
      }
      return;
    }
    
    // Ensure chat UI is open
    if (!showChatUI) {
      setShowChatUI(true);
    }
    
    // Trigger programmatic message send via ChatInterface
    setProgrammaticMessage({
      message: backendMessage,
      displayContent: displayMessage,
    });
  };

  const handleProgrammaticMessageSent = () => {
    // Clear the programmatic message after it's been sent
    setProgrammaticMessage(null);
  };

  const handleBack = () => {
    router.push("/explore/ai-book");
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setProgrammaticMessage(null); // Clear any pending programmatic messages
  };

  // Get book title (using default like student page)
  const bookTitle = "AI Book";

  // Loading state
  if (status === "loading" || isChaptersLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-light-accent-1">Loading...</p>
        </div>
      </div>
    );
  }

  // Authentication check
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

  // Error state
  if (chaptersError) {
    let errorMessage = "Failed to load chapters";
    if (chaptersError instanceof AuthenticatedApiError) {
      if (chaptersError.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (chaptersError.statusCode === 404) {
        errorMessage = "Book not found.";
      } else {
        errorMessage = chaptersError.message || errorMessage;
      }
    }

    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{errorMessage}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.push("/explore/ai-book")} variant="outline">
              Back to Books
            </Button>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-brand-border">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="flex-shrink-0 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold text-brand-heading text-lg truncate">
            {bookTitle}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor="ai-tutor-toggle" 
              className={`text-sm font-medium ${
                selectedChapterId 
                  ? "text-brand-heading cursor-pointer" 
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              AI Tutor
            </Label>
            <Switch
              id="ai-tutor-toggle"
              checked={showChatUI}
              onCheckedChange={(checked) => {
                // Only allow toggle if chapter is selected
                if (selectedChapterId) {
                  setShowChatUI(checked);
                }
              }}
              disabled={!selectedChapterId}
            />
          </div>
          <Button
            onClick={handleBookViewClick}
            variant={showBookView ? "outline" : "default"}
            className={showBookView ? "" : "bg-brand-primary text-white hover:bg-brand-primary-hover"}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {showBookView ? "Close Book" : "Book View"}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Book Display (only when showBookView is true) */}
        {showBookView && (
          <BookDisplay
            bookTitle={bookTitle}
            chapters={chapters}
            selectedChapterId={selectedChapterId || undefined}
            onChapterChange={handleChapterChange}
            onBack={handleBack}
            onFullScreen={() => {
              console.log("Full screen");
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            readingProgress={readingProgress}
            showConnectionWarning={false}
            pdfUrl={pdfUrl || undefined}
            chapterPageStart={selectedChapterData?.pageStart || undefined}
            chapterPageEnd={selectedChapterData?.pageEnd || undefined}
          >
            {!selectedChapterId && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center max-w-md">
                  <BookOpen className="h-16 w-16 text-brand-light-accent-1 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-brand-heading mb-2">
                    Select a Chapter
                  </h3>
                  <p className="text-brand-light-accent-1">
                    Please select a chapter from the dropdown above to start reading.
                  </p>
                </div>
              </div>
            )}

            {selectedChapterId && isChapterLoading && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
                  <p className="text-brand-light-accent-1">Loading chapter...</p>
                </div>
              </div>
            )}

            {selectedChapterId && !isChapterLoading && !selectedChapterData && (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center max-w-md">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-2">Failed to load chapter</p>
                  <p className="text-sm text-brand-light-accent-1">
                    Please try selecting another chapter.
                  </p>
                </div>
              </div>
            )}
          </BookDisplay>
        )}

        {/* Center - Dashboard (shown when book view is closed) */}
        {!showBookView && (
          <div className="flex-1 overflow-hidden">
            <TeacherDashboard
              onToolClick={handleToolClick}
              selectedChapterId={selectedChapterId}
              onChapterChange={handleChapterChange}
              chapters={chapters}
              bookTitle={bookTitle}
              chapterTitle={selectedChapterData?.title}
            />
          </div>
        )}

        {/* Right Side - Chat Interface (only when showChatUI is true) */}
        {showChatUI && (
          <ChatInterface
            bookTitle={bookTitle}
            chapterTitle={selectedChapterData?.title}
            onSendMessage={handleSendMessage}
            onStudyToolClick={handleStudyToolClick}
            materialId={selectedChapterId || undefined}
            useSocket={true}
            programmaticMessage={programmaticMessage}
            onProgrammaticMessageSent={handleProgrammaticMessageSent}
          />
        )}
      </div>
    </div>
  );
}
