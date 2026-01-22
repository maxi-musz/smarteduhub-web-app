"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, RotateCcw, Search } from "lucide-react";
import type { AIClassWithCount } from "@/hooks/explore/use-ai-books-landing";

interface FilterPanelProps {
  search: string;
  classId: string;
  classes: AIClassWithCount[];
  onSearchChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onClearFilters: () => void;
}

export function FilterPanel({
  search,
  classId,
  classes,
  onSearchChange,
  onClassChange,
  onClearFilters,
}: FilterPanelProps) {
  const hasActiveFilters = !!search || !!classId;

  return (
    <div className="bg-brand-bg rounded-lg shadow-sm border border-brand-border p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Search */}
        <div className="flex-1 w-full sm:w-auto min-w-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by title, author, or description..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white pr-10"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="h-4 w-4 text-brand-light-accent-1" />
            </div>
          </div>
        </div>

        {/* Class / Grade */}
        <div className="w-full sm:w-48 flex-shrink-0">
          <Select value={classId || "all"} onValueChange={(v) => onClassChange(v === "all" ? "" : v)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="All classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classes</SelectItem>
              {classes.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                  {typeof c.totalBooks === "number" ? ` (${c.totalBooks})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-brand-light-accent-1 hover:text-brand-heading whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4 mr-1.5" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
