"use client";

import React, { useState } from "react";
import { useGeneralMaterialsDashboard } from "@/hooks/general-materials/use-general-materials";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  AlertCircle,
  RefreshCw,
  BookOpen,
  FileText,
  Plus,
} from "lucide-react";
import { AiBookUploadModal } from "./components/AiBookUploadModal";

const GeneralMaterialsPage = () => {
  const basePath = "/library-owner";
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const {
    data: dashboard,
    isLoading,
    error,
    refetch: refetchDashboard,
  } = useGeneralMaterialsDashboard();

  if (isLoading) {
    return (
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
        <div className="px-4 sm:px-6 space-y-4">
          <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    let errorMessage =
      "An unexpected error occurred while loading AI Books.";

    if (error instanceof AuthenticatedApiError) {
      if (error.statusCode === 401) {
        errorMessage = "Your session has expired. Please login again.";
      } else if (error.statusCode === 403) {
        errorMessage = "You don't have permission to access this data.";
      } else if (error.statusCode === 404) {
        errorMessage =
          "The requested resource was not found. Please check your connection.";
      } else {
        const rawMessage = error.message || "";
        if (
          rawMessage.includes("Cannot GET") ||
          rawMessage.includes("Cannot POST")
        ) {
          errorMessage =
            "Unable to connect to the server. Please check your connection and try again.";
        } else {
          errorMessage = rawMessage;
        }
      }
    }

    return (
      <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
        <div className="px-4 sm:px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading AI Books
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">
                  {errorMessage}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      refetchDashboard();
                    }}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
      <div className="px-4 sm:px-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">AI Books</h1>
          <p className="text-sm sm:text-base text-brand-light-accent-1 mt-1">
            Manage ebooks and general learning materials across your platform.
          </p>
        </div>
        <Button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 self-start w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Upload AI Book
        </Button>
      </div>

      {dashboard && (
        <div className="px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-brand-border p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-xs text-brand-light-accent-1">
                Total Materials
              </p>
              <p className="text-xl font-semibold text-brand-heading">
                {dashboard.statistics.overview.totalMaterials}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-brand-border p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-brand-light-accent-1">
                AI-enabled Materials
              </p>
              <p className="text-xl font-semibold text-brand-heading">
                {dashboard.statistics.overview.aiEnabledMaterials}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-brand-border p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-brand-light-accent-1">
                Total Chapters
              </p>
              <p className="text-xl font-semibold text-brand-heading">
                {dashboard.statistics.overview.totalChapters}
              </p>
            </div>
          </div>
        </div>
      )}

      {dashboard && (
        <div className="px-4 sm:px-6">
          <div className="bg-white rounded-lg border border-brand-border overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-brand-border">
              <h2 className="text-base sm:text-lg font-semibold text-brand-heading">
                Recent AI Books
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <p className="text-xs text-brand-light-accent-1">
                  Showing {Math.min(dashboard.materials.length, 10)} of{" "}
                  {dashboard.statistics.overview.totalMaterials} materials
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    window.location.href = `${basePath}/general-materials/all`;
                  }}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <FileText className="h-4 w-4" />
                  View All
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs sm:text-sm">
                <thead className="bg-gradient-to-r from-brand-primary/10 to-brand-primary/5 border-b-2 border-brand-primary/20">
                  <tr className="text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">Book</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">AI</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">Chapters</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">Class</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">Views</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">Downloads</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">Uploaded By</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-heading text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/40">
                  {dashboard.materials.slice(0, 10).map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-t border-brand-border/30 transition-colors duration-150 ${
                        index % 2 === 0 
                          ? "bg-white hover:bg-brand-primary/5" 
                          : "bg-gray-50/50 hover:bg-brand-primary/5"
                      }`}
                    >
                      <td className="px-4 py-2.5 text-brand-heading max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-20 h-28 rounded-md overflow-hidden border-2 border-brand-border/50 bg-gray-100 flex-shrink-0 shadow-sm">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="80px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-brand-primary/10 text-brand-primary text-sm font-semibold text-center px-1">
                                {item.title.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium line-clamp-2">
                              {item.title}
                            </div>
                            <div className="text-xs text-brand-light-accent-1 line-clamp-1">
                              {item.author || "Unknown author"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.isAiEnabled 
                            ? "bg-green-100 text-green-700 border border-green-200" 
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {item.isAiEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-brand-light-accent-1 font-medium">
                        {item.chapterCount !== undefined ? item.chapterCount.toLocaleString() : "-"}
                      </td>
                      <td className="px-4 py-2.5">
                        {item.classes && item.classes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {item.classes.map((classItem) => (
                              <span
                                key={classItem.id}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary border border-brand-primary/30 shadow-sm"
                              >
                                {classItem.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-brand-light-accent-1 font-medium">
                        {item.views.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-brand-light-accent-1 font-medium">
                        {item.downloads.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-brand-light-accent-1">
                        {item.uploadedBy
                          ? `${item.uploadedBy.first_name} ${item.uploadedBy.last_name}`
                          : "-"}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "published"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : item.status === "draft"
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dashboard.materials.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-brand-light-accent-1"
                      >
                        No AI Books found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <AiBookUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default GeneralMaterialsPage;


