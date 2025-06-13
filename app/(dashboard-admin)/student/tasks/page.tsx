import React from "react";

import StudentHeader from "@/components/ui/student-header";
import ClassScheduleTable from "@/components/student/tasks/ClassScheduleTable";
import EventsTable from "@/components/student/tasks/EventsTable";

const StudentTasksPage = () => {
  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <StudentHeader
        studentName="Oluwajuwon Kayode"
        studentClass="SS3A"
        // avatarUrl="https://via.placeholder.com/150"
      />

      {/* Schedule Table */}
      <ClassScheduleTable />

      {/* Spacer/Divider */}
      <div className="my-12">
        <hr className="border-t border-brand-border" />
      </div>
      {/* Events Table */}
      <EventsTable />
    </div>
  );
};

export default StudentTasksPage;
