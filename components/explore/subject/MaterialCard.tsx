"use client";

import { LibraryMaterial } from "@/hooks/explore/use-explore";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, User, File } from "lucide-react";
import { formatFileSize } from "@/lib/utils/explore";
import { Badge } from "@/components/ui/badge";

interface MaterialCardProps {
  material: LibraryMaterial;
  onDownload?: () => void;
}

const getMaterialIcon = (materialType: string) => {
  const type = materialType.toUpperCase();
  if (type === "PDF") return "📕";
  if (type === "DOC" || type === "DOCX") return "📘";
  if (type === "PPT" || type === "PPTX") return "📊";
  if (type === "XLS" || type === "XLSX") return "📗";
  if (type === "TXT") return "📄";
  return "📄";
};

export function MaterialCard({ material, onDownload }: MaterialCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      window.open(material.url, "_blank");
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md card-hover">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Material Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center text-2xl">
            {getMaterialIcon(material.materialType)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-brand-heading mb-1 line-clamp-2">
              {material.title}
            </h3>
            
            {material.description && (
              <p className="text-sm text-brand-light-accent-1 mb-2 line-clamp-2">
                {material.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-brand-light-accent-1 mb-3">
              <Badge variant="outline" className="text-xs">
                {material.materialType}
              </Badge>
              {material.pageCount && (
                <>
                  <span>•</span>
                  <span>{material.pageCount} pages</span>
                </>
              )}
              {material.sizeBytes && (
                <>
                  <span>•</span>
                  <span>{formatFileSize(material.sizeBytes)}</span>
                </>
              )}
              {material.uploadedBy && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>
                      {material.uploadedBy.first_name} {material.uploadedBy.last_name}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

