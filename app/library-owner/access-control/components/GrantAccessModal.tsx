"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type {
  GrantSchoolAccessRequest,
  LibraryResourceType,
  AccessLevel,
} from "@/hooks/access-control";

interface GrantAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GrantSchoolAccessRequest) => void;
  schools: Array<{ id: string; school_name: string }>;
  isLoading?: boolean;
  availableSubjects?: Array<{ id: string; name: string; code: string }>;
}

const RESOURCE_TYPES: { value: LibraryResourceType; label: string }[] = [
  { value: "ALL", label: "All Resources" },
  { value: "SUBJECT", label: "Subject" },
  { value: "TOPIC", label: "Topic" },
  { value: "VIDEO", label: "Video" },
  { value: "MATERIAL", label: "Material" },
  { value: "ASSESSMENT", label: "Assessment" },
];

const ACCESS_LEVELS: { value: AccessLevel; label: string }[] = [
  { value: "FULL", label: "Full Access" },
  { value: "READ_ONLY", label: "Read Only" },
  { value: "LIMITED", label: "Limited" },
];

export function GrantAccessModal({
  isOpen,
  onClose,
  onSubmit,
  schools,
  isLoading,
  availableSubjects = [],
}: GrantAccessModalProps) {
  const [schoolId, setSchoolId] = useState("");
  const [resourceType, setResourceType] = useState<LibraryResourceType>("SUBJECT");
  const [subjectId, setSubjectId] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("FULL");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: GrantSchoolAccessRequest = {
      schoolId,
      resourceType,
      accessLevel,
      notes: notes || undefined,
    };
    if (resourceType === "SUBJECT" && subjectId) {
      data.subjectId = subjectId;
    }
    onSubmit(data);
    handleReset();
  };

  const handleReset = () => {
    setSchoolId("");
    setResourceType("SUBJECT");
    setSubjectId("");
    setAccessLevel("FULL");
    setNotes("");
    onClose();
  };

  const canSubmit =
    schoolId && resourceType && (resourceType !== "SUBJECT" || subjectId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grant School Access</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school">School</Label>
            <Select value={schoolId} onValueChange={setSchoolId} required>
              <SelectTrigger id="school">
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.school_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resourceType">Resource Type</Label>
            <Select
              value={resourceType}
              onValueChange={(v) => setResourceType(v as LibraryResourceType)}
            >
              <SelectTrigger id="resourceType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESOURCE_TYPES.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    {rt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {resourceType === "SUBJECT" && availableSubjects.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId} required>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {resourceType === "SUBJECT" && availableSubjects.length === 0 && (
            <div className="space-y-2">
              <Label>Subject ID</Label>
              <Input
                placeholder="Enter subject ID"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="accessLevel">Access Level</Label>
            <Select
              value={accessLevel}
              onValueChange={(v) => setAccessLevel(v as AccessLevel)}
            >
              <SelectTrigger id="accessLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_LEVELS.map((al) => (
                  <SelectItem key={al.value} value={al.value}>
                    {al.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Input
              id="notes"
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleReset}>
              Cancel
            </Button>
            <Button type="submit" disabled={!canSubmit || isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Grant Access
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
