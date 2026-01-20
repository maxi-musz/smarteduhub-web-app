import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolsStatistics } from "@/hooks/library-owner/use-library-owner-schools";

interface SchoolsBreakdownProps {
  statistics: SchoolsStatistics;
}

export const SchoolsBreakdown = ({ statistics }: SchoolsBreakdownProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Schools by Status */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-brand-heading">
            Schools by Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Approved</span>
            <span className="font-semibold text-green-600">
              {statistics.schoolsByStatus.approved}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Pending</span>
            <span className="font-semibold text-yellow-600">
              {statistics.schoolsByStatus.pending}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Rejected</span>
            <span className="font-semibold text-red-600">
              {statistics.schoolsByStatus.rejected}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Suspended</span>
            <span className="font-semibold text-orange-600">
              {statistics.schoolsByStatus.suspended}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Closed</span>
            <span className="font-semibold text-gray-600">
              {statistics.schoolsByStatus.closed}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Schools by Type */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-brand-heading">
            Schools by Type
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Primary</span>
            <span className="font-semibold text-brand-heading">
              {statistics.schoolsByType.primary}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Secondary</span>
            <span className="font-semibold text-brand-heading">
              {statistics.schoolsByType.secondary}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">
              Primary & Secondary
            </span>
            <span className="font-semibold text-brand-heading">
              {statistics.schoolsByType.primary_and_secondary}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Schools by Ownership */}
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-brand-heading">
            Schools by Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Government</span>
            <span className="font-semibold text-brand-heading">
              {statistics.schoolsByOwnership.government}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brand-light-accent-1">Private</span>
            <span className="font-semibold text-brand-heading">
              {statistics.schoolsByOwnership.private}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

