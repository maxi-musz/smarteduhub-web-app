"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopicsList } from "@/app/general-pages/subjects/[id]/components/topics/TopicsList";
import { ExploreTopicContent } from "./ExploreTopicContent";

interface ExploreTopic {
  id: string;
  title: string;
  description: string | null;
  order: number;
  is_active: boolean;
  videos: Array<{
    id: string;
    title: string;
    description: string | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    durationSeconds: number | null;
    sizeBytes: number | null;
    views: number;
    order: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    uploadedBy?: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  }>;
  materials: Array<{
    id: string;
    title: string;
    description: string | null;
    url: string;
    s3Key: string | null;
    materialType: string;
    sizeBytes: number | null;
    pageCount: number | null;
    status: string;
    order: number;
    createdAt: string;
    updatedAt: string;
    uploadedBy: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
  }>;
  assessments: Array<{
    id: string;
    title: string;
    description: string | null;
    duration: number;
    passingScore: number;
    status: string;
    questionsCount: number;
    createdAt: string;
    updatedAt: string;
  }>;
  submissions: Array<{
    id: string;
    assessmentId: string;
    assessmentTitle: string;
    attemptNumber: number;
    status: string;
    dateTaken: string;
    totalQuestions: number;
    maxScore: number;
    userScore: number;
    percentage: number;
    passed: boolean;
    timeSpent: number;
    passingScore: number;
  }>;
  statistics: {
    videosCount: number;
    materialsCount: number;
    assessmentsCount: number;
    totalViews: number;
    totalDuration: number;
    totalVideoSize: number;
    totalMaterialSize: number;
    totalSize: number;
    totalQuestions: number;
  };
}

interface ExploreTopicsContentSectionProps {
  topics: ExploreTopic[];
  selectedTopicId: string | null;
  onTopicSelect: (topicId: string | null) => void;
  subjectId: string;
}

export const ExploreTopicsContentSection = ({
  topics,
  selectedTopicId,
  onTopicSelect,
  subjectId,
}: ExploreTopicsContentSectionProps) => {
  // Transform explore topics to match TopicsList interface
  const transformedTopics = topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    order: topic.order,
    status: topic.is_active ? "active" : "inactive",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics & Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TopicsList
            topics={transformedTopics}
            selectedTopicId={selectedTopicId}
            onTopicSelect={(topicId) => onTopicSelect(topicId)}
          />
          <ExploreTopicContent 
            topicId={selectedTopicId} 
            subjectId={subjectId}
            topics={topics}
          />
        </div>
      </CardContent>
    </Card>
  );
};
