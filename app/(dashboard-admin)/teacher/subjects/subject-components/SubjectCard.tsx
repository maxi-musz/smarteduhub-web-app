"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  FileText,
  ClipboardList,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import { AIAgentLogo } from "@/components/AIAgentLogo";
import type { SubjectDashboardItem } from "@/hooks/use-teacher-data";

interface SubjectCardProps {
  subject: SubjectDashboardItem;
  onAIClick?: (subjectName: string) => void;
}

export const SubjectCard = ({ subject, onAIClick }: SubjectCardProps) => {
  const formatDay = (day: string) => {
    const dayMap: Record<string, string> = {
      MONDAY: "Monday",
      TUESDAY: "Tuesday",
      WEDNESDAY: "Wednesday",
      THURSDAY: "Thursday",
      FRIDAY: "Friday",
      SATURDAY: "Saturday",
      SUNDAY: "Sunday",
    };
    return dayMap[day] || day;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
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
              onClick={() => onAIClick(subject.name)}
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
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Content Counts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Videos</span>
                </div>
                <span className="font-medium">
                  {subject.contentCounts.totalVideos}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Materials</span>
                </div>
                <span className="font-medium">
                  {subject.contentCounts.totalMaterials}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Assignments</span>
                </div>
                <span className="font-medium">
                  {subject.contentCounts.totalAssignments}
                </span>
              </div>
            </div>

            {/* Classes Taking Subject */}
            {subject.classesTakingSubject.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Classes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subject.classesTakingSubject.map((classItem) => (
                    <Badge key={classItem.id} variant="outline" className="text-xs">
                      {classItem.name}
                    </Badge>
                  ))}
                </div>
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

          <TabsContent value="schedule" className="space-y-3">
            {subject.timetableEntries.length > 0 ? (
              subject.timetableEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {formatDay(entry.day_of_week)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.class.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {entry.startTime} - {entry.endTime}
                      </span>
                    </div>
                    {entry.room && (
                      <p className="text-xs text-muted-foreground">
                        {entry.room}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No schedule entries
              </p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};


