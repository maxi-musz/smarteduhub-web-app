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

interface TeacherFiltersProps {
  searchQuery: string;
  filterStatus: string;
  filterGender: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onGenderChange: (value: string) => void;
}

export const TeacherFilters = ({
  searchQuery,
  filterStatus,
  filterGender,
  onSearchChange,
  onStatusChange,
  onGenderChange,
}: TeacherFiltersProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search teachers..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      <Select value={filterStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterGender} onValueChange={onGenderChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="All Gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Gender</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

