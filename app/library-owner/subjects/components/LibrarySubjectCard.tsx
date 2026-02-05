"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Settings,
  Pencil,
  Video,
  Layers,
  Trash2,
} from "lucide-react";
import { AIAgentLogo } from "@/components/AIAgentLogo";
import { useRouter } from "next/navigation";
import { LibrarySubject } from "@/hooks/library-owner/use-library-subjects";
import Image from "next/image";

interface LibrarySubjectCardProps {
  subject: LibrarySubject;
  onAIClick?: (subjectName: string) => void;
  onClick?: () => void;
  onEdit?: (subject: LibrarySubject) => void;
  onDelete?: (subject: LibrarySubject) => void;
}

export const LibrarySubjectCard = ({
  subject,
  onAIClick,
  onClick,
  onEdit,
  onDelete,
}: LibrarySubjectCardProps) => {
  const router = useRouter();

  const handleManageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/library-owner/subjects/${subject.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(subject);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(subject);
  };

  const topicsCount = subject.topicsCount ?? subject.topics?.length ?? 0;

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-2"
        style={{ backgroundColor: subject.color || "#6B7280" }}
      />
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            {/* Thumbnail */}
            {subject.thumbnailUrl ? (
              <div className="relative w-12 h-16 rounded-md overflow-hidden border border-brand-border flex-shrink-0 bg-gray-100">
                <Image
                  src={subject.thumbnailUrl}
                  alt={subject.name}
                  fill
                  className="object-contain"
                  unoptimized={subject.thumbnailUrl.includes("s3.amazonaws.com")}
                  sizes="48px"
                />
              </div>
            ) : (
              <div
                className="w-12 h-16 rounded-md flex-shrink-0 flex items-center justify-center text-white font-semibold border border-brand-border"
                style={{ backgroundColor: subject.color || "#6B7280" }}
              >
                <span className="text-xs font-bold leading-tight text-center">
                  {subject.code ||
                    subject.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 3)}
                </span>
              </div>
            )}
            <div>
              <h3 className="capitalize text-base">{subject.name}</h3>
              {subject.code && (
                <p className="text-sm font-normal text-muted-foreground">
                  {subject.code}
                </p>
              )}
              {subject.className && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {subject.className}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={handleEditClick}
                className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                aria-label="Edit subject"
                title="Edit subject"
              >
                <Pencil className="h-4 w-4 text-brand-light-accent-1" />
              </button>
            )}
            {onAIClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAIClick(subject.name);
                }}
                className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                style={{ color: subject.color || "#6B7280" }}
                aria-label="AI Assistant"
              >
                <AIAgentLogo size="sm" />
              </button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList
            className="grid w-full grid-cols-2 mb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Topics</span>
                </div>
                <span className="font-medium">{topicsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Videos</span>
                </div>
                <span className="font-medium">{subject.totalVideos || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Materials</span>
                </div>
                <span className="font-medium">{subject.totalMaterials || 0}</span>
              </div>
            </div>

            {/* Description */}
            {subject.description && (
              <div className="pt-3 border-t">
                <p className="text-sm text-muted-foreground capitalize line-clamp-2">
                  {subject.description}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="topics" className="space-y-3">
            {subject.topics && subject.topics.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {subject.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {topic.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Order: {topic.order}
                      </p>
                    </div>
                    <Badge
                      variant={topic.is_active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {topic.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No topics available
              </p>
            )}
          </TabsContent>
        </Tabs>
        <div className="mt-4 pt-4 border-t flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManageClick}
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage
          </Button>
          {onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="h-9 w-9 rounded-md border border-red-200 hover:bg-red-50 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
              aria-label="Delete subject"
              title="Delete subject"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
