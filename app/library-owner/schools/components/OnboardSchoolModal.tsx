"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Upload, FileText, X, AlertCircle, Loader2, School } from "lucide-react";
import { useOnboardLibrarySchool } from "@/hooks/library-owner/use-onboard-library-school";
import type {
  LibraryOnboardSchoolFormData,
  LibraryOnboardSchoolDocuments,
  SchoolType,
  SchoolOwnership,
  CurrentTerm,
} from "@/hooks/library-owner/types-onboarding";
import { AuthenticatedApiError } from "@/lib/api/authenticated";
import { formatTitle } from "@/lib/text-formatter";

const SCHOOL_TYPES: { value: SchoolType; label: string }[] = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "primary_and_secondary", label: "Primary and Secondary" },
  { value: "other", label: "Other" },
];

const SCHOOL_OWNERSHIPS: { value: SchoolOwnership; label: string }[] = [
  { value: "private", label: "Private" },
  { value: "government", label: "Government" },
  { value: "other", label: "Other" },
];

const TERMS: { value: CurrentTerm; label: string }[] = [
  { value: "first", label: "First" },
  { value: "second", label: "Second" },
  { value: "third", label: "Third" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function getAcademicYearOptions(): string[] {
  const currentYear = new Date().getFullYear();
  const prev = currentYear - 1;
  const next = currentYear + 1;
  return [`${prev}/${currentYear}`, `${currentYear}/${next}`];
}

function formatDateForInput(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getDateRestrictions(): { min: string; max: string } {
  const currentYear = new Date().getFullYear();
  const from = new Date(currentYear - 1, 0, 1);
  const to = new Date(currentYear + 1, 11, 31);
  return {
    min: formatDateForInput(from.toISOString()),
    max: formatDateForInput(to.toISOString()),
  };
}

const initialForm: LibraryOnboardSchoolFormData = {
  school_name: "",
  school_email: "",
  school_address: "",
  school_phone: "",
  school_type: "primary",
  school_ownership: "private",
  academic_year: "",
  current_term: "first",
  term_start_date: "",
  term_end_date: "",
};

type FileSlot = "cac" | "utility" | "tax" | "icon";

interface OnboardSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (schoolId: string) => void;
}

export function OnboardSchoolModal({
  isOpen,
  onClose,
  onSuccess,
}: OnboardSchoolModalProps) {
  const onboardSchool = useOnboardLibrarySchool();
  const [form, setForm] = useState<LibraryOnboardSchoolFormData>(initialForm);
  const [files, setFiles] = useState<{
    cac: File | null;
    utility: File | null;
    tax: File | null;
    icon: File | null;
  }>({ cac: null, utility: null, tax: null, icon: null });
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const cacRef = useRef<HTMLInputElement>(null);
  const utilityRef = useRef<HTMLInputElement>(null);
  const taxRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const { min, max } = getDateRestrictions();
  const academicYears = getAcademicYearOptions();

  const setField = (field: keyof LibraryOnboardSchoolFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const PDF_TYPES = ["application/pdf"];
  const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

  const handleFile = (slot: FileSlot, file: File | null) => {
    if (!file) {
      setFiles((prev) => ({ ...prev, [slot]: null }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(`File is too large (max ${MAX_FILE_SIZE / (1024 * 1024)}MB).`);
      setErrorModal(true);
      return;
    }
    if (slot === "icon") {
      if (!IMAGE_TYPES.includes(file.type)) {
        setErrorMessage("School logo must be an image (PNG, JPG or JPEG).");
        setErrorModal(true);
        return;
      }
    } else {
      if (
        !PDF_TYPES.includes(file.type) &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        setErrorMessage(
          `${slot === "cac" ? "CAC or approval letter" : slot === "utility" ? "Utility bill" : "Tax clearance"} must be a PDF file.`
        );
        setErrorModal(true);
        return;
      }
    }
    setFiles((prev) => ({ ...prev, [slot]: file }));
  };

  const isRequiredFilesOk =
    files.cac !== null && files.utility !== null && files.tax !== null;
  const isFormValid =
    form.school_name.trim() !== "" &&
    form.school_email.trim() !== "" &&
    form.school_address.trim() !== "" &&
    form.school_phone.trim() !== "" &&
    form.academic_year !== "" &&
    form.term_start_date !== "" &&
    isRequiredFilesOk;

  const handleSubmit = async () => {
    if (!isFormValid || !files.cac || !files.utility || !files.tax) return;
    const documents: LibraryOnboardSchoolDocuments = {
      cac_or_approval_letter: files.cac,
      utility_bill: files.utility,
      tax_cert: files.tax,
    };
    if (files.icon) documents.school_icon = files.icon;
    try {
      const data = await onboardSchool.mutateAsync({ form, documents });
      onClose();
      onSuccess?.(data.id);
    } catch (err) {
      if (err instanceof AuthenticatedApiError) {
        setErrorMessage(
          err.statusCode === 401
            ? "Your session has expired. Please log in again."
            : err.message
        );
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
      setErrorModal(true);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setFiles({ cac: null, utility: null, tax: null, icon: null });
    setErrorModal(false);
    onClose();
  };

  const FileUploadSquare = ({
    slot,
    label,
    inputRef,
    accept,
    hint,
    optional = false,
  }: {
    slot: FileSlot;
    label: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    accept: string;
    hint: string;
    optional?: boolean;
  }) => {
    const file = files[slot];
    return (
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-brand-heading">
          {label} {optional && <span className="text-gray-400">(opt)</span>}
        </Label>
        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="aspect-square min-h-[120px] border-2 border-dashed border-brand-border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all"
          >
            <Upload className="h-8 w-8 text-brand-primary mb-1.5" />
            <p className="text-xs font-medium text-brand-heading text-center leading-tight">
              Choose file
            </p>
            <p className="text-[10px] text-brand-light-accent-1 text-center mt-0.5">
              {hint}
            </p>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(slot, f);
              }}
            />
          </div>
        ) : (
          <div className="aspect-square min-h-[120px] border border-brand-border rounded-xl p-3 bg-gray-50 flex flex-col">
            <div className="flex items-start justify-between gap-1">
              <FileText className="h-6 w-6 text-brand-primary shrink-0" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 shrink-0"
                onClick={() => handleFile(slot, null)}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-xs font-medium text-brand-heading truncate mt-1" title={file.name}>
              {file.name}
            </p>
            <p className="text-[10px] text-brand-light-accent-1 mt-0.5">
              {(file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b border-brand-border pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10">
                <School className="h-6 w-6 text-brand-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-brand-heading">
                  Onboard new school
                </DialogTitle>
                <p className="text-sm text-brand-light-accent-1 mt-0.5">
                  Add school details and documents. You can add classes, teachers and students from the school details after creating.
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 pr-2 -mr-2 space-y-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-school_name">School name</Label>
                <Input
                  id="modal-school_name"
                  value={form.school_name}
                  onChange={(e) => setField("school_name", e.target.value)}
                  onBlur={(e) => setField("school_name", formatTitle(e.target.value))}
                  placeholder="e.g. Best Tech Academy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-school_email">School email</Label>
                <Input
                  id="modal-school_email"
                  type="email"
                  value={form.school_email}
                  onChange={(e) => setField("school_email", e.target.value)}
                  placeholder="info@school.edu"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-school_phone">School phone</Label>
                <Input
                  id="modal-school_phone"
                  type="tel"
                  value={form.school_phone}
                  onChange={(e) => setField("school_phone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="08100000000"
                />
              </div>
              <div className="space-y-2 sm:col-span-2 sm:col-end-2">
                <Label htmlFor="modal-school_address">School address</Label>
                <Input
                  id="modal-school_address"
                  value={form.school_address}
                  onChange={(e) => setField("school_address", e.target.value)}
                  onBlur={(e) => setField("school_address", formatTitle(e.target.value))}
                  placeholder="e.g. 123, Oke Ado, Ibadan, Oyo"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.school_type} onValueChange={(v) => setField("school_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SCHOOL_TYPES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ownership</Label>
                <Select value={form.school_ownership} onValueChange={(v) => setField("school_ownership", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SCHOOL_OWNERSHIPS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Academic year</Label>
                <Select value={form.academic_year} onValueChange={(v) => setField("academic_year", v)}>
                  <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                  <SelectContent>
                    {academicYears.map((y) => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Term</Label>
                <Select value={form.current_term} onValueChange={(v) => setField("current_term", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TERMS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modal-term_start">Term start date</Label>
                <Input
                  id="modal-term_start"
                  type="date"
                  value={formatDateForInput(form.term_start_date)}
                  onChange={(e) =>
                    setField("term_start_date", e.target.value ? new Date(e.target.value).toISOString() : "")
                  }
                  min={min}
                  max={max}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modal-term_end">Term end date (optional)</Label>
                <Input
                  id="modal-term_end"
                  type="date"
                  value={formatDateForInput(form.term_end_date ?? "")}
                  onChange={(e) =>
                    setField("term_end_date", e.target.value ? new Date(e.target.value).toISOString() : "")
                  }
                  min={min}
                  max={max}
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-brand-heading">Documents</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <FileUploadSquare
                  slot="cac"
                  label="CAC / approval letter"
                  inputRef={cacRef}
                  accept=".pdf,application/pdf"
                  hint="PDF, 5MB"
                />
                <FileUploadSquare
                  slot="utility"
                  label="Utility bill"
                  inputRef={utilityRef}
                  accept=".pdf,application/pdf"
                  hint="PDF, 5MB"
                />
                <FileUploadSquare
                  slot="tax"
                  label="Tax clearance"
                  inputRef={taxRef}
                  accept=".pdf,application/pdf"
                  hint="PDF, 5MB"
                />
                <FileUploadSquare
                  slot="icon"
                  label="School logo"
                  inputRef={iconRef}
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                  hint="PNG/JPG, 5MB"
                  optional
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-brand-border">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={!isFormValid || onboardSchool.isPending}
              onClick={handleSubmit}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              {onboardSchool.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create school"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={errorModal} onOpenChange={setErrorModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-brand-light-accent-1">{errorMessage}</p>
          <Button onClick={() => setErrorModal(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
