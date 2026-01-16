"use client";

interface TimetableSkeletonProps {
  timeSlots: string[];
}

export const TimetableSkeleton = ({ timeSlots }: TimetableSkeletonProps) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const displayTimeSlots =
    timeSlots.length > 0
      ? timeSlots
      : Array.from({ length: 8 }, (_, i) => `${8 + i}:00-${9 + i}:00`);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] lg:min-w-full">
        <div
          className={`grid gap-1 mb-2`}
          style={{
            gridTemplateColumns: `1fr repeat(${displayTimeSlots.length}, 1fr)`,
          }}
        >
          <div className="p-2 lg:p-3 font-semibold text-center bg-brand-border rounded-lg">
            <div className="w-4 h-4 mx-auto mb-1 bg-gray-300 rounded animate-pulse"></div>
            <span className="text-xs lg:text-sm">Time</span>
          </div>
          {displayTimeSlots.map((timeSlot, index) => (
            <div
              key={`skeleton-${index}-${timeSlot}`}
              className="p-2 lg:p-3 font-medium text-center bg-brand-border rounded-lg"
            >
              <span className="text-xs lg:text-sm">
                {String(timeSlot).replace("-", " - ")}
              </span>
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div
            key={day}
            className={`grid gap-1 mb-2`}
            style={{
              gridTemplateColumns: `1fr repeat(${displayTimeSlots.length}, 1fr)`,
            }}
          >
            <div className="p-3 lg:p-4 font-semibold text-center bg-brand-primary text-white rounded-lg flex items-center justify-center">
              <span className="text-sm lg:text-base">{day}</span>
            </div>
            {displayTimeSlots.map((timeSlot, index) => (
              <div
                key={`${day}-skeleton-${index}-${timeSlot}`}
                className="min-h-[60px] lg:min-h-[80px] border-2 border-dashed border-brand-border rounded-lg relative"
              >
                <div className="h-full p-1 lg:p-2 rounded-lg">
                  <div className="h-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

