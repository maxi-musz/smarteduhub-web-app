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
import { Loader2, AlertTriangle, ShieldAlert } from "lucide-react";
import { LibrarySubject } from "@/hooks/library-owner/use-library-subjects";
import { useLibraryOwnerProfile } from "@/hooks/library-owner/use-library-owner-profile";
import { PERMISSION_MANAGE_LIBRARY_USERS } from "@/app/library-owner/platform-management/constants";

interface DeleteSubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  subject: LibrarySubject | null;
  isLoading?: boolean;
}

function hasDeletePermission(permissions: unknown[]): boolean {
  return Array.isArray(permissions) && (permissions as string[]).includes(PERMISSION_MANAGE_LIBRARY_USERS);
}

export const DeleteSubjectDialog = ({
  isOpen,
  onClose,
  onConfirm,
  subject,
  isLoading,
}: DeleteSubjectDialogProps) => {
  const { data: profileData, isLoading: isProfileLoading } = useLibraryOwnerProfile();
  
  const canDelete = hasDeletePermission(profileData?.user?.permissions ?? []);

  if (!subject) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Subject
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to delete <strong>{subject.name}</strong>?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
              <p className="font-medium mb-1">This action will permanently delete:</p>
              <ul className="list-disc list-inside space-y-0.5 text-red-700">
                <li>All topics in this subject</li>
                <li>All videos and their storage files</li>
                <li>All materials and documents</li>
                <li>All assignments and assessments</li>
                <li>All links and comments</li>
              </ul>
            </div>
            <p className="text-red-600 font-medium">
              This action cannot be undone.
            </p>
            
            {/* Permission warning */}
            {!isProfileLoading && !canDelete && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Permission Required</p>
                  <p className="text-amber-700 text-xs mt-0.5">
                    You need elevated permission to delete subjects. 
                    Contact your administrator to request access.
                  </p>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (canDelete) {
                onConfirm();
              }
            }}
            disabled={isLoading || isProfileLoading || !canDelete}
            className={`${
              canDelete 
                ? "bg-red-600 hover:bg-red-700 focus:ring-red-600" 
                : "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : isProfileLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              "Delete Subject"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
