import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LibraryOwnerDashboardResponse } from "@/hooks/library-owner/use-library-owner-dashboard";
import { Video, FileText, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  myActivity: LibraryOwnerDashboardResponse["myActivity"];
}

export const RecentActivity = ({ myActivity }: RecentActivityProps) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="px-6">
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <CardTitle>My Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Recent Videos */}
            <div>
              <h3 className="text-sm font-semibold text-brand-heading mb-3 flex items-center gap-2">
                <Video className="h-4 w-4 text-brand-primary" />
                Recent Videos ({myActivity.recentVideos.length})
              </h3>
              <div className="space-y-2">
                {myActivity.recentVideos.length > 0 ? (
                  myActivity.recentVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-heading">
                          {video.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              video.status === "published"
                                ? "bg-green-100 text-green-700"
                                : video.status === "draft"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {video.status}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-brand-light-accent-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(video.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-brand-light-accent-1 text-center py-4">
                    No recent videos
                  </p>
                )}
              </div>
            </div>

            {/* Recent Materials */}
            <div>
              <h3 className="text-sm font-semibold text-brand-heading mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-primary" />
                Recent Materials ({myActivity.recentMaterials.length})
              </h3>
              <div className="space-y-2">
                {myActivity.recentMaterials.length > 0 ? (
                  myActivity.recentMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-heading">
                          {material.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              material.status === "published"
                                ? "bg-green-100 text-green-700"
                                : material.status === "draft"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {material.status}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-brand-light-accent-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(material.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-brand-light-accent-1 text-center py-4">
                    No recent materials
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

