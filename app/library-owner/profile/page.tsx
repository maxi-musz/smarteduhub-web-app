"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLibraryOwnerProfile } from "@/hooks/library-owner/use-library-owner-profile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LoadingState,
  ErrorState,
  ProfileHeader,
  OverviewTab,
  MyUploadsTab,
  LibraryContentTab,
} from "./profile-components";

const LibraryOwnerProfilePage = () => {
  const { data, isLoading, error } = useLibraryOwnerProfile();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <ProfileHeader profile={data} />

      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
              <TabsTrigger value="library-content">Library Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab user={data.user} />
            </TabsContent>

            <TabsContent value="my-uploads">
              <MyUploadsTab uploads={data.myUploads} />
            </TabsContent>

            <TabsContent value="library-content">
              <LibraryContentTab content={data.libraryContent} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryOwnerProfilePage;
