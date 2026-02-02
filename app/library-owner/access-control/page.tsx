"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useSchoolsWithAccess,
  useGrantSchoolAccess,
  useRevokeLibraryAccess,
} from "@/hooks/access-control";
import { useLibraryOwnerSchools } from "@/hooks/library-owner/use-library-owner-schools";
import { useLibrarySubjects } from "@/hooks/library-owner/use-library-subjects";
import {
  AccessControlStats,
  SchoolsWithAccessTable,
  GrantAccessModal,
  RevokeAccessDialog,
} from "./components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldPlus, Search, RefreshCw, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import type {
  GrantSchoolAccessRequest,
  LibraryAccessGrant,
  SchoolsWithAccessResponse,
} from "@/hooks/access-control";

export default function LibraryOwnerAccessControlPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [revokeGrant, setRevokeGrant] = useState<LibraryAccessGrant | null>(null);
  const [isRevokeDialogOpen, setIsRevokeDialogOpen] = useState(false);

  const { data: schoolsData } = useLibraryOwnerSchools();
  const { data: subjectsData } = useLibrarySubjects({ limit: 500 });
  const {
    data: accessData,
    isLoading: isAccessLoading,
    error: accessError,
    refetch: refetchAccess,
  } = useSchoolsWithAccess({
    search: searchQuery || undefined,
    page,
    limit: 20,
  });

  const grantMutation = useGrantSchoolAccess();
  const revokeMutation = useRevokeLibraryAccess();

  const schools = useMemo(() => {
    return (schoolsData as { schools?: Array<{ id: string; school_name: string }> })?.schools ?? [];
  }, [schoolsData]);

  const availableSubjects = useMemo(() => {
    return (subjectsData as { data?: Array<{ id: string; name: string; code: string }> })?.data ?? [];
  }, [subjectsData]);

  const handleGrantSubmit = async (data: GrantSchoolAccessRequest) => {
    try {
      await grantMutation.mutateAsync(data);
      setIsGrantModalOpen(false);
      refetchAccess();
    } catch (err) {
      console.error("Failed to grant access:", err);
    }
  };

  const handleRevokeClick = (grant: LibraryAccessGrant) => {
    setRevokeGrant(grant);
    setIsRevokeDialogOpen(true);
  };

  const handleManageClick = (grant: LibraryAccessGrant) => {
    router.push(`/library-owner/access-control/schools/${grant.schoolId}`);
  };

  const handleRevokeConfirm = async () => {
    if (!revokeGrant) return;
    try {
      await revokeMutation.mutateAsync({ grantId: revokeGrant.id });
      setRevokeGrant(null);
      setIsRevokeDialogOpen(false);
      refetchAccess();
    } catch (err) {
      console.error("Failed to revoke access:", err);
    }
  };

  const data = accessData as SchoolsWithAccessResponse | undefined;
  const totalGrants = data?.meta?.totalItems ?? 0;
  const activeGrants = data?.items?.filter((i) => i.isActive).length ?? 0;
  const uniqueSchools = new Set(data?.items?.map((i) => i.schoolId) ?? []).size;

  if (accessError) {
    const msg =
      accessError instanceof AuthenticatedApiError
        ? accessError.message
        : "Failed to load access control data";
    return (
      <div className="py-6 space-y-6 bg-brand-bg">
        <div className="px-4 sm:px-6">
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Error Loading Access Control
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-brand-light-accent-1 mb-4">{msg}</p>
                <Button onClick={() => refetchAccess()}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
      {/* Header */}
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">
          Access Control
        </h1>
        <p className="text-sm sm:text-base text-brand-light-accent-1 mt-1">
          Grant and manage school access to your library resources
        </p>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-6">
        <AccessControlStats
          totalGrants={totalGrants}
          activeGrants={activeGrants}
          schoolsWithAccess={uniqueSchools}
          isLoading={isAccessLoading}
        />
      </div>

      {/* Schools with Access */}
      <div className="px-4 sm:px-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-brand-heading">
            Schools with Access ({totalGrants})
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {schools.length > 0 && (
              <Select
                value=""
                onValueChange={(v) => {
                  if (v) router.push(`/library-owner/access-control/schools/${v}`);
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Manage access for school..." />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.school_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
              <Input
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Button variant="outline" size="icon" onClick={() => refetchAccess()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsGrantModalOpen(true)}>
              <ShieldPlus className="h-4 w-4 mr-2" />
              Grant Access
            </Button>
          </div>
        </div>

        <SchoolsWithAccessTable
          items={data?.items ?? []}
          isLoading={isAccessLoading}
          onRevoke={handleRevokeClick}
          onManage={handleManageClick}
        />

        {/* Pagination */}
        {data?.meta && data.meta.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-brand-light-accent-1">
              Page {page} of {data.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <GrantAccessModal
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
        onSubmit={handleGrantSubmit}
        schools={schools}
        isLoading={grantMutation.isPending}
        availableSubjects={availableSubjects}
      />

      <RevokeAccessDialog
        grant={revokeGrant}
        isOpen={isRevokeDialogOpen}
        onClose={() => {
          setIsRevokeDialogOpen(false);
          setRevokeGrant(null);
        }}
        onConfirm={handleRevokeConfirm}
        isLoading={revokeMutation.isPending}
      />
    </div>
  );
}
