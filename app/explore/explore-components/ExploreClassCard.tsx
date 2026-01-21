"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ExploreClass {
  id: string;
  name: string;
  order: number;
  subjectsCount: number;
}

interface ExploreClassCardProps {
  classItem: ExploreClass;
}

export const ExploreClassCard = ({ classItem }: ExploreClassCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/explore/class/${classItem.id}`);
  };

  return (
    <Card 
      className="shadow-sm bg-white hover:shadow-md transition-all cursor-pointer border border-brand-border hover:border-brand-primary"
      onClick={handleClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-brand-heading text-base">
            {classItem.name}
          </h3>
          <ArrowRight className="h-4 w-4 text-brand-light-accent-1" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <BookOpen className="h-3.5 w-3.5 text-brand-primary" />
          </div>
          <p className="text-xs text-brand-light-accent-1 mb-0.5">Subjects</p>
          <p className="text-sm font-semibold text-brand-heading">
            {classItem.subjectsCount}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
