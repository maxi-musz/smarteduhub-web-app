"use client";

import React, { useState, useMemo } from "react";
import {
  Wallet,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useDashboardData } from "@/hooks/use-dashboard-data";

type NotificationEvent = {
  id?: string;
  title: string;
  date: string;
  description: string;
  // Add other properties as they come from API
};

// Types moved to use-dashboard-data.ts hook

// Skeleton component
const SkeletonCard = () => (
  <Card className="shadow-sm bg-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-32 shimmer"></div>
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse shimmer"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16 shimmer"></div>
          </div>
        ))}
      </div>
      <div className="mt-4 h-9 bg-gray-200 rounded animate-pulse shimmer"></div>
    </CardContent>
  </Card>
);

const classFilters = [
  { label: "All", value: "all" },
  { label: "JSS1", value: "JSS1" },
  { label: "JSS2", value: "JSS2" },
  { label: "JSS3", value: "JSS3" },
  { label: "SS1", value: "SS1" },
  { label: "SS2", value: "SS2" },
  { label: "SS3", value: "SS3" },
];

const AdminDashboard = () => {
  const router = useRouter();

  // Use React Query hook for data fetching with automatic caching
  const {
    data: dashboardData,
    isLoading,
    error: queryError,
    refetch,
  } = useDashboardData();

  const [showErrorModal, setShowErrorModal] = useState(false);

  // Format error message
  const error = useMemo(() => {
    if (!queryError) return null;

    if (queryError instanceof AuthenticatedApiError) {
      if (queryError.statusCode === 401) {
        return "Your session has expired. Please login again.";
      } else if (queryError.statusCode === 403) {
        return "You don't have permission to access this data.";
      } else {
        return queryError.message;
      }
    }

    return "An unexpected error occurred while loading dashboard data.";
  }, [queryError]);

  // Show error modal when error occurs
  React.useEffect(() => {
    if (error) {
      setShowErrorModal(true);
    }
  }, [error]);

  // Retry mechanism
  const handleRetry = () => {
    setShowErrorModal(false);
    refetch();
  };

  const [classFilter, setClassFilter] = useState("all");
  const filteredOngoingClasses = useMemo(() => {
    if (!dashboardData?.ongoingClasses) return [];

    return classFilter === "all"
      ? dashboardData.ongoingClasses
      : dashboardData.ongoingClasses.filter((c) =>
          c.class.toUpperCase().startsWith(classFilter.toUpperCase())
        );
  }, [dashboardData?.ongoingClasses, classFilter]);

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-brand-heading">
          Dashboard Overview
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </span>
          <Clock className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Financial Overview Card */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Financial Overview</h3>
                <Wallet className="h-5 w-5 text-green-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold">
                    ₦{" "}
                    {dashboardData?.finance.totalRevenue.toLocaleString() ||
                      "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Outstanding Fees</span>
                  <span className="font-semibold text-yellow-600">
                    ₦{" "}
                    {dashboardData?.finance.outstandingFees.toLocaleString() ||
                      "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Net Balance</span>
                  <span className="font-semibold text-green-600">
                    ₦{" "}
                    {dashboardData?.finance.netBalance.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
              <Button
                variant="link"
                className="mt-4 w-full justify-between"
                onClick={() => router.push("/admin/finance")}
              >
                View Details <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Teachers Overview Card */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Teachers Overview</h3>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Teachers</span>
                  <span className="font-semibold">
                    {dashboardData?.teachers.totalTeachers || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Classes</span>
                  <span className="font-semibold">
                    {dashboardData?.teachers.activeClasses || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Subjects</span>
                  <span className="font-semibold">
                    {dashboardData?.teachers.totalSubjects || 0}
                  </span>
                </div>
              </div>
              <Button
                variant="link"
                className="mt-4 w-full justify-between"
                onClick={() => router.push("/admin/teachers")}
              >
                View Details <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Students Overview Card */}
        {isLoading ? (
          <SkeletonCard />
        ) : (
          <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Students Overview</h3>
                <GraduationCap className="h-5 w-5 text-purple-500" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Students</span>
                  <span className="font-semibold">
                    {dashboardData?.students.totalStudents || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Students</span>
                  <span className="font-semibold">
                    {dashboardData?.students.activeStudents || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Suspended Students</span>
                  <span className="font-semibold">
                    {dashboardData?.students.suspendedStudents || 0}
                  </span>
                </div>
              </div>
              <Button
                variant="link"
                className="mt-4 w-full justify-between"
                onClick={() => router.push("/admin/students")}
              >
                View Details <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ongoing Classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ongoing Classes List */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Ongoing Classes</h3>
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>

            {/* Class Filter Buttons */}
            <div className="flex gap-2 mb-4">
              {classFilters.map((filter) => (
                <button
                  key={filter.value}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    classFilter === filter.value
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setClassFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div
              className="max-h-64 overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D1D5DB #F3F4F6",
              }}
            >
              <div className="space-y-3">
                {isLoading ? (
                  // Skeleton loading for ongoing classes
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50 animate-shimmer"></div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 w-32 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  ))
                ) : filteredOngoingClasses.length > 0 ? (
                  filteredOngoingClasses.map((classItem, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-brand-primary">
                          {classItem.class}
                        </span>
                        <span className="text-xs text-gray-500">
                          {classItem.from} - {classItem.to}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {classItem.subject} - {classItem.teacher}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {dashboardData && dashboardData.ongoingClasses?.length === 0
                      ? "Create some class schedules to see them here"
                      : `No ongoing classes for ${
                          classFilter === "all" ? "all classes" : classFilter
                        }`}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="link"
              className="mt-4 w-full justify-between"
              onClick={() => router.push("/admin/schedules")}
            >
              View Full Schedule <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-sm hover:shadow-md transition-shadow bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <Calendar className="h-5 w-5 text-rose-500" />
            </div>
            <div
              className="max-h-64 overflow-y-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#D1D5DB #F3F4F6",
              }}
            >
              <div className="space-y-4">
                {isLoading ? (
                  // Skeleton loading for upcoming events
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="relative overflow-hidden p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50 animate-shimmer"></div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-3 w-12 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 w-full bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  ))
                ) : dashboardData?.notifications &&
                  dashboardData.notifications.length > 0 ? (
                  dashboardData.notifications.map(
                    (event: NotificationEvent, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{event.title}</span>
                          <span className="text-sm text-gray-500">
                            {event.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {event.description}
                        </p>
                      </div>
                    )
                  )
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Your events will show here
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="link"
              className="mt-4 w-full justify-between"
              onClick={() => router.push("/calendar")}
            >
              View Calendar <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Failed to Load Dashboard
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-3">
              <Button onClick={handleRetry} className="flex-1 gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => setShowErrorModal(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
