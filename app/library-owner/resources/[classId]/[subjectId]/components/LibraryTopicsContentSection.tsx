"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TopicsList } from "@/app/general-pages/subjects/[id]/components/topics/TopicsList";
import { LibraryTopicContent } from "./LibraryTopicContent";
import { LibraryEditTopicModal } from "./LibraryEditTopicModal";
import { LibraryDeleteTopicDialog } from "./LibraryDeleteTopicDialog";

interface LibraryTopic {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  order: number;
  status: string;
  is_active: boolean;
}

interface LibraryTopicsContentSectionProps {
  topics: LibraryTopic[];
  selectedTopicId: string | null;
  onTopicSelect: (topicId: string | null) => void;
  onAddTopic?: () => void;
  subjectId: string;
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
  canUpload?: boolean;
}

export const LibraryTopicsContentSection = ({
  topics,
  selectedTopicId,
  onTopicSelect,
  onAddTopic,
  subjectId,
  canEdit = true,
  canDelete = true,
  canCreate = true,
  canUpload = true,
}: LibraryTopicsContentSectionProps) => {
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

  // Transform library topics to match TopicsList interface
  const transformedTopics = topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    order: topic.order,
    status: topic.is_active ? "active" : "inactive",
  }));

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
              topics={transformedTopics}
              selectedTopicId={selectedTopicId}
              onTopicSelect={onTopicSelect}
              onTopicEdit={canEdit ? handleEdit : undefined}
              onTopicDelete={canDelete ? handleDelete : undefined}
            />
            <LibraryTopicContent 
              topicId={selectedTopicId} 
              subjectId={subjectId}
              canUpload={canUpload}
            />
          </div>
        </CardContent>
      </Card>

      {canEdit && editTopicId && editingTopic && (
        <LibraryEditTopicModal
          isOpen={!!editTopicId}
          onClose={() => setEditTopicId(null)}
          topicId={editTopicId}
          subjectId={subjectId}
          totalTopics={topics.length}
          currentOrder={editingTopic.order}
        />
      )}

      {canDelete && deleteTopic && (
        <LibraryDeleteTopicDialog
          isOpen={!!deleteTopic}
          onClose={handleDeleteClose}
          topicId={deleteTopic.id}
          topicTitle={deleteTopic.title}
        />
      )}
    </>
  );
};
