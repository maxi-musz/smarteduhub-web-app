"use client";

import { useState } from "react";
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
import { useCreateLibrarySchoolSubject } from "@/hooks/library-owner/use-create-library-school-subject";
import { useToast } from "@/hooks/use-toast";
import { formatTitle } from "@/lib/text-formatter";
import { Loader2, Plus, ChevronUp } from "lucide-react";
import type { Class, Teacher } from "@/hooks/library-owner/use-library-owner-school";

const SUBJECT_COLORS = [
  { name: "Red", value: "#E74C3C" },
  { name: "Blue", value: "#3498DB" },
  { name: "Green", value: "#2ECC71" },
  { name: "Orange", value: "#E67E22" },
  { name: "Purple", value: "#9B59B6" },
  { name: "Teal", value: "#1ABC9C" },
  { name: "Indigo", value: "#3F51B5" },
];

interface AddSubjectsSectionProps {
  schoolId: string;
  availableClasses: Class[];
  availableTeachers: Teacher[];
}

export function AddSubjectsSection({
  schoolId,
  availableClasses,
  availableTeachers,
}: AddSubjectsSectionProps) {
  const { toast } = useToast();
  const createSubject = useCreateLibrarySchoolSubject();
  const [subjectName, setSubjectName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(SUBJECT_COLORS[0].value);
  const [classId, setClassId] = useState<string>("none");
  const [teacherId, setTeacherId] = useState<string>("none");
  const [isExpanded, setIsExpanded] = useState(false);

  const classRequired = availableClasses.length > 0;
  const classSelected = classId && classId !== "none";
  const canSubmit = subjectName.trim() && (!classRequired || classSelected);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = subjectName.trim();
    if (!name || (classRequired && !classSelected)) return;
    try {
      await createSubject.mutateAsync({
        schoolId,
        subject_name: formatTitle(name),
        class_taking_it: classSelected ? classId : (undefined as string | undefined),
        code: code.trim() || undefined,
        description: description.trim() || undefined,
        color: color.trim() || undefined,
        teacher_taking_it: teacherId && teacherId !== "none" ? teacherId : undefined,
      });
      setSubjectName("");
      setCode("");
      setDescription("");
      setColor(SUBJECT_COLORS[0].value);
      setClassId("none");
      setTeacherId("none");
      toast({
        title: "Subject created",
        description: `${formatTitle(name)} has been created successfully.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to create subject",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    }
  };

  if (!isExpanded) {
    return (
      <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setIsExpanded(true)}
        >
          <Plus className="h-4 w-4" />
          Create subject
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-brand-heading">Create subject</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-brand-light-accent-1 hover:text-brand-heading"
          onClick={() => setIsExpanded(false)}
        >
          <ChevronUp className="h-4 w-4" />
          Close
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="add-subject-name" className="text-xs">
              Subject name *
            </Label>
            <Input
              id="add-subject-name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              onBlur={(e) => setSubjectName(formatTitle(e.target.value))}
              placeholder="e.g. Mathematics"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="add-subject-code" className="text-xs">
              Code
            </Label>
            <Input
              id="add-subject-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. MATH101"
              className="h-9"
            />
          </div>
        </div>
        {availableClasses.length === 0 ? (
          <p className="text-xs text-amber-700">Add classes first so you can assign a subject to a class.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Class *</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select class</SelectItem>
                  {availableClasses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {availableTeachers.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs">Teacher (optional)</Label>
                <Select value={teacherId} onValueChange={setTeacherId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {availableTeachers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.first_name} {t.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUBJECT_COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <span className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="add-subject-desc" className="text-xs">
              Description
            </Label>
            <Input
              id="add-subject-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="h-9"
            />
          </div>
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={createSubject.isPending || !canSubmit || availableClasses.length === 0}
          className="bg-brand-primary text-white hover:bg-brand-primary/90"
        >
          {createSubject.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create subject"
          )}
        </Button>
      </form>
    </div>
  );
}
