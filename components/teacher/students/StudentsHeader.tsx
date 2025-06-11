import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeacherStudentsHeaderProps {
  classFilter: string;
  setClassFilter: (value: string) => void;
  classList: string[];
}

const TeacherStudentsHeader: React.FC<TeacherStudentsHeaderProps> = ({
  classFilter,
  setClassFilter,
  classList,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Students</h1>
        <p className="text-gray-500 text-sm">Manage your student roster</p>
      </div>
      <div className="flex gap-2">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-32 md:w-40 bg-white">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classList.map((cls) => (
              <SelectItem key={cls} value={cls}>
                {cls}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Plus className="h-4 w-4 mr-1" />
          Add Student
        </Button>
      </div>
    </div>
  );
};

export default TeacherStudentsHeader;
