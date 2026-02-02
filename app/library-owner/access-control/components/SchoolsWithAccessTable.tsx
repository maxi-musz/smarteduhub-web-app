"use client";

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
import { MoreHorizontal, Edit2, Trash2, Settings2 } from "lucide-react";
import type { LibraryAccessGrant } from "@/hooks/access-control";
import { formatDistanceToNow } from "date-fns";

interface SchoolsWithAccessTableProps {
  items: LibraryAccessGrant[];
  isLoading?: boolean;
  onRevoke: (grant: LibraryAccessGrant) => void;
  onUpdate?: (grant: LibraryAccessGrant) => void;
  onManage?: (grant: LibraryAccessGrant) => void;
}

function getResourceLabel(grant: LibraryAccessGrant): string {
  if (grant.resourceType === "ALL") return "All Resources";
  if (grant.subject?.name) return grant.subject.name;
  return grant.resourceType;
}

function getAccessLevelBadgeVariant(level: string) {
  switch (level) {
    case "FULL":
      return "default";
    case "READ_ONLY":
      return "secondary";
    case "LIMITED":
      return "outline";
    default:
      return "outline";
  }
}

export function SchoolsWithAccessTable({
  items,
  isLoading,
  onRevoke,
  onUpdate,
  onManage,
}: SchoolsWithAccessTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-brand-border bg-white">
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="rounded-lg border border-brand-border bg-white p-12 text-center">
        <p className="text-brand-light-accent-1">
          No schools have been granted access yet. Use the &quot;Grant Access&quot;
          button to grant school access to your library resources.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>School</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Access Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Granted</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((grant) => (
            <TableRow key={grant.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-brand-heading">
                    {grant.school?.school_name ?? "—"}
                  </p>
                  <p className="text-sm text-brand-light-accent-1">
                    {grant.school?.school_email ?? ""}
                  </p>
                </div>
              </TableCell>
              <TableCell>{getResourceLabel(grant)}</TableCell>
              <TableCell>
                <Badge variant="outline">{grant.resourceType}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getAccessLevelBadgeVariant(grant.accessLevel)}>
                  {grant.accessLevel}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={grant.isActive ? "default" : "secondary"}>
                  {grant.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-brand-light-accent-1 text-sm">
                {grant.grantedAt
                  ? formatDistanceToNow(new Date(grant.grantedAt), {
                      addSuffix: true,
                    })
                  : "—"}
              </TableCell>
              <TableCell className="text-brand-light-accent-1 text-sm">
                {grant.expiresAt
                  ? new Date(grant.expiresAt).toLocaleDateString()
                  : "Never"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onManage && (
                      <DropdownMenuItem onClick={() => onManage(grant)}>
                        <Settings2 className="h-4 w-4 mr-2" />
                        Manage Access
                      </DropdownMenuItem>
                    )}
                    {onUpdate && (
                      <DropdownMenuItem onClick={() => onUpdate(grant)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Update
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onRevoke(grant)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Revoke
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
