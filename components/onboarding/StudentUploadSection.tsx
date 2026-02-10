"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import * as XLSX from "xlsx";

type StudentFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  studentClass: string;
};

type ParsedStudent = StudentFormData & {
  row: number;
  errors: string[];
};

interface StudentUploadSectionProps {
  availableClasses: string[];
  existingStudents: StudentFormData[];
  onStudentsUploaded: (students: StudentFormData[]) => void;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");

  if (cleanPhone.length === 10 && cleanPhone.startsWith("8")) {
    return "0" + cleanPhone;
  } else if (cleanPhone.length === 10 && cleanPhone.startsWith("7")) {
    return "0" + cleanPhone;
  } else if (cleanPhone.length === 10 && cleanPhone.startsWith("9")) {
    return "0" + cleanPhone;
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith("234")) {
    return "0" + cleanPhone.substring(3);
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith("0")) {
    return cleanPhone;
  }

  return cleanPhone;
}

function isValidPhoneNumber(phone: string) {
  const normalizedPhone = normalizePhoneNumber(phone);
  return (
    normalizedPhone.length === 11 && /^0[789][01]\d{8}$/.test(normalizedPhone)
  );
}

export default function StudentUploadSection({
  availableClasses,
  existingStudents,
  onStudentsUploaded,
}: StudentUploadSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showDownloadTemplateDialog, setShowDownloadTemplateDialog] = useState(false);
  const [selectedClassForTemplate, setSelectedClassForTemplate] = useState<string>("");
  const [totalStudentsForTemplate, setTotalStudentsForTemplate] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  /** After a successful bulk add, show this instead of upload UI so the list is the focus */
  const [lastBulkUploadCount, setLastBulkUploadCount] = useState<number | null>(null);

  useEffect(() => {
    if (existingStudents.length === 0) setLastBulkUploadCount(null);
  }, [existingStudents.length]);

  const generateAndDownloadTemplate = (selectedClass: string, totalStudents: number) => {
    const templateData: Record<string, string>[] = [];
    for (let i = 0; i < totalStudents; i++) {
      templateData.push({
        "First Name": "",
        "Last Name": "",
        Email: "",
        "Phone Number": "",
        "Student Class": selectedClass,
      });
    }

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_template.xlsx");

    setShowDownloadTemplateDialog(false);
    setSelectedClassForTemplate("");
    setTotalStudentsForTemplate("");
    setShowTemplateModal(true);
  };

  const handleDownloadTemplateClick = () => {
    if (availableClasses.length === 0) {
      setErrorMessage("Add at least one class before downloading the template.");
      setShowErrorModal(true);
      return;
    }
    setShowDownloadTemplateDialog(true);
  };

  const handleConfirmDownloadTemplate = () => {
    const classSelected = selectedClassForTemplate.trim();
    const total = parseInt(totalStudentsForTemplate, 10);
    if (!classSelected) {
      setErrorMessage("Please select a class.");
      setShowErrorModal(true);
      return;
    }
    if (!totalStudentsForTemplate.trim() || isNaN(total) || total < 1 || total > 1000) {
      setErrorMessage("Please enter a valid number of students (1–1000).");
      setShowErrorModal(true);
      return;
    }
    generateAndDownloadTemplate(classSelected, total);
  };

  const parseUploadedFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const arrayBuffer = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const parsed: ParsedStudent[] = (
            jsonData as Record<string, unknown>[]
          ).map((row, index: number) => {
            const errors: string[] = [];

            const firstName = String(
              row["First Name"] || row["first_name"] || row["firstName"] || ""
            ).trim();
            const lastName = String(
              row["Last Name"] || row["last_name"] || row["lastName"] || ""
            ).trim();
            const email = String(row["Email"] || row["email"] || "").trim();
            const phoneNumber = normalizePhoneNumber(
              String(
                row["Phone Number"] ||
                  row["phone_number"] ||
                  row["phoneNumber"] ||
                  ""
              )
            );
            const studentClass = String(
              row["Student Class"] ||
                row["Default Class"] ||
                row["student_class"] ||
                row["default_class"] ||
                ""
            ).trim();

            // Required fields and format validation
            if (!firstName.trim()) errors.push("First name is required");
            if (!lastName.trim()) errors.push("Last name is required");
            if (!email.trim()) errors.push("Email is required");
            else if (!isValidEmail(email)) {
              errors.push("Invalid email format");
            }
            if (!phoneNumber.trim()) errors.push("Phone number is required");
            else if (!isValidPhoneNumber(phoneNumber)) {
              errors.push("Phone number must be 11 digits");
            }
            if (!studentClass.trim()) errors.push("Student class is required");
            else if (
              !availableClasses.some((c) => c.trim().toLowerCase() === studentClass.trim().toLowerCase())
            ) {
              errors.push(
                `Class "${studentClass}" not found. Available classes: ${availableClasses.join(
                  ", "
                )}`
              );
            }

            // Check for duplicate email in existing students
            if (
              email &&
              existingStudents.some(
                (student) => student.email.toLowerCase() === email.toLowerCase()
              )
            ) {
              errors.push("Email already exists in added students");
            }

            return {
              firstName: firstName,
              lastName: lastName,
              email: email.toLowerCase(),
              phoneNumber: phoneNumber,
              studentClass: studentClass,
              row: index + 2,
              errors,
            };
          });

          // Require the same class for all rows
          const uniqueClasses = [...new Set(parsed.map((p) => p.studentClass.trim().toLowerCase()).filter(Boolean))];
          if (uniqueClasses.length > 1) {
            setErrorMessage(
              "The Student Class column must have the same value for all rows. Please use one class for the entire upload, then try again."
            );
            setShowErrorModal(true);
            setIsUploading(false);
            return;
          }

          if (parsed.length === 0) {
            setErrorMessage(
              "No student rows found in the file. Check that the file has the expected columns: First Name, Last Name, Email, Phone Number, Student Class."
            );
            setShowErrorModal(true);
          } else {
            setParsedStudents(parsed);
            setShowPreviewModal(true);
          }
        } catch (error) {
          console.error("Error parsing file:", error);
          setErrorMessage(
            "Failed to parse the uploaded file. Please ensure it's a valid Excel or CSV file."
          );
          setShowErrorModal(true);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setErrorMessage("Failed to read the file. Please try again.");
        setShowErrorModal(true);
        setIsUploading(false);
      };

      reader.readAsArrayBuffer(file);
    },
    [availableClasses, existingStudents]
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage(
          "Please upload a valid Excel (.xlsx, .xls) or CSV file."
        );
        setShowErrorModal(true);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File size must be less than 10MB.");
        setShowErrorModal(true);
        return;
      }

      setIsUploading(true);
      parseUploadedFile(file);
    },
    [parseUploadedFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
      e.target.value = ""; // reset so selecting the same file again (e.g. after editing) still triggers onChange
    }
  };

  const handleConfirmUpload = () => {
    const validStudents = parsedStudents.filter(
      (student) => student.errors.length === 0
    );

    const uniqueStudents = validStudents.filter((student, index, array) => {
      return array.findIndex((s) => s.email === student.email) === index;
    });

    const studentsToAdd = uniqueStudents.map((student) => ({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      studentClass: student.studentClass,
    }));

    onStudentsUploaded(studentsToAdd);
    setShowPreviewModal(false);
    setParsedStudents([]);
    setLastBulkUploadCount(studentsToAdd.length);
  };

  return (
    <>
      <div className="mb-8">
        {lastBulkUploadCount !== null ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-brand-heading font-medium">
              {lastBulkUploadCount} student{lastBulkUploadCount === 1 ? "" : "s"} added to the list below.
            </p>
            <p className="text-sm text-brand-light-accent-1 mt-1">
              Review the list and click &quot;Save students&quot; when ready, or upload another file.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 gap-2"
              onClick={() => setLastBulkUploadCount(null)}
            >
              <Upload className="w-4 h-4" />
              Upload another file
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-brand-heading">
                Bulk Upload Students
              </h3>
              <Button
                onClick={handleDownloadTemplateClick}
                variant="outline"
                className="flex items-center gap-2"
                disabled={availableClasses.length === 0}
                title={availableClasses.length === 0 ? "Add classes first to download the template" : undefined}
              >
                <Download className="w-4 h-4" />
                Download Template
              </Button>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <h4 className="text-lg font-medium text-brand-heading mb-2">
                  {isUploading ? "Processing file..." : "Upload Excel or CSV file"}
                </h4>
                <p className="text-brand-light-accent-2 text-sm mb-4">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-brand-light-accent-2 mb-4">
                  Supported formats: .xlsx, .xls, .csv (Max size: 10MB)
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="student-file-upload"
                  disabled={isUploading}
                />
                <label htmlFor="student-file-upload">
                  <Button
                    type="button"
                    disabled={isUploading}
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white"
                    asChild
                  >
                    <span className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Required columns:</h4>
              <div className="text-sm text-blue-800 grid grid-cols-2 gap-2">
                <span>• First Name</span>
                <span>• Last Name</span>
                <span>• Email</span>
                <span>• Phone Number (11 digits)</span>
                <span>• Student Class</span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-blue-800">
                  <strong>Available Classes:</strong> {availableClasses.length > 0 ? availableClasses.join(", ") : "None yet — add classes first, then download the template to get a file with the class column pre-filled."}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Download Template: Select class + total students */}
      <Dialog open={showDownloadTemplateDialog} onOpenChange={setShowDownloadTemplateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Download student template
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-muted-foreground text-sm">
              Select the class for this batch and how many students you want to onboard. The template will have the <strong>Student Class</strong> column pre-filled; do not edit that column when filling in the file.
            </p>
            <div className="space-y-2">
              <Label htmlFor="template-class">Class (required)</Label>
              <Select
                value={selectedClassForTemplate}
                onValueChange={setSelectedClassForTemplate}
              >
                <SelectTrigger id="template-class">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-total">Total number of students to onboard</Label>
              <Input
                id="template-total"
                type="number"
                min={1}
                max={1000}
                placeholder="e.g. 25"
                value={totalStudentsForTemplate}
                onChange={(e) => setTotalStudentsForTemplate(e.target.value)}
              />
            </div>
            <Button
              onClick={handleConfirmDownloadTemplate}
              disabled={
                !selectedClassForTemplate.trim() ||
                !totalStudentsForTemplate.trim() ||
                (() => {
                  const n = parseInt(totalStudentsForTemplate, 10);
                  return isNaN(n) || n < 1 || n > 1000;
                })()
              }
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download template
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Download Success Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Template downloaded successfully
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              The <strong>Student Class</strong> column is pre-filled for all rows. Do not edit or remove it—the backend uses it to assign students to the correct class.
            </p>
            <p className="text-muted-foreground mb-4">
              Fill in First Name, Last Name, Email, and Phone Number for each row. The Student Class column is already set for all rows.
            </p>
            <Button
              onClick={() => setShowTemplateModal(false)}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Preview Upload ({parsedStudents.length} students found)
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-green-600">
                  ✓ Valid:{" "}
                  {parsedStudents.filter((s) => s.errors.length === 0).length}
                </span>
                <span className="text-red-600">
                  ✗ Errors:{" "}
                  {parsedStudents.filter((s) => s.errors.length > 0).length}
                </span>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {parsedStudents.map((student, index) => (
                <div
                  key={`${student.email}-${student.row}-${index}`}
                  className={`p-3 rounded border ${
                    student.errors.length === 0
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email} • {student.phoneNumber} •{" "}
                        {student.studentClass}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Row {student.row}
                      </span>
                      {student.errors.length === 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  {student.errors.length > 0 && (
                    <div className="mt-2">
                      <ul className="text-xs text-red-600">
                        {student.errors.map((error, i) => (
                          <li key={`${student.row}-error-${i}`}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowPreviewModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUpload}
                className="flex-1 bg-brand-primary hover:bg-brand-primary/90 text-white"
                disabled={
                  parsedStudents.filter((s) => s.errors.length === 0).length ===
                  0
                }
              >
                Add {parsedStudents.filter((s) => s.errors.length === 0).length}{" "}
                Valid Students
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Error
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">{errorMessage}</p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowErrorModal(false)}
                variant="outline"
                className="flex-1"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setShowErrorModal(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
