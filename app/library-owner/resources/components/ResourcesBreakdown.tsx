import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResourcesStatistics } from "@/hooks/use-library-owner-resources";

interface ResourcesBreakdownProps {
  statistics: ResourcesStatistics;
}

export const ResourcesBreakdown = ({ statistics }: ResourcesBreakdownProps) => {
  return (
    <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Videos Breakdown */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-brand-heading">
            Videos Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Total</span>
            <span className="font-semibold text-brand-heading">
              {statistics.videos.total}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Published</span>
            <span className="font-semibold text-green-600">
              {statistics.videos.published}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Draft</span>
            <span className="font-semibold text-yellow-600">
              {statistics.videos.draft}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Archived</span>
            <span className="font-semibold text-gray-600">
              {statistics.videos.archived}
            </span>
          </div>
          {statistics.videos.byPlatform && Object.keys(statistics.videos.byPlatform).length > 0 && (
            <div className="pt-2 border-t border-brand-border">
              <p className="text-xs text-brand-light-accent-1 mb-2">By Platform:</p>
              {Object.entries(statistics.videos.byPlatform).map(([platform, count]) => (
                <div key={platform} className="flex justify-between items-center text-xs">
                  <span className="text-brand-light-accent-1">{platform}</span>
                  <span className="font-semibold text-brand-heading">{count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Materials Breakdown */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-brand-heading">
            Materials Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Total</span>
            <span className="font-semibold text-brand-heading">
              {statistics.materials.total}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Published</span>
            <span className="font-semibold text-green-600">
              {statistics.materials.published}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Draft</span>
            <span className="font-semibold text-yellow-600">
              {statistics.materials.draft}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Archived</span>
            <span className="font-semibold text-gray-600">
              {statistics.materials.archived}
            </span>
          </div>
          {statistics.materials.byType && Object.keys(statistics.materials.byType).length > 0 && (
            <div className="pt-2 border-t border-brand-border">
              <p className="text-xs text-brand-light-accent-1 mb-2">By Type:</p>
              {Object.entries(statistics.materials.byType).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center text-xs">
                  <span className="text-brand-light-accent-1">{type}</span>
                  <span className="font-semibold text-brand-heading">{count}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contributors */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-brand-heading">
            Contributors
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Total Uploaders</span>
            <span className="font-semibold text-brand-heading">
              {statistics.contributors.totalUniqueUploaders}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Video Uploaders</span>
            <span className="font-semibold text-brand-heading">
              {statistics.contributors.videoUploaders}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Material Uploaders</span>
            <span className="font-semibold text-brand-heading">
              {statistics.contributors.materialUploaders}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

