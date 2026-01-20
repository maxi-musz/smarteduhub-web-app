"use client";

import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { DirectorUser, DirectorSchool, DirectorStats } from "@/hooks/use-director-profile";
import { InfoField } from "./InfoField";
import { StatCard } from "./StatCard";
import { formatDate } from "./utils";

interface OverviewTabProps {
  user: DirectorUser;
  school: DirectorSchool;
  stats: DirectorStats;
}

export const OverviewTab = ({ user, school, stats }: OverviewTabProps) => (
  <div className="mt-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoField
        icon={<Mail className="w-5 h-5" />}
        label="Email"
        value={user.email}
      />
      <InfoField
        icon={<Phone className="w-5 h-5" />}
        label="Phone"
        value={user.phone_number || school.school_phone || "N/A"}
      />
      <InfoField
        icon={<MapPin className="w-5 h-5" />}
        label="Address"
        value={school.school_address}
      />
      <InfoField
        icon={<CalendarDays className="w-5 h-5" />}
        label="Joined"
        value={formatDate(user.created_at)}
      />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <StatCard title="Teachers" value={stats.total_teachers} />
      <StatCard title="Students" value={stats.total_students} />
      <StatCard title="Classes" value={stats.total_classes} />
      <StatCard title="Subjects" value={stats.total_subjects} />
    </div>
  </div>
);

