"use client";

import { Bell } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold text-brand-heading">
        Teacher Dashboard
      </h1>
      <div className="flex items-center">
        <Bell className="w-5 h-5 text-brand-light-accent-1 mr-2" />
        <span className="text-sm text-brand-light-accent-1">
          Today, {new Date().toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

