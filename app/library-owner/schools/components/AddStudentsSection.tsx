"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useOnboardLibraryStudents } from "@/hooks/library-owner/use-onboard-library-students";
import { useToast } from "@/hooks/use-toast";
import ManualStudentForm from "@/components/onboarding/ManualStudentForm";
import StudentList from "@/components/onboarding/StudentList";
import StudentUploadSection from "@/components/onboarding/StudentUploadSection";
import { formatTitle } from "@/lib/text-formatter";
import { Loader2, Plus, ChevronUp, UserPlus, Upload } from "lucide-react";

type StudentFormData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentClass: string;
};

function nextId(): string {
  return Date.now().toString();
}

interface AddStudentsSectionProps {
  schoolId: string;
  availableClasses: string[];
}

export function AddStudentsSection({ schoolId, availableClasses }: AddStudentsSectionProps) {
  const { toast } = useToast();
  const onboardStudents = useOnboardLibraryStudents();
  const [students, setStudents] = useState<StudentFormData[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  /** 'manual' | 'bulk' | null: null = show choice; manual = manual form; bulk = bulk upload */
  const [addMode, setAddMode] = useState<"manual" | "bulk" | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleStudentsUploaded = (
    list: Array<{ firstName: string; lastName: string; email: string; phoneNumber: string; studentClass: string; id?: string }>
  ) => {
    setStudents((prev) => [
      ...prev,
      ...list.map((t, i) => ({
        ...t,
        firstName: formatTitle(t.firstName),
        lastName: formatTitle(t.lastName),
        id: t.id ?? `upload-${Date.now()}-${i}`,
      })),
    ]);
  };

  const handleManualAdd = (s: Omit<StudentFormData, "id">) => {
    setStudents((prev) => [...prev, { ...s, id: nextId() }]);
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    setStudents((prev) => prev.filter((st) => st.id !== id));
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;
    try {
      const result = await onboardStudents.mutateAsync({
        schoolId,
        students: students.map((s) => ({
          first_name: s.firstName,
          last_name: s.lastName,
          email: s.email,
          phone_number: s.phoneNumber,
          default_class: s.studentClass,
        })),
      });
      setStudents([]);
      const { totalSuccessfullyOnboarded, totalFailed, failedEmailsToOnboard = [] } = result;
      const failedList = failedEmailsToOnboard.length > 0 ? failedEmailsToOnboard.join(", ") : "see list";
      if (totalFailed === 0) {
        toast({
          title: "Students added",
          description: `${totalSuccessfullyOnboarded} student(s) added successfully.`,
        });
      } else if (totalSuccessfullyOnboarded === 0) {
        toast({
          variant: "destructive",
          title: "No students added",
          description: `${totalFailed} skipped (email already in use): ${failedList}`,
        });
      } else {
        toast({
          title: "Students partially added",
          description: `${totalSuccessfullyOnboarded} added, ${totalFailed} skipped (email already in use): ${failedList}`,
        });
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to add students", description: err instanceof Error ? err.message : "Please try again." });
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
          disabled={availableClasses.length === 0}
        >
          <Plus className="h-4 w-4" />
          Add student
        </Button>
        {availableClasses.length === 0 && (
          <p className="text-xs text-amber-700 mt-2">Add classes first so you can assign students to a class.</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-brand-heading">Add students</p>
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
      {availableClasses.length === 0 && (
        <p className="text-xs text-amber-700">Add classes first so you can assign students to a class.</p>
      )}

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
              <p className="text-xs text-brand-light-accent-1">Enter one student at a time</p>
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
                  <ManualStudentForm availableClasses={availableClasses} onAddStudent={handleManualAdd} onError={setErrorMessage} existingStudents={students} />
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
            <StudentUploadSection availableClasses={availableClasses} existingStudents={students} onStudentsUploaded={handleStudentsUploaded} />
          )}
          {students.length > 0 && (
            <Button size="sm" onClick={handleSubmit} disabled={onboardStudents.isPending} className="bg-brand-primary text-white hover:bg-brand-primary/90">
              {onboardStudents.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save students"}
            </Button>
          )}
          <StudentList students={students} onRemoveStudent={handleRemove} />
        </>
      )}
    </div>
  );
}
