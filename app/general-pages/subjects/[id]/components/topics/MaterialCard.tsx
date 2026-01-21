"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";

interface MaterialItem {
  id: string;
  title: string;
  type: string;
  size: string;
  url: string;
  downloads: number;
}

interface MaterialCardProps {
  material: MaterialItem;
  subjectId: string;
  topicId: string;
}

export const MaterialCard = ({ material, subjectId, topicId }: MaterialCardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine base path based on current route
  const getBasePath = () => {
    if (pathname.startsWith("/teacher")) return "/teacher";
    if (pathname.startsWith("/admin")) return "/admin";
    if (pathname.startsWith("/student")) return "/student";
    return "/general-pages";
  };

  const handleCardClick = () => {
    const basePath = getBasePath();
    router.push(`${basePath}/subjects/${subjectId}/materials/${material.id}?topicId=${topicId}`);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (material.url) {
      window.open(material.url, "_blank");
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-green-100 rounded">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold capitalize">{material.title}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                <Badge variant="outline" className="text-xs">
                  {material.type.toUpperCase()}
                </Badge>
                <span>{material.size}</span>
                <span className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {material.downloads} downloads
                </span>
              </div>
            </div>
          </div>
          <Button 
            size="icon" 
            variant="outline" 
            title="Download material"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

