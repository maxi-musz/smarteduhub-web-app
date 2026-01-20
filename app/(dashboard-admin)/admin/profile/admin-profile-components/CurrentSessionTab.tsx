"use client";

import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DirectorCurrentSession } from "@/hooks/director/use-director-profile";
import { DetailField } from "./DetailField";
import { formatDate } from "./utils";

interface CurrentSessionTabProps {
  currentSession: DirectorCurrentSession | null;
}

export const CurrentSessionTab = ({
  currentSession,
}: CurrentSessionTabProps) => {
  if (!currentSession) {
    return (
      <div className="mt-6 space-y-4">
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No active session found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailField label="Session ID" value={currentSession.id} />
        <DetailField
          label="Academic Year"
          value={currentSession.academic_year}
        />
        <DetailField
          label="Term"
          value={<span className="capitalize">{currentSession.term}</span>}
        />
        <DetailField
          label="Status"
          value={
            <Badge variant="default" className="capitalize">
              {currentSession.status}
            </Badge>
          }
        />
        <DetailField
          label="Start Date"
          value={formatDate(currentSession.start_date)}
        />
        <DetailField
          label="End Date"
          value={formatDate(currentSession.end_date)}
        />
      </div>
    </div>
  );
};

