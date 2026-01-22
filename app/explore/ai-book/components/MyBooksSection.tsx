"use client";

import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export function MyBooksSection() {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-3xl font-bold text-brand-heading">My Books</h2>
        <div className="flex items-center gap-4">
          <p className="text-sm text-brand-light-accent-1">
            Do you have scratch/access code?{" "}
            <Link href="#" className="text-brand-primary hover:text-brand-primary-hover underline">
              Click here
            </Link>
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Books
          </Button>
        </div>
      </div>
    </div>
  );
}
