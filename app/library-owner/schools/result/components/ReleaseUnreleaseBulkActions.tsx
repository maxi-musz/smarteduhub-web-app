"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Send, X, Loader2 } from "lucide-react";
import type { DashboardClass } from "../hooks/use-library-school-results";

interface ReleaseUnreleaseBulkActionsProps {
  sessionId: string | null;
  selectedClassId: string | null;
  classes: DashboardClass[];
  onReleaseSchool: () => void;
  onUnreleaseSchool: (sessionId?: string | null) => void;
  onReleaseClass: (params: { classId: string; sessionId?: string | null }) => void;
  onUnreleaseClass: (params: { classId: string; sessionId?: string | null }) => void;
  releaseSchoolMutation: { isPending: boolean };
  unreleaseSchoolMutation: { isPending: boolean };
  releaseClassMutation: { isPending: boolean };
  unreleaseClassMutation: { isPending: boolean };
}

type DialogType = "release-school" | "unrelease-school" | "release-class" | "unrelease-class" | null;

export function ReleaseUnreleaseBulkActions({
  sessionId,
  selectedClassId,
  classes,
  onReleaseSchool,
  onUnreleaseSchool,
  onReleaseClass,
  onUnreleaseClass,
  releaseSchoolMutation,
  unreleaseSchoolMutation,
  releaseClassMutation,
  unreleaseClassMutation,
}: ReleaseUnreleaseBulkActionsProps) {
  const [dialog, setDialog] = useState<DialogType>(null);

  const handleReleaseSchool = () => {
    onReleaseSchool();
    setDialog(null);
  };

  const handleUnreleaseSchool = () => {
    onUnreleaseSchool(sessionId);
    setDialog(null);
  };

  const handleReleaseClass = () => {
    if (selectedClassId) {
      onReleaseClass({ classId: selectedClassId, sessionId });
      setDialog(null);
    }
  };

  const handleUnreleaseClass = () => {
    if (selectedClassId) {
      onUnreleaseClass({ classId: selectedClassId, sessionId });
      setDialog(null);
    }
  };

  const selectedClassName = selectedClassId
    ? classes.find((c) => c.id === selectedClassId)?.name ?? "this class"
    : "this class";

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={releaseSchoolMutation.isPending}
          onClick={() => setDialog("release-school")}
        >
          {releaseSchoolMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Send className="h-4 w-4 mr-1" />
          )}
          Release whole school
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={unreleaseSchoolMutation.isPending}
          onClick={() => setDialog("unrelease-school")}
        >
          {unreleaseSchoolMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <X className="h-4 w-4 mr-1" />
          )}
          Unrelease whole school
        </Button>
        {selectedClassId && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={releaseClassMutation.isPending}
              onClick={() => setDialog("release-class")}
            >
              {releaseClassMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Send className="h-4 w-4 mr-1" />
              )}
              Release {selectedClassName}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={unreleaseClassMutation.isPending}
              onClick={() => setDialog("unrelease-class")}
            >
              {unreleaseClassMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <X className="h-4 w-4 mr-1" />
              )}
              Unrelease {selectedClassName}
            </Button>
          </>
        )}
      </div>

      <AlertDialog open={dialog === "release-school"} onOpenChange={(o) => !o && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release results for whole school?</AlertDialogTitle>
            <AlertDialogDescription>
              This will release results for all students in the school for the current session. Students will be able to view their results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReleaseSchool}>
              {releaseSchoolMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Release"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialog === "unrelease-school"} onOpenChange={(o) => !o && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unrelease results for whole school?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unrelease results for all students in the school for the selected session. Students will no longer see their results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnreleaseSchool}>
              {unreleaseSchoolMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unrelease"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialog === "release-class"} onOpenChange={(o) => !o && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Release results for {selectedClassName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will release results for all students in {selectedClassName}. Students will be able to view their results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReleaseClass}>
              {releaseClassMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Release"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={dialog === "unrelease-class"} onOpenChange={(o) => !o && setDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unrelease results for {selectedClassName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unrelease results for all students in {selectedClassName}. Students will no longer see their results.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnreleaseClass}>
              {unreleaseClassMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Unrelease"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
