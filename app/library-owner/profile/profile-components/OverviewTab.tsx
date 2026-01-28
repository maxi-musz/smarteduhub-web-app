"use client";

import { Mail, CalendarDays, Building2, FileText, Video } from "lucide-react";
import { LibraryUser } from "@/hooks/library-owner/use-library-owner-profile";
import { InfoField } from "./InfoField";
import { StatCard } from "./StatCard";
import { formatDate } from "./utils";

interface OverviewTabProps {
  user: LibraryUser;
}

export const OverviewTab = ({ user }: OverviewTabProps) => {
  const platform = user.platform;

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField
          icon={<Mail className="w-5 h-5" />}
          label="Email"
          value={user.email}
        />
        <InfoField
          icon={<Building2 className="w-5 h-5" />}
          label="Platform"
          value={platform?.name || "N/A"}
        />
        {platform?.description && (
          <InfoField
            icon={<FileText className="w-5 h-5" />}
            label="Platform Description"
            value={platform.description}
          />
        )}
        <InfoField
          icon={<CalendarDays className="w-5 h-5" />}
          label="Joined"
          value={formatDate(user.createdAt)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <StatCard
          title="Videos Uploaded"
          value={user.uploadedVideosCount || 0}
          icon={<Video className="w-5 h-5" />}
        />
        <StatCard
          title="Materials Uploaded"
          value={user.uploadedMaterialsCount || 0}
          icon={<FileText className="w-5 h-5" />}
        />
      </div>
    </div>
  );
};
