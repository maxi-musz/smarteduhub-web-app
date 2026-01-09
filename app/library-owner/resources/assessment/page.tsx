"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLibraryOwnerResources } from "@/hooks/use-library-owner-resources";
import { useCBTs } from "@/hooks/assessment/use-cbt";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  RefreshCw,
  Plus,
  ClipboardList,
  Clock,
  Users,
  FileQuestion,
  Edit,
  Trash2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { logger } from "@/lib/logger";
import { CreateCBTDialog } from "./components/CreateCBTDialog";
import { EditCBTDialog } from "./components/EditCBTDialog";
import { DeleteCBTDialog } from "./components/DeleteCBTDialog";
import { ManageQuestionsDialog } from "./components/ManageQuestionsDialog";
import { CBT } from "@/hooks/assessment/use-cbt-types";
import { usePublishCBT, useUnpublishCBT } from "@/hooks/assessment/use-cbt";
import { toast } from "sonner";
import { formatTopicTitle } from "@/lib/text-formatter";

const AssessmentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [preSelectedTopicId, setPreSelectedTopicId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isManageQuestionsOpen, setIsManageQuestionsOpen] = useState(false);
  const [selectedCBT, setSelectedCBT] = useState<CBT | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "unpublished" | "closed">("all");

  // Fetch resources to get classes and subjects
  const {
    data: resourcesData,
    isLoading: isResourcesLoading,
    error: resourcesError,
    refetch: refetchResources,
  } = useLibraryOwnerResources();

  // Fetch CBTs for selected subject (optionally filtered by topic)
  const effectiveTopicId = selectedTopicId === "general" || selectedTopicId === null ? null : selectedTopicId;
  const {
    data: cbts,
    isLoading: isCBTsLoading,
    error: cbtsError,
    refetch: refetchCBTs,
  } = useCBTs(selectedSubjectId, effectiveTopicId);

  const publishCBT = usePublishCBT();
  const unpublishCBT = useUnpublishCBT();

  // Filter assessments based on selected status filter
  const filteredCBTs = React.useMemo(() => {
    if (!cbts) return [];
    
    switch (statusFilter) {
      case "published":
        return cbts.filter((cbt) => cbt.isPublished);
      case "unpublished":
        return cbts.filter((cbt) => !cbt.isPublished);
      case "closed":
        return cbts.filter((cbt) => cbt.status === "CLOSED");
      case "all":
      default:
        return cbts;
    }
  }, [cbts, statusFilter]);

  // Calculate counts for each filter
  const filterCounts = React.useMemo(() => {
    if (!cbts) {
      return { all: 0, published: 0, unpublished: 0, closed: 0 };
    }
    
    return {
      all: cbts.length,
      published: cbts.filter((cbt) => cbt.isPublished).length,
      unpublished: cbts.filter((cbt) => !cbt.isPublished).length,
      closed: cbts.filter((cbt) => cbt.status === "CLOSED").length,
    };
  }, [cbts]);

  // Get all subjects from all classes
  const allSubjects = resourcesData?.libraryClasses?.flatMap((cls) =>
    cls.subjects?.map((subj) => ({
      ...subj,
      className: cls.name,
      classId: cls.id,
    })) || []
  ) || [];

  // Get subjects for selected class
  const classSubjects = selectedClassId
    ? resourcesData?.libraryClasses
        ?.find((c) => c.id === selectedClassId)
        ?.subjects?.map((s) => ({
          ...s,
          className: resourcesData.libraryClasses?.find((c) => c.id === selectedClassId)?.name || "",
          classId: selectedClassId,
        })) || []
    : [];

  // Get topics for selected subject (sorted by order)
  const subjectTopics = selectedSubjectId
    ? (resourcesData?.topics || [])
        .filter((topic) => topic.subjectId === selectedSubjectId)
        .sort((a, b) => a.order - b.order)
    : [];

  // Handle URL parameters for pre-selection (only run once when resourcesData is loaded)
  useEffect(() => {
    if (!resourcesData) return;

    const subjectIdParam = searchParams.get("subjectId");
    const topicIdParam = searchParams.get("topicId");
    const cbtIdParam = searchParams.get("cbtId");

    if (subjectIdParam) {
      // Find the subject and its class
      const subject = allSubjects.find((s) => s.id === subjectIdParam);
      if (subject) {
        setSelectedClassId(subject.classId);
        setSelectedSubjectId(subjectIdParam);
        if (topicIdParam) {
          setSelectedTopicId(topicIdParam);
          setPreSelectedTopicId(topicIdParam);
          // Auto-open create dialog if topic is provided
          setIsCreateDialogOpen(true);
        } else {
          // If no topic in URL, set to "General" (null)
          setSelectedTopicId(null);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourcesData]); // Only depend on resourcesData to prevent multiple calls

  // Handle opening manage questions when CBT ID is in URL
  useEffect(() => {
    const cbtIdParam = searchParams.get("cbtId");
    if (cbtIdParam && cbts) {
      const cbt = cbts.find((c) => c.id === cbtIdParam);
      if (cbt) {
        setSelectedCBT(cbt);
        setIsManageQuestionsOpen(true);
        // Clear the URL param
        router.replace("/library-owner/resources/assessment");
      }
    }
  }, [searchParams, cbts, router]);

  const handleCreateCBT = () => {
    if (!selectedSubjectId) {
      toast.error("Please select a subject first");
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const handleEditCBT = (cbt: CBT) => {
    setSelectedCBT(cbt);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCBT = (cbt: CBT) => {
    setSelectedCBT(cbt);
    setIsDeleteDialogOpen(true);
  };

  const handleManageQuestions = (cbt: CBT) => {
    setSelectedCBT(cbt);
    setIsManageQuestionsOpen(true);
  };

  const handlePublish = async (cbt: CBT) => {
    try {
      await publishCBT.mutateAsync(cbt.id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUnpublish = async (cbt: CBT) => {
    try {
      await unpublishCBT.mutateAsync(cbt.id);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return "Not set";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show loading state
  if (isResourcesLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="-ml-2 -mt-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </div>
        <div className="px-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="px-6">
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Show error state
  if (resourcesError) {
    let errorMessage = "An unexpected error occurred while loading resources data.";

    if (resourcesError instanceof AuthenticatedApiError) {
      if (resourcesError.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (resourcesError.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else {
        errorMessage = resourcesError.message || errorMessage;
      }
    }

    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="-ml-2 -mt-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </div>
        <div className="px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading Resources
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">{errorMessage}</p>
                <div className="flex gap-2">
                  <Button onClick={() => refetchResources()} className="flex-1">
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

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Back Button */}
      <div className="px-6">
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
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-brand-heading">
              CBT Assessments
            </h1>
            <p className="text-sm text-brand-light-accent-1 mt-1">
              Create and manage Computer-Based Test assessments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => refetchCBTs()}
              disabled={isCBTsLoading || !selectedSubjectId}
              title="Refresh assessments"
            >
              <RefreshCw className={`h-4 w-4 ${isCBTsLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              onClick={handleCreateCBT}
              disabled={!selectedSubjectId}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create CBT
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium text-brand-heading mb-2 block">
              Class
            </label>
            <Select
              value={selectedClassId || undefined}
              onValueChange={(value) => {
                setSelectedClassId(value || null);
                setSelectedSubjectId(null); // Reset subject when class changes
                setSelectedTopicId(null); // Reset topic when class changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {resourcesData?.libraryClasses?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-brand-heading mb-2 block">
              Subject <span className="text-red-500">*</span>
            </label>
            <Select
              value={selectedSubjectId || undefined}
              onValueChange={(value) => {
                setSelectedSubjectId(value || null);
                setSelectedTopicId(null); // Reset topic when subject changes
              }}
              disabled={!selectedClassId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {classSubjects.length > 0 ? (
                  classSubjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id}>
                      {subj.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-brand-light-accent-1">
                    No subjects available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-brand-heading mb-2 block">
              Topic (Optional)
            </label>
            <Select
              value={selectedTopicId || "general"}
              onValueChange={(value) => {
                setSelectedTopicId(value === "general" ? null : value);
              }}
              disabled={!selectedSubjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                {subjectTopics.length > 0 ? (
                  subjectTopics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {formatTopicTitle(topic.title)}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-brand-light-accent-1">
                    No topics available
                  </div>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-brand-light-accent-1 mt-1">
              Select "General" for subject-level assessment, or choose a specific topic
            </p>
          </div>
        </div>
      </div>

      {/* CBTs List */}
      <div className="px-6">
        {/* Status Filter Pills */}
        {selectedSubjectId && cbts && cbts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-brand-heading border border-brand-border hover:bg-gray-50"
              }`}
            >
              All ({filterCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter("published")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "published"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-brand-heading border border-brand-border hover:bg-gray-50"
              }`}
            >
              Published ({filterCounts.published})
            </button>
            <button
              onClick={() => setStatusFilter("unpublished")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "unpublished"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-brand-heading border border-brand-border hover:bg-gray-50"
              }`}
            >
              Unpublished ({filterCounts.unpublished})
            </button>
            <button
              onClick={() => setStatusFilter("closed")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "closed"
                  ? "bg-brand-primary text-white"
                  : "bg-white text-brand-heading border border-brand-border hover:bg-gray-50"
              }`}
            >
              Closed ({filterCounts.closed})
            </button>
          </div>
        )}

        {isCBTsLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-primary mb-2" />
            <p className="text-sm text-brand-light-accent-1">Loading CBTs...</p>
          </div>
        ) : cbtsError ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <AlertCircle className="h-8 w-8 mx-auto text-red-500 mb-2" />
            <p className="text-sm text-brand-light-accent-1 mb-4">
              {cbtsError instanceof AuthenticatedApiError
                ? cbtsError.message
                : "Failed to load CBTs"}
            </p>
            <Button onClick={() => refetchCBTs()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        ) : !selectedSubjectId ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ClipboardList className="h-12 w-12 mx-auto text-brand-light-accent-1 mb-4 opacity-50" />
            <p className="text-brand-heading font-medium mb-2">
              Select a Subject
            </p>
            <p className="text-sm text-brand-light-accent-1">
              Please select a class and subject to view or create CBT assessments
            </p>
          </div>
        ) : filteredCBTs && filteredCBTs.length > 0 ? (
          <div className="space-y-4">
            {filteredCBTs.map((cbt) => (
              <div
                key={cbt.id}
                className="bg-white rounded-lg border border-brand-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-brand-heading">
                        {cbt.title}
                      </h3>
                      <Badge
                        variant={cbt.isPublished ? "default" : "outline"}
                        className="text-xs"
                      >
                        {cbt.isPublished ? "Published" : "Draft"}
                      </Badge>
                      {cbt.isResultReleased && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                          Results Released
                        </Badge>
                      )}
                      {effectiveTopicId === null && (
                        <Badge variant="outline" className="text-xs text-brand-primary border-brand-primary">
                          {cbt.topic ? formatTopicTitle(cbt.topic.title) : "General"}
                        </Badge>
                      )}
                    </div>

                    {cbt.description && (
                      <p className="text-sm text-brand-light-accent-1 mb-4 line-clamp-2">
                        {cbt.description}
                      </p>
                    )}

                    {effectiveTopicId === null && (
                      <div className="mb-3 text-sm">
                        <span className="text-brand-light-accent-1">Topic: </span>
                        <span className="font-medium text-brand-heading">
                          {cbt.topic ? formatTopicTitle(cbt.topic.title) : "General"}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <FileQuestion className="h-4 w-4 text-brand-light-accent-1" />
                        <span className="text-brand-light-accent-1">
                          Questions:
                        </span>
                        <span className="font-medium text-brand-heading">
                          {cbt._count.questions}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-brand-light-accent-1" />
                        <span className="text-brand-light-accent-1">
                          Duration:
                        </span>
                        <span className="font-medium text-brand-heading">
                          {formatDuration(cbt.duration)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-brand-light-accent-1" />
                        <span className="text-brand-light-accent-1">
                          Attempts:
                        </span>
                        <span className="font-medium text-brand-heading">
                          {cbt._count.attempts}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-brand-light-accent-1">Points:</span>
                        <span className="font-medium text-brand-heading">
                          {cbt.totalPoints}
                        </span>
                      </div>
                    </div>

                    {cbt.startDate && cbt.endDate && (
                      <div className="mt-3 text-xs text-brand-light-accent-1">
                        <span>Available: {formatDate(cbt.startDate)} - {formatDate(cbt.endDate)}</span>
                      </div>
                    )}

                    {cbt.tags && cbt.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {cbt.tags.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageQuestions(cbt)}
                      title="Manage Questions"
                    >
                      <FileQuestion className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`publish-${cbt.id}`}
                        checked={cbt.isPublished}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            // Publishing - check if has at least 2 questions
                            if (cbt._count.questions < 2) {
                              toast.error("Assessment must have at least 2 questions before publishing");
                              return;
                            }
                            handlePublish(cbt);
                          } else {
                            // Unpublishing
                            handleUnpublish(cbt);
                          }
                        }}
                        disabled={
                          publishCBT.isPending || 
                          unpublishCBT.isPending || 
                          (cbt._count.questions < 2 && !cbt.isPublished)
                        }
                      />
                      <Label 
                        htmlFor={`publish-${cbt.id}`} 
                        className="text-xs cursor-pointer whitespace-nowrap"
                        title={
                          cbt._count.questions < 2 && !cbt.isPublished
                            ? "Add at least 2 questions to publish"
                            : cbt.isPublished
                            ? "Click to unpublish"
                            : "Click to publish"
                        }
                      >
                        {cbt.isPublished ? "Published" : "Draft"}
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCBT(cbt)}
                      title="Edit CBT"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCBT(cbt)}
                      disabled={cbt._count.attempts > 0}
                      title={cbt._count.attempts > 0 ? "Cannot delete CBT with attempts" : "Delete CBT"}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedSubjectId && cbts && cbts.length > 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ClipboardList className="h-12 w-12 mx-auto text-brand-light-accent-1 mb-4 opacity-50" />
            <p className="text-brand-heading font-medium mb-2">
              No CBTs Found
            </p>
            <p className="text-sm text-brand-light-accent-1 mb-4">
              No assessments match the selected filter
            </p>
            <Button onClick={() => setStatusFilter("all")} variant="outline">
              Clear Filter
            </Button>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ClipboardList className="h-12 w-12 mx-auto text-brand-light-accent-1 mb-4 opacity-50" />
            <p className="text-brand-heading font-medium mb-2">
              No CBTs Found
            </p>
            <p className="text-sm text-brand-light-accent-1 mb-4">
              Create your first CBT assessment to get started
            </p>
            <Button onClick={handleCreateCBT}>
              <Plus className="h-4 w-4 mr-2" />
              Create CBT
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateCBTDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false);
          setPreSelectedTopicId(null);
          // Clear URL params when closing
          router.replace("/library-owner/resources/assessment");
        }}
        subjectId={selectedSubjectId || ""}
        topicId={
          selectedTopicId === null || selectedTopicId === "general"
            ? undefined
            : selectedTopicId || preSelectedTopicId || undefined
        }
        onSuccess={() => {
          setIsCreateDialogOpen(false);
          setPreSelectedTopicId(null);
          refetchCBTs();
          // Clear URL params after success
          router.replace("/library-owner/resources/assessment");
        }}
      />

      {selectedCBT && (
        <>
          <EditCBTDialog
            isOpen={isEditDialogOpen}
            onClose={() => {
              setIsEditDialogOpen(false);
              setSelectedCBT(null);
            }}
            cbt={selectedCBT}
            onSuccess={() => {
              setIsEditDialogOpen(false);
              setSelectedCBT(null);
              refetchCBTs();
            }}
          />

          <DeleteCBTDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false);
              setSelectedCBT(null);
            }}
            cbt={selectedCBT}
            onSuccess={() => {
              setIsDeleteDialogOpen(false);
              setSelectedCBT(null);
              refetchCBTs();
            }}
          />

          <ManageQuestionsDialog
            isOpen={isManageQuestionsOpen}
            onClose={() => {
              setIsManageQuestionsOpen(false);
              setSelectedCBT(null);
            }}
            cbt={selectedCBT}
          />
        </>
      )}
    </div>
  );
};

export default AssessmentsPage;

