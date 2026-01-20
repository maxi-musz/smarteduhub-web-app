"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  FilePen,
  MessageSquare,
  BarChart2,
} from "lucide-react";

export const QuickActionButtons = () => {
  const router = useRouter();

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-medium mb-4 text-brand-heading">
        Quick Action Buttons
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="py-6 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-blue-200"
          onClick={() => handleNavigate("/teacher/attendance")}
        >
          <ClipboardCheck className="h-8 w-8 text-brand-primary" />
          <span>Mark Attendance</span>
        </Button>

        <Button
          variant="outline"
          className="py-6 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200"
          onClick={() => handleNavigate("/teacher/assignment")}
        >
          <FilePen className="h-8 w-8 text-green-400" />
          <span>Create Assignment</span>
        </Button>

        <Button
          variant="outline"
          className="py-6 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border-amber-200"
          onClick={() => handleNavigate("/teacher/message")}
        >
          <MessageSquare className="h-8 w-8 text-amber-400" />
          <span>Message Class</span>
        </Button>

        <Button
          variant="outline"
          className="py-6 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200"
          onClick={() => handleNavigate("/teacher/grades")}
        >
          <BarChart2 className="h-8 w-8 text-purple-500" />
          <span>Enter Grades</span>
        </Button>
      </div>
    </div>
  );
};

