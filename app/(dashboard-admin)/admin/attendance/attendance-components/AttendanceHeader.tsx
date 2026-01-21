"use client";

import { ClearCacheButton } from "./ClearCacheButton";

export const AttendanceHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-heading">Attendance</h1>
        <p className="text-brand-light-accent-1 text-sm">
          Mark and manage student attendance
        </p>
      </div>
      {process.env.NODE_ENV === "development" && <ClearCacheButton />}
    </div>
  );
};
