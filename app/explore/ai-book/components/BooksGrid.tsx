"use client";

import { BookCard } from "./BookCard";
import type { AIBook, AIPlatform } from "@/hooks/explore/use-ai-books-landing";

interface BooksGridProps {
  books: AIBook[];
  totalItems: number;
  platform?: AIPlatform | null;
}

export function BooksGrid({ books, totalItems, platform }: BooksGridProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-heading mb-6">
        Books {totalItems >= 0 ? `(${totalItems})` : ""}
      </h2>
      {books.length === 0 ? (
        <div className="rounded-lg border border-brand-border bg-white py-16 text-center">
          <p className="text-brand-light-accent-1">No books found.</p>
          <p className="text-sm text-brand-light-accent-1 mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} platformName={platform?.name} />
          ))}
        </div>
      )}
    </div>
  );
}
