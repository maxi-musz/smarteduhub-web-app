"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";
import { BookDisplay, ChatInterface, type BookChapter, type ChatMessage } from "../../shared/components";
import { useAIBookChapters, useAIBookChapter } from "@/hooks/explore/use-ai-book-chapters";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Button } from "@/components/ui/button";

export default function AIChatStudentBookPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const bookId = params?.bookId as string;

  // Fetch all chapters for the book
  const { data: chaptersData, isLoading: isChaptersLoading, error: chaptersError } = useAIBookChapters(bookId);

  // State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [programmaticMessage, setProgrammaticMessage] = useState<{ message: string; displayContent?: string; imageUrl?: string; imageCaption?: string; metadata?: { page: number; coordinates?: { x: number; y: number; width: number; height: number } } } | null>(null);

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
    console.log("[AIChatStudentBookPage] Transformed chapters:", transformed);
    return transformed;
  }, [chaptersData]);

  // Debug: Log chapters data
  useEffect(() => {
    console.log("[AIChatStudentBookPage] Chapters data:", chaptersData);
    console.log("[AIChatStudentBookPage] Chapters array:", chapters);
  }, [chaptersData, chapters]);

  // Redirect if not a student
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "student") {
      router.replace(`/explore/ai-book/aichat-non-student/${bookId}`);
    }
  }, [session, status, router, bookId]);

  // Determine PDF URL from selected chapter's files
  const pdfUrl = useMemo(() => {
    if (!selectedChapterData?.files || selectedChapterData.files.length === 0) {
      return null;
    }
    // Sort files by order and get the first one
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
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: Replace with actual API call to AI chat endpoint
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I&apos;m here to help you understand this chapter better. This is a placeholder response that will be replaced with actual AI responses.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleStudyToolClick = (toolId: string) => {
    console.log("Study tool clicked:", toolId);
    // TODO: Handle study tool clicks with actual API calls
  };

  const handleBack = () => {
    router.push("/explore/ai-book");
  };

  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    // Clear chat messages when chapter changes
    setChatMessages([]);
  };

  const handleProgrammaticMessageSent = () => {
    // Clear the programmatic message after it's been sent
    setProgrammaticMessage(null);
  };

  const handlePdfSnapshot = (imageDataUrl: string, caption?: string, metadata?: { page: number; coordinates?: { x: number; y: number; width: number; height: number } }) => {
    // Send snapshot to chat with optional caption and metadata
    setProgrammaticMessage({
      message: caption || "Here's a snapshot from the PDF",
      displayContent: caption || "PDF Snapshot",
      imageUrl: imageDataUrl,
      imageCaption: caption || "PDF Snapshot",
      metadata: metadata, // Include metadata for backend processing
    });
  };

  // Loading state
  if (status === "loading" || isChaptersLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
          <p className="text-brand-light-accent-1">Loading chapters...</p>
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

  // No chapters available
  if (!chaptersData || chaptersData.length === 0) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="text-center max-w-md">
          <BookOpen className="h-12 w-12 text-brand-light-accent-1 mx-auto mb-4" />
          <p className="text-brand-heading text-lg mb-2">No Chapters Available</p>
          <p className="text-brand-light-accent-1 mb-4">
            This book doesn&apos;t have any chapters available yet.
          </p>
          <Button onClick={() => router.push("/explore/ai-book")} variant="outline">
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  // Get book title from first chapter or use a default
  const bookTitle = chaptersData[0]?.title ? "AI Book" : "AI Book";

  return (
    <div className="h-screen flex overflow-hidden bg-white relative">
      {/* Left Side - Book Display */}
      <BookDisplay
        bookTitle={bookTitle}
        chapters={chapters}
        selectedChapterId={selectedChapterId || undefined}
        onChapterChange={handleChapterChange}
        onBack={handleBack}
        onFullScreen={() => {
          // TODO: Implement full screen mode
          console.log("Full screen");
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        readingProgress={readingProgress}
        showConnectionWarning={false}
        pdfUrl={pdfUrl || undefined}
        chapterPageStart={selectedChapterData?.pageStart || undefined}
        chapterPageEnd={selectedChapterData?.pageEnd || undefined}
        onSnapshot={handlePdfSnapshot}
      >
        {/* Show message when no chapter is selected */}
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

        {/* Show loading when chapter is being loaded */}
        {selectedChapterId && isChapterLoading && (
          <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
              <p className="text-brand-light-accent-1">Loading chapter...</p>
            </div>
          </div>
        )}

        {/* Show error if chapter failed to load */}
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

      {/* Right Side - Chat Interface */}
      <ChatInterface
        bookTitle={bookTitle}
        chapterTitle={selectedChapterData?.title}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStudyToolClick={handleStudyToolClick}
        materialId={selectedChapterId || undefined}
        useSocket={true}
        programmaticMessage={programmaticMessage}
        onProgrammaticMessageSent={handleProgrammaticMessageSent}
        // initialMessage will be auto-translated based on user's language preference
      />
    </div>
  );
}
