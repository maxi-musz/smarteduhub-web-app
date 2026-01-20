"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface StudentFiltersProps {
  searchQuery: string;
  filterStatus: string;
  filterClass: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClassChange: (value: string) => void;
}

export const StudentFilters = ({
  searchQuery,
  filterStatus,
  filterClass,
  onSearchChange,
  onStatusChange,
  onClassChange,
}: StudentFiltersProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      <Select value={filterStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Class" />
        </SelectTrigger>
        <SelectContent>
          {/* TODO: Replace with real classes from backend when available */}
          <SelectItem value="all">All Classes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

