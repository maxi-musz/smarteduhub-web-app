"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboardLibraryTeachers } from "@/hooks/library-owner/use-onboard-library-teachers";
import { useToast } from "@/hooks/use-toast";
import ManualTeacherForm from "@/components/onboarding/ManualTeacherForm";
import TeacherList from "@/components/onboarding/TeacherList";
import TeacherUploadSection from "@/components/onboarding/TeacherUploadSection";
import { formatTitle } from "@/lib/text-formatter";
import { Loader2, Plus, ChevronUp, UserPlus, Upload } from "lucide-react";

type TeacherFormData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

function nextId(): string {
  return Date.now().toString();
}

interface AddTeachersSectionProps {
  schoolId: string;
}

export function AddTeachersSection({ schoolId }: AddTeachersSectionProps) {
  const { toast } = useToast();
  const onboardTeachers = useOnboardLibraryTeachers();
  const [teachers, setTeachers] = useState<TeacherFormData[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  /** 'manual' | 'bulk' | null: null = show choice; manual = manual form; bulk = bulk upload */
  const [addMode, setAddMode] = useState<"manual" | "bulk" | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleTeachersUploaded = (
    list: Array<{ firstName: string; lastName: string; email: string; phoneNumber: string; id?: string }>
  ) => {
    setTeachers((prev) => [
      ...prev,
      ...list.map((t, i) => ({
        ...t,
        firstName: formatTitle(t.firstName),
        lastName: formatTitle(t.lastName),
        id: t.id ?? `upload-${Date.now()}-${i}`,
      })),
    ]);
  };

  const handleManualAdd = (t: Omit<TeacherFormData, "id">) => {
    setTeachers((prev) => [...prev, { ...t, id: nextId() }]);
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    setTeachers((prev) => prev.filter((te) => te.id !== id));
  };

  const handleSubmit = async () => {
    if (teachers.length === 0) return;
    try {
      await onboardTeachers.mutateAsync({
        schoolId,
        teachers: teachers.map((t) => ({
          first_name: t.firstName,
          last_name: t.lastName,
          email: t.email,
          phone_number: t.phoneNumber,
        })),
      });
      setTeachers([]);
      toast({ title: "Teachers added", description: `${teachers.length} teacher(s) added successfully.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to add teachers", description: err instanceof Error ? err.message : "Please try again." });
    }
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setAddMode(null);
    setShowForm(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setAddMode(null);
  };

  if (!isExpanded) {
    return (
      <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={handleExpand}
        >
          <Plus className="h-4 w-4" />
          Add teacher
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-brand-heading">Add teachers</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-brand-light-accent-1 hover:text-brand-heading"
          onClick={handleCollapse}
        >
          <ChevronUp className="h-4 w-4" />
          Close
        </Button>
      </div>

      {addMode === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAddMode("manual")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-brand-border bg-white hover:border-brand-primary hover:bg-brand-primary/5 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-medium text-brand-heading">Add manually</p>
              <p className="text-xs text-brand-light-accent-1">Enter one teacher at a time</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setAddMode("bulk")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-brand-border bg-white hover:border-brand-primary hover:bg-brand-primary/5 text-left transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
              <Upload className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-medium text-brand-heading">Bulk upload</p>
              <p className="text-xs text-brand-light-accent-1">Download template, fill and upload Excel/CSV</p>
            </div>
          </button>
        </div>
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-brand-light-accent-1 hover:text-brand-heading -ml-1"
            onClick={() => setAddMode(null)}
          >
            ← Change method
          </Button>
          {addMode === "manual" && (
            <>
              {showForm ? (
                <>
                  <ManualTeacherForm onAddTeacher={handleManualAdd} onError={setErrorMessage} existingTeachers={teachers} />
                  {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
                </>
              ) : (
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4" />
                  Add more
                </Button>
              )}
            </>
          )}
          {addMode === "bulk" && (
            <TeacherUploadSection onTeachersUploaded={handleTeachersUploaded} existingTeachers={teachers} />
          )}
          <TeacherList teachers={teachers} onRemoveTeacher={handleRemove} />
          {teachers.length > 0 && (
            <Button size="sm" onClick={handleSubmit} disabled={onboardTeachers.isPending} className="bg-brand-primary text-white hover:bg-brand-primary/90">
              {onboardTeachers.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save teachers"}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
