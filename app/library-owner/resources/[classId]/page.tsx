"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLibraryClassResources, ClassResourcesResponse } from "@/hooks/use-library-class-resources";
import { ClassResourcesSkeleton } from "./components/ClassResourcesSkeleton";
import { ClassStatistics } from "./components/ClassStatistics";
import { SubjectCard } from "./components/SubjectCard";
import { CreateSubjectModal } from "./components/CreateSubjectModal";
import { EditSubjectModal } from "./components/EditSubjectModal";
import { Subject } from "@/hooks/use-library-class-resources";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ArrowLeft, Plus } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

const ClassResourcesPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const classId = params.classId as string;
  const [isCreateSubjectModalOpen, setIsCreateSubjectModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // Fetch class resources data
  const {
    data: classResourcesData,
    isLoading: isClassResourcesLoading,
    error: classResourcesError,
    refetch: refetchClassResources,
    dataUpdatedAt,
    isFetching,
  } = useLibraryClassResources(classId);

  // Log when component mounts
  useEffect(() => {
    logger.info("[Class Resources Page] Component mounted/rendered", {
      classId,
      timestamp: new Date().toISOString(),
    });
  }, [classId]);

  // Log query state changes
  useEffect(() => {
    logger.info("[Class Resources Page] Query state changed", {
      isLoading: isClassResourcesLoading,
      isFetching,
      hasData: !!classResourcesData,
      dataUpdatedAt: dataUpdatedAt ? new Date(dataUpdatedAt).toISOString() : null,
      timestamp: new Date().toISOString(),
    });
  }, [isClassResourcesLoading, isFetching, classResourcesData, dataUpdatedAt]);

  // Show skeleton loader while loading
  if (isClassResourcesLoading) {
    return <ClassResourcesSkeleton />;
  }

  // Show error modal if there's an error
  if (classResourcesError) {
    let errorMessage =
      "An unexpected error occurred while loading class resources.";

    if (classResourcesError instanceof AuthenticatedApiError) {
      if (classResourcesError.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (classResourcesError.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (classResourcesError.statusCode === 404) {
        errorMessage =
          "The requested class was not found. Please check your connection.";
      } else {
        const rawMessage = classResourcesError.message || "";
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

    const isSessionExpired =
      classResourcesError instanceof AuthenticatedApiError &&
      classResourcesError.statusCode === 401;

    const handleSessionExpired = async () => {
      // Clear React Query cache
      queryClient.clear();
      // Clear any session/local storage
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.clear();
      }
      // Sign out without automatic redirect, then manually redirect
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    };

    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading Class Resources
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (isSessionExpired) {
                        void handleSessionExpired();
                      } else {
                        refetchClassResources();
                      }
                    }}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {isSessionExpired ? "Continue" : "Retry"}
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
  if (!classResourcesData) {
    return <ClassResourcesSkeleton />;
  }

  const data = classResourcesData as unknown as ClassResourcesResponse;

  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg -ml-4 sm:-ml-6">
      {/* Back Button */}
      <div className="px-4 sm:px-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="-ml-2 -mt-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
      </div>

      {/* Header */}
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">
          {data.class.name} - Resources
        </h1>
        <p className="text-brand-light-accent-1 mt-1 text-sm sm:text-base">
          {data.platform.name} • View all subjects, chapters, topics, videos, and materials for this class
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="px-4 sm:px-6">
        <ClassStatistics statistics={data.statistics} />
      </div>

      {/* Subjects List */}
      <div className="px-4 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-brand-heading">
            Subjects ({data.subjects.length})
          </h2>
          <Button
            onClick={() => setIsCreateSubjectModalOpen(true)}
            className="flex items-center gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create Subject
          </Button>
        </div>

        {data.subjects.length > 0 ? (
          <div className="space-y-3">
            {data.subjects.map((subject) => (
              <SubjectCard 
                key={subject.id} 
                subject={subject}
                onEdit={(subject) => {
                  setSelectedSubject(subject);
                  setIsEditSubjectModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-brand-light-accent-1">
              No subjects found for this class.
            </p>
          </div>
        )}
      </div>

      {/* Create Subject Modal */}
      <CreateSubjectModal
        isOpen={isCreateSubjectModalOpen}
        onClose={() => setIsCreateSubjectModalOpen(false)}
        classId={classId}
        className={data.class.name}
      />

      {/* Edit Subject Modal */}
      <EditSubjectModal
        isOpen={isEditSubjectModalOpen}
        onClose={() => {
          setIsEditSubjectModalOpen(false);
          setSelectedSubject(null);
        }}
        subject={selectedSubject}
      />
    </div>
  );
};

export default ClassResourcesPage;

