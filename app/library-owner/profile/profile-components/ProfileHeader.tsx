"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LibraryOwnerProfileResponse } from "@/hooks/library-owner/use-library-owner-profile";

interface ProfileHeaderProps {
  profile: LibraryOwnerProfileResponse;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const { user } = profile;
  const platform = user.platform;

  const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Library Owner";
  const initials = fullName
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusLabel = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Active";

  return (
    <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-brand-primary text-white text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-gray-500">
                {platform?.name || "Library Platform"} • Library Owner
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default" className="capitalize">
                  {statusLabel}
                </Badge>
                {platform?.status && (
                  <Badge variant="outline" className="capitalize">
                    {platform.status}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
