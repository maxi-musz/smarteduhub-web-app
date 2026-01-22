"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AIBook } from "@/hooks/explore/use-ai-books-landing";
import { Accessibility } from "lucide-react";

interface BookCardProps {
  book: AIBook;
  platformName?: string | null;
}

// Helper function to get thumbnail URL
// Backend returns thumbnailS3Key as a full URL string, so prioritize it
function getThumbnailUrl(
  thumbnailUrl: string | null | undefined,
  thumbnailS3Key: string | null
): string | null {
  // Backend returns thumbnailS3Key as a full URL string, so check it first
  if (thumbnailS3Key) {
    // If it's already a full URL, use it directly
    if (thumbnailS3Key.startsWith("http://") || thumbnailS3Key.startsWith("https://")) {
      return thumbnailS3Key;
    }
    // If it's a Cloudinary path without protocol, add it
    if (thumbnailS3Key.includes("cloudinary.com")) {
      return thumbnailS3Key.startsWith("https://") ? thumbnailS3Key : `https://${thumbnailS3Key}`;
    }
    // Otherwise, construct S3 URL
    const s3BaseUrl = "https://smart-edu-staging-bucket.s3.us-east-1.amazonaws.com";
    const cleanKey = thumbnailS3Key.startsWith("/") ? thumbnailS3Key.slice(1) : thumbnailS3Key;
    return `${s3BaseUrl}/${cleanKey}`;
  }
  
  // Fallback to thumbnailUrl if provided
  if (thumbnailUrl) {
    return thumbnailUrl;
  }
  
  return null;
}

export function BookCard({ book, platformName }: BookCardProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Log what we get from backend for debugging
  React.useEffect(() => {
    console.log("[BookCard] Backend data for book:", {
      id: book.id,
      title: book.title,
      thumbnailS3Key: book.thumbnailS3Key,
      thumbnailUrl: book.thumbnailUrl,
      rawBook: book,
    });
  }, [book]);

  // Backend returns thumbnailS3Key as a full URL string, so prioritize it
  const thumbnailUrl = getThumbnailUrl(book.thumbnailUrl, book.thumbnailS3Key);
  const publisher = platformName ?? "AI Books";
  
  // Log the final thumbnail URL we're using
  React.useEffect(() => {
    if (thumbnailUrl) {
      console.log("[BookCard] Final thumbnail URL:", {
        bookId: book.id,
        bookTitle: book.title,
        finalUrl: thumbnailUrl,
      });
    } else {
      console.warn("[BookCard] No thumbnail URL found:", {
        bookId: book.id,
        bookTitle: book.title,
        thumbnailS3Key: book.thumbnailS3Key,
        thumbnailUrl: book.thumbnailUrl,
      });
    }
  }, [book.id, book.title, book.thumbnailS3Key, book.thumbnailUrl, thumbnailUrl]);
  
  // Determine if image should be unoptimized (external URLs)
  const isExternalUrl = thumbnailUrl 
    ? (thumbnailUrl.includes("s3.amazonaws.com") || 
       thumbnailUrl.includes("amazonaws.com") || 
       thumbnailUrl.includes("cloudinary.com") ||
       !thumbnailUrl.startsWith("/"))
    : false;

  // Handle book click - navigate based on user role
  const handleBookClick = () => {
    const userRole = session?.user?.role;
    const isStudent = userRole === "student";
    
    if (isStudent) {
      router.push(`/explore/ai-book/aichat-student/${book.id}`);
    } else {
      router.push(`/explore/ai-book/aichat-non-student/${book.id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-brand-border overflow-hidden hover:shadow-md transition-shadow duration-200 max-w-[140px] cursor-pointer"
      onClick={handleBookClick}
    >
      {/* Book Cover Image */}
      <div className="relative w-full aspect-[200/280] bg-brand-bg">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={book.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={isExternalUrl}
            onError={() => {
              console.error("Image failed to load:", {
                thumbnailUrl,
                thumbnailS3Key: book.thumbnailS3Key,
                thumbnailUrlField: book.thumbnailUrl,
              });
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-primary/5">
            <div className="text-center p-2">
              <div className="text-2xl font-bold text-brand-light-accent-1 mb-1">
                {book.title.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-[10px] text-brand-light-accent-1">No Cover</div>
            </div>
          </div>
        )}

        {/* iBookGPT Badge - Always show since these are AI books */}
        <div className="absolute bottom-1 left-1 bg-orange-500 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold">
          iBookGPT
        </div>

        {/* ACCESSIBLE Badge - Always show */}
        <div className="absolute bottom-1 right-1 bg-brand-heading text-white px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5 shadow-md">
          <Accessibility className="h-2.5 w-2.5" />
          <span>ACCESSIBLE</span>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-2">
        <h3 className="font-semibold text-brand-heading mb-0.5 line-clamp-2 min-h-[2.5rem] text-sm">
          {book.title}
        </h3>
        <p className="text-[10px] text-brand-light-accent-1 line-clamp-1 uppercase">
          {publisher}
        </p>
      </div>
    </div>
  );
}
