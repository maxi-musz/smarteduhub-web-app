"use client";

import Image from "next/image";
import { type ApiTeacher } from "@/hooks/teacher/use-teachers-data";

interface TeacherAvatarProps {
  teacher: ApiTeacher;
}

export const TeacherAvatar = ({ teacher }: TeacherAvatarProps) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0]?.toUpperCase() || "";
    const last = lastName?.[0]?.toUpperCase() || "";
    return `${first}${last}` || "??";
  };

  const getDisplayName = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "Unknown Teacher";
    return `${firstName || ""} ${lastName || ""}`.trim() || "Unknown Teacher";
  };

  if (teacher.display_picture) {
    return (
      <div className="flex items-center gap-3">
        <Image
          src={teacher.display_picture}
          alt={getDisplayName(teacher.first_name, teacher.last_name)}
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="font-medium">
          {getDisplayName(teacher.first_name, teacher.last_name)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
        {getInitials(teacher.first_name, teacher.last_name)}
      </div>
      <div className="font-medium">
        {getDisplayName(teacher.first_name, teacher.last_name)}
      </div>
    </div>
  );
};

