"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  useLibraryUsersDashboard,
  useCreateLibraryUser,
  useUpdateLibraryUser,
  useDeleteLibraryUser,
  useAvailablePermissions,
  useLibraryUser,
} from "@/hooks/library-owner/use-library-users";
import type {
  LibraryUsersDashboardParams,
  LibraryUserListItem,
  CreateLibraryUserPayload,
  UpdateLibraryUserPayload,
} from "@/hooks/library-owner/use-library-users-types";
import {
  ManagementStatsCards,
  LibraryUsersTable,
  CreateLibraryUserModal,
  EditLibraryUserModal,
  DeleteLibraryUserDialog,
  UploadAnalyticsSection,
} from "./components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Search, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SORT_OPTIONS: { value: LibraryUsersDashboardParams["sortBy"]; label: string }[] = [
  { value: "createdAt", label: "Created" },
  { value: "email", label: "Email" },
  { value: "first_name", label: "First name" },
  { value: "last_name", label: "Last name" },
  { value: "role", label: "Role" },
  { value: "status", label: "Status" },
];

const ROLE_OPTIONS = [
  { value: "", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "content_creator", label: "Content creator" },
  { value: "reviewer", label: "Reviewer" },
  { value: "viewer", label: "Viewer" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

export default function PlatformManagementPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [sortBy, setSortBy] = useState<LibraryUsersDashboardParams["sortBy"]>("createdAt");
  const [sortOrder, setSortOrder] = useState<LibraryUsersDashboardParams["sortOrder"]>("desc");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<LibraryUserListItem | null>(null);
  const [deleteUser, setDeleteUser] = useState<LibraryUserListItem | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const params: LibraryUsersDashboardParams = {
    page,
    limit,
    search: searchDebounced || undefined,
    sortBy,
    sortOrder,
    role: role && role !== "all" ? (role as LibraryUsersDashboardParams["role"]) : undefined,
    status: status && status !== "all" ? (status as LibraryUsersDashboardParams["status"]) : undefined,
  };

  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useLibraryUsersDashboard(params);

  const createMutation = useCreateLibraryUser();
  const updateMutation = useUpdateLibraryUser();
  const deleteMutation = useDeleteLibraryUser();
  const { data: availablePermissions = [] } = useAvailablePermissions();

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const editIdFromUrl = searchParams.get("edit");
  const { data: editUserDetail } = useLibraryUser(
    editIdFromUrl && !dashboardData?.users?.find((u) => u.id === editIdFromUrl) ? editIdFromUrl : null
  );
  useEffect(() => {
    if (!editIdFromUrl) return;
    const fromList = dashboardData?.users?.find((u) => u.id === editIdFromUrl);
    if (fromList) {
      setEditUser(fromList);
      return;
    }
    if (editUserDetail?.profile && editUserDetail?.counts) {
      const p = editUserDetail.profile;
      const c = editUserDetail.counts;
      setEditUser({
        id: p.id,
        email: p.email,
        first_name: p.first_name,
        last_name: p.last_name,
        phone_number: p.phone_number,
        role: p.role,
        userType: p.userType,
        permissions: p.permissions ?? [],
        permissionLevel: p.permissionLevel,
        status: p.status,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        _count: {
          uploadedVideos: c.uploadedVideos,
          uploadedMaterials: c.uploadedMaterials,
          uploadedAssignments: c.uploadedAssignments,
          uploadedLinks: c.uploadedLinks,
          uploadedGeneralMaterials: c.uploadedGeneralMaterials,
          createdAssessments: c.createdAssessments,
        },
      });
    }
  }, [editIdFromUrl, dashboardData?.users, editUserDetail]);

  const handleCreateSubmit = async (payload: CreateLibraryUserPayload) => {
    try {
      await createMutation.mutateAsync(payload);
      toast({
        title: "User added",
        description: "The library user was created successfully.",
        duration: 3000,
      });
      setIsCreateOpen(false);
      refetchDashboard();
    } catch (err) {
      const msg =
        err instanceof AuthenticatedApiError
          ? err.message
          : "Failed to create library user. Please try again.";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  const handleEditSubmit = async (id: string, payload: UpdateLibraryUserPayload) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      toast({
        title: "User updated",
        description: "The library user was updated successfully.",
        duration: 3000,
      });
      setEditUser(null);
      refetchDashboard();
    } catch (err) {
      const msg =
        err instanceof AuthenticatedApiError
          ? err.message
          : "Failed to update library user. Please try again.";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({
        title: "User removed",
        description: "The library user was removed successfully.",
        duration: 3000,
      });
      setDeleteUser(null);
      refetchDashboard();
    } catch (err) {
      const msg =
        err instanceof AuthenticatedApiError
          ? err.message
          : "Failed to remove library user. Please try again.";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  const meta = dashboardData?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const hasNext = meta?.hasNextPage ?? false;
  const hasPrev = meta?.hasPreviousPage ?? false;

  return (
    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 bg-brand-bg">
      <div className="px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-bold text-brand-heading">Management</h1>
        <p className="text-sm sm:text-base text-brand-light-accent-1 mt-1">
          Manage library users, roles, and upload analytics
        </p>
      </div>

      <Tabs defaultValue="users" className="px-4 sm:px-6">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <ManagementStatsCards
            summary={dashboardData?.summary ?? null}
            contentStats={dashboardData?.contentStats ?? null}
            schoolsWithAccess={dashboardData?.schoolsWithAccess ?? 0}
            isLoading={isDashboardLoading}
          />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-brand-heading">
                Library users {dashboardData?.meta ? `(${dashboardData.meta.total})` : ""}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 sm:flex-initial min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-light-accent-1" />
                  <Input
                    placeholder="Search by name or email…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select
                  value={role}
                  onValueChange={(v) => {
                    setRole(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((o) => (
                      <SelectItem key={o.value || "all"} value={o.value || "all"}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setStatus(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value || "all"} value={o.value || "all"}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={sortBy}
                  onValueChange={(v) => setSortBy(v as LibraryUsersDashboardParams["sortBy"])}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value ?? "createdAt"}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={sortOrder}
                  onValueChange={(v) => setSortOrder(v as LibraryUsersDashboardParams["sortOrder"])}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => refetchDashboard()}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add user
                </Button>
              </div>
            </div>

            {dashboardError && (
              <div className="flex items-center gap-2 p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>
                  {dashboardError instanceof AuthenticatedApiError
                    ? dashboardError.message
                    : "Failed to load users. Please try again."}
                </span>
                <Button variant="outline" size="sm" onClick={() => refetchDashboard()}>
                  Retry
                </Button>
              </div>
            )}

            <LibraryUsersTable
              users={dashboardData?.users ?? []}
              isLoading={isDashboardLoading}
              onEdit={setEditUser}
              onDelete={setDeleteUser}
              availablePermissions={availablePermissions}
              userDetailPath="/library-owner/platform-management/users"
            />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrev || page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="text-sm text-brand-light-accent-1 px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNext || page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <UploadAnalyticsSection />
        </TabsContent>
      </Tabs>

      <CreateLibraryUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createMutation.isPending}
      />
      <EditLibraryUserModal
        user={editUser}
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
      />
      <DeleteLibraryUserDialog
        user={deleteUser}
        isOpen={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />

      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error
            </DialogTitle>
          </DialogHeader>
          <p className="text-brand-light-accent-1">{errorMessage}</p>
          <div className="flex justify-end">
            <Button onClick={() => setErrorDialogOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
