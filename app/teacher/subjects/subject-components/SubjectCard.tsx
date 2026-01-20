"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Calendar,
} from "lucide-react";
import { AIAgentLogo } from "@/components/AIAgentLogo";
import type { TeacherSubject } from "@/hooks/teacher/use-teacher-subjects";

interface SubjectCardProps {
  subject: TeacherSubject;
  onAIClick?: (subjectName: string) => void;
  onClick?: () => void;
}

export const SubjectCard = ({ subject, onAIClick, onClick }: SubjectCardProps) => {
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
          <div>
            <h3 className="capitalize">{subject.name}</h3>
            {subject.code && (
              <p className="text-sm font-normal text-muted-foreground">
                {subject.code}
              </p>
            )}
          </div>
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
          {/* Topics Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Topics</span>
              </div>
              <span className="font-medium">
                {subject.topics?.length ?? 0}
              </span>
            </div>
          </div>

          {/* Academic Session */}
          {subject.academicSession && (
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Academic Session</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {subject.academicSession.academic_year} • {subject.academicSession.term} Term
              </p>
            </div>
          )}

          {/* Description */}
          {subject.description && (
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground capitalize">
                {subject.description}
              </p>
            </div>
          )}
        </TabsContent>

          <TabsContent value="topics" className="space-y-3">
          {subject.topics && subject.topics.length > 0 ? (
            <div className="space-y-2">
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
                  <Badge variant={topic.is_active ? "default" : "secondary"} className="text-xs">
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
      </CardContent>
    </Card>
  );
};


