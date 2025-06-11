import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { Grade } from "@/constants/types";

interface GradeItemProps {
  grade: Grade;
  getStatusBadge: (status: string) => React.ReactElement | null;
}

const GradeItem: React.FC<GradeItemProps> = ({ grade, getStatusBadge }) => {
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-medium">{grade.assignment}</h3>
            {grade.type && (
              <Badge variant="outline" className="ml-2 bg-gray-100">
                {grade.type.replace("-", " ").charAt(0).toUpperCase() +
                  grade.type.replace("-", " ").slice(1)}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{grade.subject}</p>
          <div className="flex items-center mt-1">
            <div className="h-6 w-6 rounded-full bg-gray-200 mr-2 flex-shrink-0 flex items-center justify-center">
              {grade.studentName.charAt(0)}
            </div>
            <p className="text-sm">{grade.studentName}</p>
            {grade.class && (
              <Badge variant="outline" className="ml-2 bg-gray-100 text-xs">
                {grade.class}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end mb-1">
            {getStatusBadge(grade.status)}
          </div>
          <div className="text-sm font-medium">
            {grade.status === "graded" ? `${grade.score}/${grade.outOf}` : "-"}
          </div>
          <div className="text-xs text-gray-500">{grade.date}</div>
        </div>
      </div>

      <div className="flex justify-end mt-3 sm:hidden">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button
          variant="default"
          size="sm"
          className="ml-2 bg-brand-primary hover:bg-brand-primary/90"
        >
          <PenLine className="h-4 w-4 mr-1" />
          Grade
        </Button>
      </div>

      <div className="hidden sm:flex justify-end mt-3">
        <Button variant="outline" size="sm">
          View Details
        </Button>
        <Button
          variant="default"
          size="sm"
          className="ml-2 bg-brand-primary hover:bg-brand-primary/90"
        >
          <PenLine className="h-4 w-4 mr-1" />
          {grade.status === "graded" ? "Edit Grade" : "Grade Assignment"}
        </Button>
      </div>
    </div>
  );
};

export default GradeItem;
