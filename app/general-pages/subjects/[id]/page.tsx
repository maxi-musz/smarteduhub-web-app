"use client";

import React, { useState, useEffect } from "react";
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation";
import { useComprehensiveSubject } from "@/hooks/subjects/use-subjects";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { useSession } from "next-auth/react";
import { getRolePermissions } from "@/lib/role-permissions";
// Import components from shared location
import { CreateTopicModal } from "./components/topics/CreateTopicModal";
import { SubjectHeader } from "./components/SubjectHeader";
import { SubjectDescription } from "./components/SubjectDescription";
import { SubjectStatsCards } from "./components/SubjectStatsCards";
import { TopicsContentSection } from "./components/topics/TopicsContentSection";

const SubjectDetailPage = () => {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const subjectId = params.id as string;
  
  // Get selected topic from URL params, fallback to null
  const topicIdFromUrl = searchParams.get("topicId");
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(topicIdFromUrl);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  
  // Sync URL params with state when URL changes (e.g., when coming back from video player)
  useEffect(() => {
    const urlTopicId = searchParams.get("topicId");
    if (urlTopicId !== selectedTopicId) {
      setSelectedTopicId(urlTopicId);
    }
  }, [searchParams, selectedTopicId]);
  
  // Update URL when topic selection changes
  const handleTopicSelect = (topicId: string | null) => {
    setSelectedTopicId(topicId);
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (topicId) {
      current.set("topicId", topicId);
    } else {
      current.delete("topicId");
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  };
  const page = 1;
  const limit = 10;

  const role = session?.user?.role as string | undefined;
  const permissions = getRolePermissions(role);

  const { data, isLoading, error } = useComprehensiveSubject({
    subjectId,
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-brand-primary mx-auto mb-4" />
            <p className="text-brand-light-accent-1">Loading subject details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage = "Failed to load subject details";
    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.statusCode === 404) {
        errorMessage = "Subject not found";
      } else {
        errorMessage = error.message;
      }
    }

    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No subject data available</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const { subject, topics, stats } = data;

  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      <SubjectHeader
        name={subject.name}
        code={subject.code}
        status={subject.status}
        color={subject.color}
      />

      <SubjectDescription description={subject.description || ""} />

      <SubjectStatsCards
        totalTopics={stats.totalTopics}
        totalVideos={stats.totalVideos}
        totalMaterials={stats.totalMaterials}
        totalStudents={stats.totalStudents}
        progress={subject.progress}
      />

      <TopicsContentSection
        topics={topics}
        selectedTopicId={selectedTopicId}
        onTopicSelect={handleTopicSelect}
        onAddTopic={permissions.canCreate ? () => setIsCreateTopicModalOpen(true) : undefined}
        subjectId={subjectId}
        canEdit={permissions.canEdit}
        canDelete={permissions.canDelete}
        canCreate={permissions.canCreate}
        canUpload={permissions.canUpload}
      />

      {permissions.canCreate && (
        <CreateTopicModal
          isOpen={isCreateTopicModalOpen}
          onClose={() => setIsCreateTopicModalOpen(false)}
          subjectId={subjectId}
        />
      )}
    </div>
  );
};

export default SubjectDetailPage;

