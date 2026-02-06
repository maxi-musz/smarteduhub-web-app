"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardLibraryTeachers } from "@/hooks/library-owner/use-onboard-library-teachers";
import { useToast } from "@/hooks/use-toast";
import ManualTeacherForm from "@/components/onboarding/ManualTeacherForm";
import TeacherList from "@/components/onboarding/TeacherList";
import TeacherUploadSection from "@/components/onboarding/TeacherUploadSection";
import { formatTitle } from "@/lib/text-formatter";
import { Loader2 } from "lucide-react";

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
  const [addViaBulkUpload, setAddViaBulkUpload] = useState(false);

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

  return (
    <div className="rounded-lg border border-brand-border bg-gray-50/50 p-4 space-y-3">
      <p className="text-sm font-medium text-brand-heading">Add teachers</p>
      <ManualTeacherForm onAddTeacher={handleManualAdd} onError={setErrorMessage} existingTeachers={teachers} />
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
      <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-heading">
        <Checkbox
          checked={addViaBulkUpload}
          onCheckedChange={(checked) => setAddViaBulkUpload(checked === true)}
        />
        Add via bulk upload
      </label>
      {addViaBulkUpload && (
        <TeacherUploadSection onTeachersUploaded={handleTeachersUploaded} existingTeachers={teachers} />
      )}
      <TeacherList teachers={teachers} onRemoveTeacher={handleRemove} />
      {teachers.length > 0 && (
        <Button size="sm" onClick={handleSubmit} disabled={onboardTeachers.isPending} className="bg-brand-primary text-white hover:bg-brand-primary/90">
          {onboardTeachers.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save teachers"}
        </Button>
      )}
    </div>
  );
}
