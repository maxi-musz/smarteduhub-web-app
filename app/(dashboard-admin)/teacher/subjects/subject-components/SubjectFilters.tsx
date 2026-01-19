"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SubjectFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SubjectFilters = ({
  searchQuery,
  onSearchChange,
}: SubjectFiltersProps) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search subjects by name or code..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};


