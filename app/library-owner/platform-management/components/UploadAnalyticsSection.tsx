"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, Users, Video, FileText, Link2, BookOpen, ClipboardList } from "lucide-react";
import { useUploadAnalytics } from "@/hooks/library-owner/use-library-users";
import type { UploadAnalyticsResponse } from "@/hooks/library-owner/use-library-users-types";
import { formatDistanceToNow } from "date-fns";

export function UploadAnalyticsSection() {
  const { data, isLoading, error } = useUploadAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-sm animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="shadow-sm animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardContent className="py-8 text-center text-brand-light-accent-1">
          Unable to load upload analytics. You may not have permission to view this section.
        </CardContent>
      </Card>
    );
  }

  const d = data as UploadAnalyticsResponse;
  const byType = d.byType ?? {};
  const uploadsByUser = d.uploadsByUser ?? [];
  const recentUploads = d.recentUploads ?? [];

  const typeStats = [
    { label: "Videos", value: byType.videos ?? 0, icon: Video },
    { label: "Materials", value: byType.materials ?? 0, icon: FileText },
    { label: "Assignments", value: byType.assignments ?? 0, icon: ClipboardList },
    { label: "Links", value: byType.links ?? 0, icon: Link2 },
    { label: "General materials", value: byType.generalMaterials ?? 0, icon: BookOpen },
    { label: "Assessments", value: byType.assessments ?? 0, icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-brand-primary" />
        <h2 className="text-lg font-semibold text-brand-heading">Upload analytics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-brand-light-accent-1">Uploaders</span>
            <Users className="h-5 w-5 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-heading">{d.uploadersCount ?? 0}</div>
          </CardContent>
        </Card>
        {typeStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-brand-light-accent-1">{stat.label}</span>
                <Icon className="h-5 w-5 text-brand-primary/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-heading">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {uploadsByUser.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Uploads by user</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-brand-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Videos</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead>Assessments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadsByUser.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.first_name} {u.last_name}
                      </TableCell>
                      <TableCell className="text-brand-light-accent-1">{u.email}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell>{u.counts?.uploadedVideos ?? 0}</TableCell>
                      <TableCell>{u.counts?.uploadedMaterials ?? 0}</TableCell>
                      <TableCell>{u.counts?.createdAssessments ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {recentUploads.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent uploads</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentUploads.slice(0, 10).map((item, idx) => (
                <li
                  key={`${item.resourceType}-${item.resourceId}-${idx}`}
                  className="flex items-center justify-between py-2 border-b border-brand-border last:border-0 text-sm"
                >
                  <span className="text-brand-heading">
                    {item.title ?? `${item.resourceType} (${item.resourceId})`}
                  </span>
                  <span className="text-brand-light-accent-1">
                    {item.uploadedBy?.first_name} {item.uploadedBy?.last_name} ·{" "}
                    {item.createdAt
                      ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
                      : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {uploadsByUser.length === 0 && recentUploads.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="py-8 text-center text-brand-light-accent-1">
            No upload activity yet.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
