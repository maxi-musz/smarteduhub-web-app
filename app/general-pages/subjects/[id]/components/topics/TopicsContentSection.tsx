"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TopicsList } from "./TopicsList";
import { TopicContent } from "./TopicContent";
import { EditTopicModal } from "./EditTopicModal";
import { DeleteTopicDialog } from "./DeleteTopicDialog";

interface Topic {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  order: number;
  status: string;
  videos: Array<{
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    url: string;
    views: number;
    size: string;
  }>;
  materials: Array<{
    id: string;
    title: string;
    type: string;
    size: string;
    url: string;
    downloads: number;
  }>;
}

interface TopicsContentSectionProps {
  topics: Topic[];
  selectedTopicId: string | null;
  onTopicSelect: (topicId: string | null) => void;
  onAddTopic?: () => void;
  subjectId: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
  canUpload?: boolean;
}

export const TopicsContentSection = ({
  topics,
  selectedTopicId,
  onTopicSelect,
  onAddTopic,
  subjectId,
  canEdit = true,
  canDelete = true,
  canCreate = true,
  canUpload = true,
}: TopicsContentSectionProps) => {
  const [editTopicId, setEditTopicId] = useState<string | null>(null);
  const [deleteTopic, setDeleteTopic] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Find the topic being edited to get its current order
  const editingTopic = editTopicId
    ? topics.find((t) => t.id === editTopicId)
    : null;

  const handleEdit = (topicId: string) => {
    setEditTopicId(topicId);
  };

  const handleDelete = (topicId: string, topicTitle: string) => {
    setDeleteTopic({ id: topicId, title: topicTitle });
  };

  const handleDeleteClose = () => {
    const deletedTopicId = deleteTopic?.id;
    setDeleteTopic(null);
    // If deleted topic was selected, clear selection
    if (deletedTopicId && selectedTopicId === deletedTopicId) {
      onTopicSelect(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Topics & Content</CardTitle>
            {canCreate && onAddTopic && (
              <Button size="sm" variant="outline" onClick={onAddTopic}>
                <Plus className="h-4 w-4 mr-1" />
                Add Topic
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TopicsList
              topics={topics}
              selectedTopicId={selectedTopicId}
              onTopicSelect={onTopicSelect}
              onTopicEdit={canEdit ? handleEdit : undefined}
              onTopicDelete={canDelete ? handleDelete : undefined}
            />
            <TopicContent 
              topicId={selectedTopicId} 
              subjectId={subjectId}
              canUpload={canUpload}
            />
          </div>
        </CardContent>
      </Card>

      {canEdit && editTopicId && editingTopic && (
        <EditTopicModal
          isOpen={!!editTopicId}
          onClose={() => setEditTopicId(null)}
          topicId={editTopicId}
          subjectId={subjectId}
          totalTopics={topics.length}
          currentOrder={editingTopic.order}
        />
      )}

      {canDelete && deleteTopic && (
        <DeleteTopicDialog
          isOpen={!!deleteTopic}
          onClose={handleDeleteClose}
          topicId={deleteTopic.id}
          topicTitle={deleteTopic.title}
        />
      )}
    </>
  );
};

