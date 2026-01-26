"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Video, BookOpen } from "lucide-react";

// Color palette for order badges - cycles through appealing colors
const getOrderBadgeColors = (order: number) => {
  const colors = [
    { bg: "bg-blue-500", text: "text-white" },
    { bg: "bg-purple-500", text: "text-white" },
    { bg: "bg-pink-500", text: "text-white" },
    { bg: "bg-indigo-500", text: "text-white" },
    { bg: "bg-teal-500", text: "text-white" },
    { bg: "bg-orange-500", text: "text-white" },
    { bg: "bg-cyan-500", text: "text-white" },
    { bg: "bg-emerald-500", text: "text-white" },
    { bg: "bg-rose-500", text: "text-white" },
    { bg: "bg-amber-500", text: "text-white" },
    { bg: "bg-violet-500", text: "text-white" },
    { bg: "bg-sky-500", text: "text-white" },
  ];
  return colors[(order - 1) % colors.length];
};

interface Topic {
  id: string;
  title: string;
  order: number;
  status: string;
  resourceCounts?: {
    totalVideos: number;
    totalMaterials: number;
    totalLinks: number;
    totalAssignments: number;
    totalResources: number;
  };
}

interface TopicsListProps {
  topics: Topic[];
  selectedTopicId: string | null;
  onTopicSelect: (topicId: string) => void;
  onTopicEdit?: (topicId: string) => void;
  onTopicDelete?: (topicId: string, topicTitle: string) => void;
}

export const TopicsList = ({
  topics,
  selectedTopicId,
  onTopicSelect,
  onTopicEdit,
  onTopicDelete,
}: TopicsListProps) => {
  return (
    <div className="lg:col-span-1">
      <h3 className="font-semibold mb-4">Topics ({topics.length})</h3>
      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {topics.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No topics available
          </p>
        ) : (
          topics.map((topic) => {
            const orderColors = getOrderBadgeColors(topic.order);
            return (
              <div
                key={topic.id}
                className={`group rounded-lg border transition-colors ${
                  selectedTopicId === topic.id
                    ? "bg-brand-primary border-brand-primary"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
              >
                <button
                  onClick={() => onTopicSelect(topic.id)}
                  className="w-full text-left p-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* Order badge - colored square */}
                      <div
                        className={`${orderColors.bg} ${orderColors.text} flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-semibold`}
                      >
                        {topic.order}
                      </div>
                      {/* Topic title */}
                      <p
                        className={`font-medium capitalize truncate ${
                          selectedTopicId === topic.id ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {topic.title}
                      </p>
                      {/* Resource counts - tiny icons */}
                      {topic.resourceCounts && (
                        <div className="flex items-center gap-1.5 ml-1 flex-shrink-0">
                          {topic.resourceCounts.totalVideos > 0 && (
                            <div 
                              className={`flex items-center gap-0.5 ${
                                selectedTopicId === topic.id ? "text-white/80" : "text-gray-500"
                              }`}
                              title={`${topic.resourceCounts.totalVideos} videos`}
                            >
                              <Video className="h-2.5 w-2.5" />
                              <span className="text-[10px] leading-none">{topic.resourceCounts.totalVideos}</span>
                            </div>
                          )}
                          {topic.resourceCounts.totalMaterials > 0 && (
                            <div 
                              className={`flex items-center gap-0.5 ${
                                selectedTopicId === topic.id ? "text-white/80" : "text-gray-500"
                              }`}
                              title={`${topic.resourceCounts.totalMaterials} materials`}
                            >
                              <BookOpen className="h-2.5 w-2.5" />
                              <span className="text-[10px] leading-none">{topic.resourceCounts.totalMaterials}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Status badge */}
                      <Badge
                        variant={topic.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {topic.status}
                      </Badge>
                      {/* Action buttons - smaller and inline - only show if handlers provided */}
                      {onTopicEdit && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-5 w-5 p-0 flex-shrink-0 ${
                            selectedTopicId === topic.id
                              ? "text-white hover:bg-white/20"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTopicEdit(topic.id);
                          }}
                          title="Edit topic"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      )}
                      {onTopicDelete && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`h-5 w-5 p-0 flex-shrink-0 ${
                            selectedTopicId === topic.id
                              ? "text-white hover:bg-white/20"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTopicDelete(topic.id, topic.title);
                          }}
                          title="Delete topic"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

