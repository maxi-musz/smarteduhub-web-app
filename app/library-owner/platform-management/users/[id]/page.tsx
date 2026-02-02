"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useLibraryUser } from "@/hooks/library-owner/use-library-users";
import { useAvailablePermissions } from "@/hooks/library-owner/use-library-users";
import type { LibraryUserDetailResponse } from "@/hooks/library-owner/use-library-users-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Building2,
  Video,
  FileText,
  Link2,
  BookOpen,
  FileStack,
  ClipboardList,
  BarChart3,
  Mail,
  Phone,
  Calendar,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AuthenticatedApiError } from "@/lib/api/authenticated";

function getPermissionLabel(code: string, availablePermissions: { code: string; name: string }[]): string {
  const found = availablePermissions.find((p) => p.code === code);
  return found ? found.name : code;
}

export default function LibraryUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : null;
  const { data, isLoading, error } = useLibraryUser(id);
  const { data: availablePermissions = [] } = useAvailablePermissions();

  if (isLoading) {
    return (
      <div className="py-4 sm:py-6 px-4 sm:px-6 bg-brand-bg min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error || !data) {
    const msg =
      error instanceof AuthenticatedApiError
        ? error.message
        : "Failed to load user. They may not exist or you may not have permission.";
    return (
      <div className="py-4 sm:py-6 px-4 sm:px-6 bg-brand-bg space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/library-owner/platform-management" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Management
          </Link>
        </Button>
        <div className="flex items-center gap-2 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{msg}</p>
        </div>
      </div>
    );
  }

  const d = data as LibraryUserDetailResponse;
  const { profile, library, counts, uploads, createdAssessments } = d;

  return (
    <div className="py-4 sm:py-6 px-4 sm:px-6 bg-brand-bg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/library-owner/platform-management" className="gap-2 w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to Management
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/library-owner/platform-management?edit=${profile.id}`)}
        >
          Edit user
        </Button>
      </div>

      {/* Profile */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <User className="h-6 w-6 text-brand-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {profile.first_name} {profile.last_name}
              </CardTitle>
              <p className="text-sm text-brand-light-accent-1 mt-0.5 flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={profile.status === "active" ? "default" : "secondary"}>{profile.status}</Badge>
            <Badge variant="outline">{profile.role}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {profile.phone_number && (
              <div className="flex items-center gap-2 text-brand-light-accent-1">
                <Phone className="h-4 w-4 shrink-0" />
                {profile.phone_number}
              </div>
            )}
            <div className="flex items-center gap-2 text-brand-light-accent-1">
              <Calendar className="h-4 w-4 shrink-0" />
              Joined {profile.createdAt ? formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true }) : "—"}
            </div>
            <div className="flex items-center gap-2 text-brand-light-accent-1">
              <Shield className="h-4 w-4 shrink-0 text-violet-600" />
              {profile.permissions?.length ?? 0} permission{profile.permissions?.length !== 1 ? "s" : ""}
              {profile.permissionLevel != null && (
                <span className="text-brand-heading"> · Level {profile.permissionLevel}</span>
              )}
            </div>
          </div>
          {profile.permissions?.length > 0 && (
            <div className="pt-2 border-t border-brand-border">
              <p className="text-xs font-medium text-brand-light-accent-1 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.permissions.map((code) => (
                  <Badge key={code} variant="secondary" className="text-xs font-normal">
                    {getPermissionLabel(code, availablePermissions)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Library */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 pb-2">
          <Building2 className="h-5 w-5 text-brand-primary" />
          <CardTitle className="text-base">Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium text-brand-heading">{library.name}</p>
          {library.description && (
            <p className="text-sm text-brand-light-accent-1 mt-1">{library.description}</p>
          )}
          <p className="text-xs text-brand-light-accent-1 mt-1">{library.slug} · {library.status}</p>
        </CardContent>
      </Card>

      {/* Counts */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Activity counts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Videos", value: counts.uploadedVideos, icon: Video, color: "text-amber-600" },
              { label: "Materials", value: counts.uploadedMaterials, icon: FileText, color: "text-emerald-600" },
              { label: "Assignments", value: counts.uploadedAssignments, icon: ClipboardList, color: "text-blue-600" },
              { label: "Links", value: counts.uploadedLinks, icon: Link2, color: "text-sky-600" },
              { label: "General materials", value: counts.uploadedGeneralMaterials, icon: BookOpen, color: "text-violet-600" },
              { label: "Chapter files", value: counts.uploadedChapterFiles, icon: FileStack, color: "text-slate-600" },
              { label: "Assessments created", value: counts.createdAssessments, icon: BarChart3, color: "text-brand-primary" },
              { label: "Comments", value: counts.comments, icon: User, color: "text-brand-light-accent-1" },
              { label: "Access grants", value: counts.libraryResourceAccessGrants, icon: Shield, color: "text-brand-light-accent-1" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                <div>
                  <p className="text-lg font-semibold text-brand-heading">{value}</p>
                  <p className="text-xs text-brand-light-accent-1">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Uploads – Videos */}
      {uploads.videos?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <Video className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base">Videos ({uploads.videos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-4 flex-nowrap min-w-0">
                {uploads.videos.map((v) => (
                  <div key={v.id} className="flex-shrink-0 w-52">
                    {v.thumbnailUrl ? (
                      <Image
                        src={v.thumbnailUrl}
                        alt=""
                        width={208}
                        height={117}
                        className="w-full aspect-video rounded-md border border-brand-border object-cover bg-gray-100"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full aspect-video rounded-md border border-brand-border bg-gray-100 flex items-center justify-center">
                        <Video className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <p className="font-medium text-brand-heading text-sm mt-2 line-clamp-2">{v.title}</p>
                    <p className="text-xs text-brand-light-accent-1 mt-0.5">
                      {v.subject?.name ?? "—"} · {v.status} · {v.createdAt ? formatDistanceToNow(new Date(v.createdAt), { addSuffix: true }) : ""}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploads – Materials */}
      {uploads.materials?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            <CardTitle className="text-base">Materials ({uploads.materials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-4 flex-nowrap min-w-0">
                {uploads.materials.map((m) => (
                  <div key={m.id} className="flex-shrink-0 w-52 p-3 rounded-lg border border-brand-border bg-gray-50">
                    <p className="font-medium text-brand-heading text-sm line-clamp-2">{m.title}</p>
                    <p className="text-xs text-brand-light-accent-1 mt-1">
                      {m.subject?.name ?? "—"} · {m.materialType} · {m.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploads – Assignments */}
      {uploads.assignments?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base">Assignments ({uploads.assignments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-4 flex-nowrap min-w-0">
                {uploads.assignments.map((a) => (
                  <div key={a.id} className="flex-shrink-0 w-52 p-3 rounded-lg border border-brand-border bg-gray-50">
                    <p className="font-medium text-brand-heading text-sm line-clamp-2">{a.title}</p>
                    <p className="text-xs text-brand-light-accent-1 mt-1">
                      {a.subject?.name ?? "—"} · {a.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploads – Links */}
      {uploads.links?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <Link2 className="h-5 w-5 text-sky-600" />
            <CardTitle className="text-base">Links ({uploads.links.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-4 flex-nowrap min-w-0">
                {uploads.links.map((l) => (
                  <div key={l.id} className="flex-shrink-0 w-52 p-3 rounded-lg border border-brand-border bg-gray-50">
                    <p className="font-medium text-brand-heading text-sm line-clamp-2">{l.title}</p>
                    <p className="text-xs text-brand-light-accent-1 mt-1 truncate" title={l.url}>{l.url}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploads – General materials */}
      {uploads.generalMaterials?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-600" />
            <CardTitle className="text-base">General materials ({uploads.generalMaterials.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-4 flex-nowrap min-w-0">
                {uploads.generalMaterials.map((g) => (
                  <div key={g.id} className="flex-shrink-0 w-52 p-3 rounded-lg border border-brand-border bg-gray-50">
                    <p className="font-medium text-brand-heading text-sm line-clamp-2">{g.title}</p>
                    <p className="text-xs text-brand-light-accent-1 mt-1">
                      {g.subject?.name ?? "—"} · {g.materialType}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploads – Chapter files */}
      {uploads.chapterFiles?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <FileStack className="h-5 w-5 text-slate-600" />
            <CardTitle className="text-base">Chapter files ({uploads.chapterFiles.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-4 flex-nowrap min-w-0">
                {uploads.chapterFiles.map((c) => (
                  <div key={c.id} className="flex-shrink-0 w-52 p-3 rounded-lg border border-brand-border bg-gray-50">
                    <p className="font-medium text-brand-heading text-sm line-clamp-2">{c.fileName}</p>
                    <p className="text-xs text-brand-light-accent-1 mt-1">{c.fileType}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Created assessments */}
      {createdAssessments?.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-primary" />
            <CardTitle className="text-base">Created assessments ({createdAssessments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-4 flex-nowrap min-w-0">
                {createdAssessments.map((a) => (
                  <div key={a.id} className="flex-shrink-0 w-52 p-3 rounded-lg border border-brand-border bg-gray-50">
                    <p className="font-medium text-brand-heading text-sm line-clamp-2">{a.title}</p>
                    <p className="text-xs text-brand-light-accent-1 mt-1">
                      {a.subject?.name ?? "—"} · {a.assessmentType} · {a.status} · {a.totalPoints} pts
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!uploads.videos?.length &&
        !uploads.materials?.length &&
        !uploads.assignments?.length &&
        !uploads.links?.length &&
        !uploads.generalMaterials?.length &&
        !uploads.chapterFiles?.length &&
        (!createdAssessments || createdAssessments.length === 0) && (
          <Card className="shadow-sm">
            <CardContent className="py-8 text-center text-brand-light-accent-1">
              No uploads or assessments yet.
            </CardContent>
          </Card>
        )}
    </div>
  );
}
