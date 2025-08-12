"use client";

import React, { useRef, useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle,
  Users,
} from "lucide-react";

type AdminFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type ParsedAdmin = AdminFormData & {
  row: number;
  errors: string[];
};

type AdminUploadSectionProps = {
  existingAdmins: AdminFormData[];
  onAdminsUploaded: (admins: AdminFormData[]) => void;
};

// Normalize phone number by removing leading zeros and ensuring proper format
const normalizePhoneNumber = (phone: string): string => {
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
};

const isValidNigerianPhone = (phone: string): boolean => {
  const normalizedPhone = normalizePhoneNumber(phone);
  return (
    normalizedPhone.length === 11 && /^0[789][01]\d{8}$/.test(normalizedPhone)
  );
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Template placeholder data for validation
const TEMPLATE_PLACEHOLDERS = [
  "michael.johnson@school.edu.ng",
  "sarah.williams@school.edu.ng",
  "michael",
  "sarah",
  "johnson",
  "williams",
];

function isPlaceholderData(value: string): boolean {
  return TEMPLATE_PLACEHOLDERS.includes(value.toLowerCase().trim());
}
const TEMPLATE_DATA = [
  {
    "First Name": "Michael",
    "Last Name": "Johnson",
    Email: "michael.johnson@school.edu.ng",
    "Phone Number": "08012345678",
  },
  {
    "First Name": "Sarah",
    "Last Name": "Williams",
    Email: "sarah.williams@school.edu.ng",
    "Phone Number": "08098765432",
  },
];

const AdminUploadSection: React.FC<AdminUploadSectionProps> = ({
  existingAdmins,
  onAdminsUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [parsedAdmins, setParsedAdmins] = useState<ParsedAdmin[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_DATA);
    const workbook = XLSX.utils.book_new();

    // Set column widths
    const colWidths = [
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 35 }, // Email
      { wch: 15 }, // Phone Number
    ];
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, "Admins Template");
    XLSX.writeFile(workbook, "admins_template.xlsx");

    setShowTemplateModal(true);
  };

  const handleFileUpload = useCallback(
    (file: File) => {
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];

      if (!allowedTypes.includes(file.type)) {
        // Show error for invalid file type
        setParsedAdmins([
          {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            row: 0,
            errors: ["Please upload a valid Excel (.xlsx, .xls) or CSV file."],
          },
        ]);
        setShowPreviewModal(true);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // Show error for file too large
        setParsedAdmins([
          {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            row: 0,
            errors: ["File size must be less than 10MB."],
          },
        ]);
        setShowPreviewModal(true);
        return;
      }

      // Parse the file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (jsonData.length < 2) {
            setParsedAdmins([
              {
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                row: 0,
                errors: ["The file appears to be empty or has no data rows."],
              },
            ]);
            setShowPreviewModal(true);
            return;
          }

          // Check if header row exists and has required columns
          const headerRow = jsonData[0] as string[];
          const requiredColumns = [
            "First Name",
            "Last Name",
            "Email",
            "Phone Number",
          ];

          const columnIndexes: { [key: string]: number } = {};
          const missingColumns: string[] = [];

          requiredColumns.forEach((col) => {
            const index = headerRow.findIndex(
              (header) =>
                typeof header === "string" &&
                header.trim().toLowerCase() === col.toLowerCase()
            );
            if (index === -1) {
              missingColumns.push(col);
            } else {
              columnIndexes[col] = index;
            }
          });

          if (missingColumns.length > 0) {
            setParsedAdmins([
              {
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                row: 0,
                errors: [
                  `Missing required columns: ${missingColumns.join(", ")}`,
                ],
              },
            ]);
            setShowPreviewModal(true);
            return;
          }

          // Parse data rows
          const parsedData: ParsedAdmin[] = [];
          const dataRows = jsonData.slice(1) as (string | number)[][];

          dataRows.forEach((row, index) => {
            const rowNumber = index + 2; // Excel row number (header is row 1)
            const errors: string[] = [];

            const firstName = String(
              row[columnIndexes["First Name"]] || ""
            ).trim();
            const lastName = String(
              row[columnIndexes["Last Name"]] || ""
            ).trim();
            const email = String(row[columnIndexes["Email"]] || "")
              .trim()
              .toLowerCase();
            const phoneNumber = String(
              row[columnIndexes["Phone Number"]] || ""
            ).trim();

            // Validation
            if (!firstName || isPlaceholderData(firstName)) {
              errors.push(
                "First Name is required and cannot be placeholder data"
              );
            }
            if (!lastName || isPlaceholderData(lastName)) {
              errors.push(
                "Last Name is required and cannot be placeholder data"
              );
            }
            if (!email || isPlaceholderData(email)) {
              errors.push("Email is required and cannot be placeholder data");
            } else if (!isValidEmail(email)) {
              errors.push("Invalid email format");
            }
            if (!phoneNumber || isPlaceholderData(phoneNumber)) {
              errors.push(
                "Phone Number is required and cannot be placeholder data"
              );
            } else if (!isValidNigerianPhone(phoneNumber)) {
              errors.push("Invalid Nigerian phone number format");
            }

            // Check for duplicates
            const isDuplicateInFile = parsedData.some(
              (admin) => admin.email === email
            );
            const isDuplicateExisting = existingAdmins.some(
              (admin) => admin.email === email
            );

            if (isDuplicateInFile) {
              errors.push("Duplicate email within the file");
            }
            if (isDuplicateExisting) {
              errors.push("Email already exists in the system");
            }

            parsedData.push({
              firstName,
              lastName,
              email,
              phoneNumber: phoneNumber ? normalizePhoneNumber(phoneNumber) : "",
              row: rowNumber,
              errors,
            });
          });

          setParsedAdmins(parsedData);
          setShowPreviewModal(true);
        } catch {
          setParsedAdmins([
            {
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              row: 0,
              errors: ["Failed to read the file. Please try again."],
            },
          ]);
          setShowPreviewModal(true);
        }
      };
      reader.readAsBinaryString(file);
    },
    [existingAdmins]
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
    const validAdmins = parsedAdmins.filter(
      (admin) => admin.errors.length === 0
    );

    const uniqueAdmins = validAdmins.filter((admin, index, array) => {
      return array.findIndex((a) => a.email === admin.email) === index;
    });

    const adminsToAdd = uniqueAdmins.map((admin) => ({
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
    }));

    onAdminsUploaded(adminsToAdd);
    setShowPreviewModal(false);
    setParsedAdmins([]);
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-brand-heading">
            Bulk Upload Admins
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
              <FileSpreadsheet className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-brand-heading mb-2">
              Upload Excel or CSV file
            </h4>
            <p className="text-brand-light-accent-2 text-sm mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-brand-light-accent-2 mb-4">
              Supported formats: .xlsx, .xls, .csv (Max size: 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileInputChange}
              className="hidden"
              id="admin-file-upload"
            />
            <label htmlFor="admin-file-upload">
              <Button
                type="button"
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
          </div>
        </div>
      </div>{" "}
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
      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-primary" />
              Upload Preview
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {parsedAdmins.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>
                    {
                      parsedAdmins.filter((admin) => admin.errors.length === 0)
                        .length
                    }{" "}
                    valid,{" "}
                    {
                      parsedAdmins.filter((admin) => admin.errors.length > 0)
                        .length
                    }{" "}
                    invalid
                  </span>
                </div>
                <div className="space-y-3">
                  {parsedAdmins.map((admin, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        admin.errors.length === 0
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {admin.errors.length === 0 ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium text-gray-900">
                              {admin.firstName} {admin.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              Row {admin.row}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Email: {admin.email}</div>
                            <div>Phone: {admin.phoneNumber}</div>
                          </div>
                        </div>
                      </div>
                      {admin.errors.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-red-200">
                          <div className="text-xs text-red-700">
                            {admin.errors.map((error, errorIndex) => (
                              <div key={errorIndex}>• {error}</div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setShowPreviewModal(false)}
            >
              Cancel
            </Button>
            {parsedAdmins.filter((admin) => admin.errors.length === 0).length >
              0 && (
              <Button
                onClick={handleConfirmUpload}
                className="bg-brand-primary hover:bg-brand-primary/90 text-white"
              >
                Add{" "}
                {
                  parsedAdmins.filter((admin) => admin.errors.length === 0)
                    .length
                }{" "}
                Admin
                {parsedAdmins.filter((admin) => admin.errors.length === 0)
                  .length !== 1
                  ? "s"
                  : ""}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUploadSection;
