"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { LibraryAccessGrant } from "@/hooks/access-control";

interface RevokeAccessDialogProps {
  grant: LibraryAccessGrant | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function RevokeAccessDialog({
  grant,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RevokeAccessDialogProps) {
  if (!grant) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Access</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to revoke access for{" "}
            <strong>{grant.school?.school_name ?? "this school"}</strong> to{" "}
            {grant.subject?.name ?? grant.resourceType}? This action cannot be
            undone, but you can grant access again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Revoking..." : "Revoke Access"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
