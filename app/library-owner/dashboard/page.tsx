"use client";

import React from "react";
import { useLibraryOwnerDashboard } from "@/hooks/use-library-owner-dashboard";
import { useLibraryOwnerProfile } from "@/hooks/use-library-owner-profile";
import { DashboardSkeleton } from "./components/DashboardSkeleton";
import { StatsCards } from "./components/StatsCards";
import { LibraryInfo } from "./components/LibraryInfo";
import { StatisticsGrid } from "./components/StatisticsGrid";
import { RecentActivity } from "./components/RecentActivity";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

const LibraryOwnerDashboard = () => {
  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useLibraryOwnerDashboard();

  // Fetch profile data
  const {
    isLoading: isProfileLoading,
    error: profileError,
  } = useLibraryOwnerProfile();

  const isLoading = isDashboardLoading || isProfileLoading;
  const error = dashboardError || profileError;

  // Show skeleton loader while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Show error modal if there's an error
  if (error) {
    let errorMessage = "An unexpected error occurred while loading dashboard data.";
    
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (error.statusCode === 404) {
        errorMessage = "The requested resource was not found. Please check your connection.";
      } else {
        // Clean up error messages - don't show raw API errors
        const rawMessage = error.message || "";
        if (rawMessage.includes("Cannot GET") || rawMessage.includes("Cannot POST")) {
          errorMessage = "Unable to connect to the server. Please check your connection and try again.";
        } else {
          errorMessage = rawMessage;
        }
      }
    }

    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading Dashboard
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      refetchDashboard();
                    }}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  // Show dashboard content
  if (!dashboardData) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-brand-heading">
          {dashboardData.library.name} Dashboard
        </h1>
        <p className="text-brand-light-accent-1 mt-1">
          Manage your library resources and content
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards
        statistics={dashboardData.statistics}
        myActivity={dashboardData.myActivity}
      />

      {/* Library Info */}
      <LibraryInfo library={dashboardData.library} />

      {/* Statistics Grid */}
      <StatisticsGrid statistics={dashboardData.statistics} />

      {/* Recent Activity */}
      <RecentActivity myActivity={dashboardData.myActivity} />
    </div>
  );
};

export default LibraryOwnerDashboard;

