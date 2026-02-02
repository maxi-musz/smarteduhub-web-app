"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Video, FileText, Shield, ChevronDown } from "lucide-react";
import type { LibraryUserListItem } from "@/hooks/library-owner/use-library-users-types";
import type { AvailablePermission } from "@/hooks/library-owner/use-library-users-types";
import { formatDistanceToNow } from "date-fns";

interface LibraryUsersTableProps {
  users: LibraryUserListItem[];
  isLoading?: boolean;
  onEdit: (user: LibraryUserListItem) => void;
  onDelete: (user: LibraryUserListItem) => void;
  /** Optional: used to show permission names in the dropdown instead of codes */
  availablePermissions?: AvailablePermission[];
  /** Base path for user detail page (e.g. /library-owner/platform-management/users). Name and email link to {userDetailPath}/{user.id} */
  userDetailPath?: string;
}

function roleBadgeVariant(role: string): "default" | "secondary" | "outline" {
  switch (role) {
    case "admin":
      return "default";
    case "manager":
      return "default";
    case "content_creator":
      return "secondary";
    case "reviewer":
      return "outline";
    case "viewer":
      return "outline";
    default:
      return "outline";
  }
}

function statusBadgeVariant(status: string): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "suspended":
      return "destructive";
    default:
      return "outline";
  }
}

function getPermissionLabel(code: string, availablePermissions?: AvailablePermission[]): string {
  if (availablePermissions?.length) {
    const found = availablePermissions.find((p) => p.code === code);
    if (found) return found.name;
  }
  return code;
}

function PermissionsCell({
  permissions,
  availablePermissions,
}: {
  permissions: string[];
  availablePermissions: AvailablePermission[];
}) {
  const count = permissions.length;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-brand-light-accent-1 hover:text-brand-heading"
        >
          <Shield className="h-4 w-4 shrink-0 text-violet-600" />
          <span>{count}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px] max-h-[280px] overflow-y-auto">
        {count === 0 ? (
          <div className="px-2 py-3 text-sm text-brand-light-accent-1">No permissions</div>
        ) : (
          permissions.map((code) => (
            <div
              key={code}
              className="px-2 py-1.5 text-sm text-brand-heading border-b border-brand-border last:border-0"
            >
              {getPermissionLabel(code, availablePermissions)}
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LibraryUsersTable({
  users,
  isLoading,
  onEdit,
  onDelete,
  availablePermissions = [],
  userDetailPath,
}: LibraryUsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-brand-border bg-white">
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-12 text-center">
        <p className="text-brand-light-accent-1">
          No library users yet. Add a user to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Uploads</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {userDetailPath ? (
                  <Link
                    href={`${userDetailPath}/${user.id}`}
                    className="text-brand-primary hover:underline focus:outline-none focus:underline"
                  >
                    {user.first_name} {user.last_name}
                  </Link>
                ) : (
                  `${user.first_name} ${user.last_name}`
                )}
              </TableCell>
              <TableCell className="text-brand-light-accent-1">
                {userDetailPath ? (
                  <Link
                    href={`${userDetailPath}/${user.id}`}
                    className="text-brand-primary hover:underline focus:outline-none focus:underline"
                  >
                    {user.email}
                  </Link>
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                <Badge variant={roleBadgeVariant(user.role)}>{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={statusBadgeVariant(user.status)}>{user.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 text-sm text-brand-light-accent-1">
                  <span className="flex items-center gap-1.5" title="Videos">
                    <Video className="h-4 w-4 shrink-0 text-amber-600" />
                    {user._count?.uploadedVideos ?? 0}
                  </span>
                  <span className="flex items-center gap-1.5" title="Materials">
                    <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                    {user._count?.uploadedMaterials ?? 0}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <PermissionsCell
                  permissions={Array.isArray(user.permissions) ? user.permissions : []}
                  availablePermissions={availablePermissions}
                />
              </TableCell>
              <TableCell className="text-brand-light-accent-1 text-sm">
                {user.updatedAt
                  ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })
                  : "—"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(user)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
