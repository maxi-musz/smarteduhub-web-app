"use client";

interface ScheduleHeaderProps {
  title?: string;
  description?: string;
}

export const ScheduleHeader = ({
  title = "Class Schedules",
  description = "Manage and view class timetables",
}: ScheduleHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-brand-heading">{title}</h1>
        <p className="text-brand-light-accent-1 mt-1">{description}</p>
      </div>
    </div>
  );
};

