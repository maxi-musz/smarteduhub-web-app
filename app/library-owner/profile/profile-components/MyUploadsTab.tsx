"use client";

import { Video, FileText, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LibraryOwnerProfileResponse } from "@/hooks/library-owner/use-library-owner-profile";
import { formatDate, formatFileSize, formatDuration } from "./utils";

interface MyUploadsTabProps {
  uploads: LibraryOwnerProfileResponse["myUploads"];
}

export const MyUploadsTab = ({ uploads }: MyUploadsTabProps) => {
  const { videos, materials } = uploads;

  return (
    <div className="mt-6 space-y-6">
      {/* Videos Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Video className="h-5 w-5 text-purple-600" />
          My Videos ({videos.length})
        </h3>
        {videos.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No videos uploaded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {videos.map((video) => (
              <Card key={video.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg mb-1">{video.title}</h4>
                      {video.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {video.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatDuration(video.durationSeconds)}</span>
                        <span>{formatFileSize(video.sizeBytes)}</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(video.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        video.status === "published"
                          ? "default"
                          : video.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className="ml-4 capitalize"
                    >
                      {video.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Materials Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          My Materials ({materials.length})
        </h3>
        {materials.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No materials uploaded yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <Card key={material.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg mb-1">{material.title}</h4>
                      {material.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {material.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <Badge variant="outline">{material.materialType}</Badge>
                        <span>{formatFileSize(material.sizeBytes)}</span>
                        {material.pageCount > 0 && (
                          <span>{material.pageCount} pages</span>
                        )}
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(material.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        material.status === "published"
                          ? "default"
                          : material.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                      className="ml-4 capitalize"
                    >
                      {material.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
