"use client";

import { Badge } from "@/components/ui/badge";
import { DirectorSchool } from "@/hooks/director/use-director-profile";
import { DetailField } from "./DetailField";
import { formatDate } from "./utils";

interface SchoolDetailsTabProps {
  school: DirectorSchool;
}

export const SchoolDetailsTab = ({ school }: SchoolDetailsTabProps) => (
  <div className="mt-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DetailField label="School Name" value={school.school_name} />
      <DetailField label="School Email" value={school.school_email} />
      <DetailField label="School Phone" value={school.school_phone} />
      <DetailField
        label="School Address"
        value={school.school_address}
        className="md:col-span-2"
      />
      <DetailField
        label="School Type"
        value={<span className="capitalize">{school.school_type.replace("_", " ")}</span>}
      />
      <DetailField
        label="School Ownership"
        value={<span className="capitalize">{school.school_ownership}</span>}
      />
      <DetailField
        label="Status"
        value={
          <Badge variant="default" className="capitalize">
            {school.status.replace("_", " ")}
          </Badge>
        }
      />
      <DetailField label="Created At" value={formatDate(school.created_at)} />
      <DetailField label="Updated At" value={formatDate(school.updated_at)} />
    </div>
  </div>
);

