import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const SubjectDetailSkeleton = () => {
  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Subject Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Topics & Content Section Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
            <div className="h-9 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topics List Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Panel Skeleton */}
            <div className="lg:col-span-2">
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-gray-200 rounded-lg p-8">
                <div className="h-24 w-24 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-64"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
