"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, LayoutGrid, List } from "lucide-react";

interface SubjectFiltersProps {
  searchQuery: string;
  selectedClass: string;
  groupByClass: boolean;
  onSearchChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onViewToggle: (grouped: boolean) => void;
  availableClasses: Array<{
    id: string;
    name: string;
  }>;
}

export const SubjectFilters = ({
  searchQuery,
  selectedClass,
  groupByClass,
  onSearchChange,
  onClassChange,
  onViewToggle,
  availableClasses,
}: SubjectFiltersProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search subjects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      <Select value={selectedClass} onValueChange={onClassChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Classes</SelectItem>
          {availableClasses.map((classItem) => (
            <SelectItem key={classItem.id} value={classItem.id}>
              {classItem.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1 border rounded-md">
        <Button
          variant={!groupByClass ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewToggle(false)}
          className="rounded-r-none"
        >
          <List className="h-4 w-4 mr-1" />
          List
        </Button>
        <Button
          variant={groupByClass ? "default" : "ghost"}
          size="sm"
          onClick={() => onViewToggle(true)}
          className="rounded-l-none"
        >
          <LayoutGrid className="h-4 w-4 mr-1" />
          By Class
        </Button>
      </div>
    </div>
  );
};

