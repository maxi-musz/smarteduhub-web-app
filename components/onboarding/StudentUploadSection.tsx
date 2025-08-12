"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// Template placeholder data for validation
const TEMPLATE_PLACEHOLDERS = [
  "john.doe@school.edu.ng",
  "jane.smith@school.edu.ng",
  "ahmed.ibrahim@school.edu.ng",
  "john",
  "jane",
  "ahmed",
  "doe",
  "smith",
  "ibrahim",
  "jss1",
  "primary 1",
];

function isPlaceholderData(value: string): boolean {
  return TEMPLATE_PLACEHOLDERS.includes(value.toLowerCase().trim());
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const downloadTemplate = () => {
    const templateData = [
      {
        "First Name": "John",
        "Last Name": "Doe",
        Email: "john.doe@school.edu.ng",
        "Phone Number": "08012345678",
        "Student Class": "JSS1",
      },
      {
        "First Name": "Jane",
        "Last Name": "Smith",
        Email: "jane.smith@school.edu.ng",
        "Phone Number": "8098765432",
        "Student Class": "Primary 1",
      },
      {
        "First Name": "Ahmed",
        "Last Name": "Ibrahim",
        Email: "ahmed.ibrahim@school.edu.ng",
        "Phone Number": "2347012345678",
        "Student Class": availableClasses[0] || "JSS1",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students_template.xlsx");

    setShowTemplateModal(true);
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

            // Check for template placeholders
            if (isPlaceholderData(firstName)) {
              errors.push("Please replace template placeholder data");
            }
            if (isPlaceholderData(lastName)) {
              errors.push("Please replace template placeholder data");
            }
            if (isPlaceholderData(email)) {
              errors.push("Please replace template placeholder data");
            }
            if (isPlaceholderData(studentClass)) {
              errors.push("Please replace template placeholder data");
            }

            // Regular validation
            if (!firstName.trim()) errors.push("First name is required");
            if (!lastName.trim()) errors.push("Last name is required");
            if (!email.trim()) errors.push("Email is required");
            else if (!isValidEmail(email) && !isPlaceholderData(email)) {
              errors.push("Invalid email format");
            }
            if (!phoneNumber.trim()) errors.push("Phone number is required");
            else if (!isValidPhoneNumber(phoneNumber)) {
              errors.push("Phone number must be 11 digits");
            }
            if (!studentClass.trim()) errors.push("Student class is required");
            else if (
              !availableClasses.includes(studentClass) &&
              !isPlaceholderData(studentClass)
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
              !isPlaceholderData(email) &&
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

          setParsedStudents(parsed);
          setShowPreviewModal(true);
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
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-brand-heading">
            Bulk Upload Students
          </h3>
          <Button
            onClick={downloadTemplate}
            variant="outline"
            className="flex items-center gap-2"
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
              <strong>Available Classes:</strong> {availableClasses.join(", ")}
            </p>
          </div>
        </div>
      </div>

      {/* Template Download Success Modal */}
      <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Template Downloaded Successfully
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              Template downloaded successfully. You can update the downloaded
              file and reupload it. To avoid errors when reuploading, remove the
              placeholders used as an example for you.
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
