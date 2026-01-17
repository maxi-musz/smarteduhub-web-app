"use client";

import { Users } from "lucide-react";

export const StudentHeader = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-brand-primary/10 rounded-lg">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-brand-heading">Students</h1>
      </div>
      <p className="text-brand-light-accent-1 text-sm lg:text-lg">
        Manage and monitor student performance and attendance.
      </p>
    </div>
  );
};

