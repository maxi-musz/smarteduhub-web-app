import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ClassResourcesSkeleton = () => {
  return (
    <div className="py-6 space-y-6 bg-brand-bg">
      {/* Header Skeleton */}
      <div className="px-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subjects Skeleton */}
      <div className="px-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-sm bg-white">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2].map((j) => (
                  <div key={j} className="p-3 border border-gray-200 rounded-lg">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

