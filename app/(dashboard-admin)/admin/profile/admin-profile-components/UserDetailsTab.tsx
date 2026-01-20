"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DirectorUser } from "@/hooks/director/use-director-profile";
import { DetailField } from "./DetailField";
import { formatDate } from "./utils";

interface UserDetailsTabProps {
  user: DirectorUser;
}

export const UserDetailsTab = ({ user }: UserDetailsTabProps) => (
  <div className="mt-6 space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <DetailField label="ID" value={user.id} />
      <DetailField label="Email" value={user.email} />
      <DetailField label="First Name" value={user.first_name} />
      <DetailField label="Last Name" value={user.last_name} />
      <DetailField label="Full Name" value={user.full_name} />
      <DetailField label="Phone Number" value={user.phone_number || "N/A"} />
      <DetailField
        label="Gender"
        value={<span className="capitalize">{user.gender}</span>}
      />
      <DetailField label="Role" value={user.role} />
      <DetailField
        label="Status"
        value={
          <Badge variant="default" className="capitalize">
            {user.status}
          </Badge>
        }
      />
      <DetailField
        label="Email Verified"
        value={
          user.is_email_verified ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )
        }
      />
      <DetailField label="Created At" value={formatDate(user.created_at)} />
      <DetailField label="Updated At" value={formatDate(user.updated_at)} />
    </div>
  </div>
);

