import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LibraryOwnerDashboardResponse } from "@/hooks/use-library-owner-dashboard";
import { Building2, BookOpen, Tag } from "lucide-react";

interface LibraryInfoProps {
  library: LibraryOwnerDashboardResponse["library"];
}

export const LibraryInfo = ({ library }: LibraryInfoProps) => {
  return (
    <div className="px-6">
      <Card className="shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand-primary" />
            <CardTitle>{library.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-brand-light-accent-1">{library.description}</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-primary" />
                <span className="text-sm text-brand-light-accent-1">
                  <span className="font-medium text-brand-heading">
                    {library.subjectsCount}
                  </span>{" "}
                  Subjects
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-brand-primary" />
                <span className="text-sm text-brand-light-accent-1">
                  <span className="font-medium text-brand-heading">
                    {library.topicsCount}
                  </span>{" "}
                  Topics
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

