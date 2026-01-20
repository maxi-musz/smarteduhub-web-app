"use client";

import Image from "next/image";
import { type ApiStudent } from "@/hooks/student/use-students-data";

interface StudentAvatarProps {
  student: ApiStudent;
}

export const StudentAvatar = ({ student }: StudentAvatarProps) => {
  const capitalizeWord = (word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0]?.toUpperCase() || "";
    const last = lastName?.[0]?.toUpperCase() || "";
    return `${first}${last}` || "??";
  };

  const getDisplayName = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "Unknown Student";
    const capitalizedLastName = capitalizeWord(lastName || "");
    const firstInitial = capitalizeWord(firstName || "")[0] || "";
    return `${capitalizedLastName} ${firstInitial}.`.trim() || "Unknown Student";
  };

  const getFullName = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "Unknown Student";
    return `${capitalizeWord(firstName || "")} ${capitalizeWord(lastName || "")}`.trim() || "Unknown Student";
  };

  const fullName = getFullName(student.first_name, student.last_name);
  const displayName = getDisplayName(student.first_name, student.last_name);

  if (student.display_picture) {
    return (
      <div className="flex items-center gap-3">
        <div title={fullName} className="cursor-pointer">
          <Image
            src={student.display_picture}
            alt={fullName}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
        <div
          className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
          title={fullName}
        >
          {displayName}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold cursor-pointer"
        title={fullName}
      >
        {getInitials(student.first_name, student.last_name)}
      </div>
      <div
        className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
        title={fullName}
      >
        {displayName}
      </div>
    </div>
  );
};

