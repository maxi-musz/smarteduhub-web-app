import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssignmentType } from "@/constants/types";

interface GradingFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  assignmentTypeFilter: string;
  setAssignmentTypeFilter: (value: AssignmentType) => void;
  subjectFilter: string;
  setSubjectFilter: (value: string) => void;
  assignmentTypes: { id: string; label: string }[];
  subjects: { id: string; name: string }[];
}

const GradingFilters: React.FC<GradingFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  assignmentTypeFilter,
  setAssignmentTypeFilter,
  subjectFilter,
  setSubjectFilter,
  assignmentTypes,
  subjects,
}) => {
  return (
    <div className="mb-6 flex flex-wrap gap-4">
      <div className="relative grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search assignments or students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select
        value={assignmentTypeFilter}
        onValueChange={(value) =>
          setAssignmentTypeFilter(value as AssignmentType)
        }
      >
        <SelectTrigger className="w-40 md:w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Assignment Type" />
        </SelectTrigger>
        <SelectContent>
          {assignmentTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={subjectFilter} onValueChange={setSubjectFilter}>
        <SelectTrigger className="w-40">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Subjects</SelectItem>
          {subjects.map((subject) => (
            <SelectItem key={subject.id} value={subject.name}>
              {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default GradingFilters;
