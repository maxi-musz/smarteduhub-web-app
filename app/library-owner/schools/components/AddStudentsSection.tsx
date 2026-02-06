"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardLibraryStudents } from "@/hooks/library-owner/use-onboard-library-students";
import { useToast } from "@/hooks/use-toast";
import ManualStudentForm from "@/components/onboarding/ManualStudentForm";
import StudentList from "@/components/onboarding/StudentList";
import StudentUploadSection from "@/components/onboarding/StudentUploadSection";
import { formatTitle } from "@/lib/text-formatter";
import { Loader2 } from "lucide-react";

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
  const [addViaBulkUpload, setAddViaBulkUpload] = useState(false);

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
  };

  const handleRemove = (id: string) => {
    setStudents((prev) => prev.filter((st) => st.id !== id));
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;
    try {
      await onboardStudents.mutateAsync({
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
      toast({ title: "Students added", description: `${students.length} student(s) added successfully.` });
    } catch (err) {
      toast({ variant: "destructive", title: "Failed to add students", description: err instanceof Error ? err.message : "Please try again." });
    }
  };

  return (
    <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4 space-y-3">
      <p className="text-sm font-medium text-brand-heading">Add students</p>
      {availableClasses.length === 0 && (
        <p className="text-xs text-amber-700">Add classes first so you can assign students to a class.</p>
      )}
      <ManualStudentForm availableClasses={availableClasses} onAddStudent={handleManualAdd} onError={setErrorMessage} existingStudents={students} />
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
      <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-heading">
        <Checkbox
          checked={addViaBulkUpload}
          onCheckedChange={(checked) => setAddViaBulkUpload(checked === true)}
        />
        Add via bulk upload
      </label>
      {addViaBulkUpload && (
        <StudentUploadSection availableClasses={availableClasses} existingStudents={students} onStudentsUploaded={handleStudentsUploaded} />
      )}
      <StudentList students={students} onRemoveStudent={handleRemove} />
      {students.length > 0 && (
        <Button size="sm" onClick={handleSubmit} disabled={onboardStudents.isPending} className="bg-brand-primary text-white hover:bg-brand-primary/90">
          {onboardStudents.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save students"}
        </Button>
      )}
    </div>
  );
}
