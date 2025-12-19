import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LibraryOwnerDashboardResponse } from "@/hooks/use-library-owner-dashboard";
import { Video, FileText, Users } from "lucide-react";

interface StatisticsGridProps {
  statistics: LibraryOwnerDashboardResponse["statistics"];
}

export const StatisticsGrid = ({ statistics }: StatisticsGridProps) => {
  return (
    <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Videos Statistics */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-brand-primary" />
            <CardTitle>Video Statistics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Total</span>
              <span className="text-lg font-semibold text-brand-heading">
                {statistics.videos.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Published</span>
              <span className="text-lg font-semibold text-green-600">
                {statistics.videos.published}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Draft</span>
              <span className="text-lg font-semibold text-yellow-600">
                {statistics.videos.draft}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Archived</span>
              <span className="text-lg font-semibold text-gray-600">
                {statistics.videos.archived}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Statistics */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-primary" />
            <CardTitle>Material Statistics</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Total</span>
              <span className="text-lg font-semibold text-brand-heading">
                {statistics.materials.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Published</span>
              <span className="text-lg font-semibold text-green-600">
                {statistics.materials.published}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Draft</span>
              <span className="text-lg font-semibold text-yellow-600">
                {statistics.materials.draft}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-brand-light-accent-1">Archived</span>
              <span className="text-lg font-semibold text-gray-600">
                {statistics.materials.archived}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-brand-light-accent-1 mb-2">
                By Type:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(statistics.materials.byType).map(
                  ([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-brand-light-accent-1">{type}</span>
                      <span className="font-medium text-brand-heading">
                        {count}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contributors Statistics */}
      <Card className="shadow-sm bg-white lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-primary" />
            <CardTitle>Contributors</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-brand-heading">
                {statistics.contributors.totalUniqueUploaders}
              </div>
              <div className="text-sm text-brand-light-accent-1 mt-1">
                Total Contributors
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-brand-heading">
                {statistics.contributors.videoUploaders}
              </div>
              <div className="text-sm text-brand-light-accent-1 mt-1">
                Video Uploaders
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-brand-heading">
                {statistics.contributors.materialUploaders}
              </div>
              <div className="text-sm text-brand-light-accent-1 mt-1">
                Material Uploaders
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

