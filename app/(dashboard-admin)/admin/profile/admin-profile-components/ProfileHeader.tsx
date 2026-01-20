"use client";

import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DirectorProfile } from "@/hooks/use-director-profile";
import { EditProfileModal } from "./EditProfileModal";

interface ProfileHeaderProps {
  profile: DirectorProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user, school } = profile;

  const fullName = user.full_name || `${user.first_name} ${user.last_name}`;
  const avatarUrl =
    typeof user.display_picture === "string"
      ? user.display_picture
      : user.display_picture &&
        typeof (user.display_picture as { url?: unknown }).url === "string"
      ? ((user.display_picture as { url?: string }).url as string)
      : undefined;

  const initials = fullName
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const statusLabel =
    user.status.charAt(0).toUpperCase() + user.status.slice(1);

  return (
    <>
      <Card className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={fullName} />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{fullName}</h2>
                <p className="text-gray-500">
                  {school.school_name} • School Director
                </p>
                <Badge variant="default" className="mt-2 capitalize">
                  {statusLabel}
                </Badge>
              </div>
            </div>
            <Button onClick={() => setIsEditModalOpen(true)}>
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
      />
    </>
  );
};

