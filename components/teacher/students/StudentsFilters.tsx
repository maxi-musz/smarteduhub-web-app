import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudentsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  gradeFilter: string;
  setGradeFilter: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  grades: string[];
}

const StudentsFilters: React.FC<StudentsFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  gradeFilter,
  setGradeFilter,
  sortBy,
  setSortBy,
  grades,
}) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2">
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-24 md:w-32">
            <Filter className="h-4 w-4 mr-1" />
            <SelectValue placeholder="Grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-32 md:w-40">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="attendance">Attendance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StudentsFilters;
