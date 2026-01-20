"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDirectorProfile } from "@/hooks/use-director-profile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LoadingState,
  ErrorState,
  ProfileHeader,
  OverviewTab,
  UserDetailsTab,
  SchoolDetailsTab,
  CurrentSessionTab,
  SettingsTab,
  SubscriptionTab,
} from "./admin-profile-components";

const AdminProfile = () => {
  const { data, isLoading, error } = useDirectorProfile();
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !data) {
    return <ErrorState error={error} />;
  }

  const {
    user,
    school,
    stats,
    current_session,
    settings,
    subscription_plan,
    available_plans,
  } = data;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <ProfileHeader profile={data} />

      <Card className="bg-white shadow-md">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="user">User Details</TabsTrigger>
              <TabsTrigger value="school">School Details</TabsTrigger>
              <TabsTrigger value="session">Current Session</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab user={user} school={school} stats={stats} />
            </TabsContent>

            <TabsContent value="user">
              <UserDetailsTab user={user} />
            </TabsContent>

            <TabsContent value="school">
              <SchoolDetailsTab school={school} />
            </TabsContent>

            <TabsContent value="session">
              <CurrentSessionTab currentSession={current_session} />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab settings={settings} />
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionTab
                subscriptionPlan={subscription_plan}
                availablePlans={available_plans}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
