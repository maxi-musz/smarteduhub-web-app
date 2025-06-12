"use client";

import React from "react";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

interface StudentHeaderProps {
  studentName: string;
  studentClass: string;
  avatarUrl?: string;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({
  studentName = "Student Dashboard",
  studentClass,
  avatarUrl,
}) => {
  const pathname = usePathname();
  const currentPageRaw = pathname.split("/").pop();
  const currentPage =
    currentPageRaw === "home"
      ? "Dashboard"
      : currentPageRaw
      ? currentPageRaw.charAt(0).toUpperCase() + currentPageRaw.slice(1)
      : "";

  return (
    <header aria-label="Student Header">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-heading">
            My {currentPage}
          </h1>
          {studentClass && (
            <p className="text-brand-light-accent-1 text-sm">
              Welcome back{" "}
              <span className="text-brand-primary">{studentName}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-xs text-brand-light-accent-1">
              Class: {studentClass}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-brand-primary text-white">
              OK
              {/* {avatarUrl && <img src={avatarUrl} alt="Avatar" className="avatar" />} */}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
