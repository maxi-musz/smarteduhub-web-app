"use client";

import React, { useState, useEffect } from "react";
import { useLibraryOwnerSchools, AllSchoolsResponse } from "@/hooks/use-library-owner-schools";
import { useLibraryOwnerSchool, SingleSchoolResponse } from "@/hooks/use-library-owner-school";
import { SchoolsSkeleton } from "./components/SchoolsSkeleton";
import { SchoolsStatistics } from "./components/SchoolsStatistics";
import { SchoolsBreakdown } from "./components/SchoolsBreakdown";
import { SchoolCard } from "./components/SchoolCard";
import { SchoolDetailsModal } from "./components/SchoolDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { Input } from "@/components/ui/input";
import { logger } from "@/lib/logger";

const LibraryOwnerSchools = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Log when component mounts
  useEffect(() => {
    logger.info("[Schools Page] Component mounted/rendered", {
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Fetch all schools data
  const {
    data: schoolsData,
    isLoading: isSchoolsLoading,
    error: schoolsError,
    refetch: refetchSchools,
    dataUpdatedAt,
    isFetching,
  } = useLibraryOwnerSchools();

  // Log query state changes
  useEffect(() => {
    logger.info("[Schools Page] Query state changed", {
      isLoading: isSchoolsLoading,
      isFetching,
      hasData: !!schoolsData,
      dataUpdatedAt: dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null,
      timestamp: new Date().toISOString(),
    });
  }, [isSchoolsLoading, isFetching, schoolsData, dataUpdatedAt]);

  // Fetch single school data when a school is selected
  const {
    data: schoolDetails,
  } = useLibraryOwnerSchool(selectedSchoolId);

  const handleViewDetails = (schoolId: string) => {
    setSelectedSchoolId(schoolId);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedSchoolId(null);
  };

  // Filter schools based on search query
  const filteredSchools = (schoolsData as unknown as AllSchoolsResponse | undefined)?.schools.filter((school) =>
    school.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.school_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.school_address.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Show skeleton loader while loading
  if (isSchoolsLoading) {
    return <SchoolsSkeleton />;
  }

  // Show error modal if there's an error
  if (schoolsError) {
    let errorMessage =
      "An unexpected error occurred while loading schools data.";

    if (schoolsError instanceof AuthenticatedApiError) {
      if (schoolsError.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (schoolsError.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (schoolsError.statusCode === 404) {
        errorMessage =
          "The requested resource was not found. Please check your connection.";
      } else {
        const rawMessage = schoolsError.message || "";
        if (
          rawMessage.includes("Cannot GET") ||
          rawMessage.includes("Cannot POST")
        ) {
          errorMessage =
            "Unable to connect to the server. Please check your connection and try again.";
        } else {
          errorMessage = rawMessage;
        }
      }
    }

    return (
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
        <div className="px-4 sm:px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading Schools
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      refetchSchools();
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

  // Show content if data is available
  if (!schoolsData) {
    return <SchoolsSkeleton />;
  }

  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">Schools</h1>
        <p className="text-sm sm:text-base text-brand-light-accent-1 mt-1">
          Manage and view all schools in your library
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="px-4 sm:px-6">
        <SchoolsStatistics statistics={(schoolsData as unknown as AllSchoolsResponse).statistics} />
      </div>

      {/* Breakdown Statistics */}
      <div className="px-4 sm:px-6">
        <SchoolsBreakdown statistics={(schoolsData as unknown as AllSchoolsResponse).statistics} />
      </div>

      {/* Search and Schools List */}
      <div className="px-4 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-heading">
            All Schools ({(schoolsData as unknown as AllSchoolsResponse).total})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
            <Input
              type="text"
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredSchools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-brand-light-accent-1">
              {searchQuery
                ? "No schools found matching your search."
                : "No schools found."}
            </p>
          </div>
        )}
      </div>

      {/* School Details Modal */}
      <SchoolDetailsModal
        schoolData={(schoolDetails as unknown as SingleSchoolResponse | undefined) ?? null}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};

export default LibraryOwnerSchools;

