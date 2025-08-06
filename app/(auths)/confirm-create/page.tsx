"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/home/SuccessModal";
import ErrorModal from "@/components/home/ErrorModal";
import { registerSchool } from "@/lib/api/registration";

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
  file: File; // Add the actual File object
}

const ConfirmCreate = () => {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState<{
    cac: UploadedFile | null;
    utility: UploadedFile | null;
    taxId: UploadedFile | null;
  }>({
    cac: null,
    utility: null,
    taxId: null,
  });

  const cacInputRef = useRef<HTMLInputElement>(null!);
  const utilityInputRef = useRef<HTMLInputElement>(null!);
  const taxIdInputRef = useRef<HTMLInputElement>(null!);

  const handleFileUpload = (type: "cac" | "utility" | "taxId", file: File) => {
    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      progress: 0,
      file: file, // Store the actual File object
    };

    setUploadedFiles((prev) => ({ ...prev, [type]: newFile }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadedFiles((prev) => {
        const currentFile = prev[type];
        if (currentFile && currentFile.progress < 100) {
          return {
            ...prev,
            [type]: { ...currentFile, progress: currentFile.progress + 10 },
          };
        }
        clearInterval(interval);
        return prev;
      });
    }, 100);
  };

  const removeFile = (type: "cac" | "utility" | "taxId") => {
    setUploadedFiles((prev) => ({ ...prev, [type]: null }));
  };

  const formatFileSize = (bytes: number) => {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isAllUploaded = () => {
    return (
      uploadedFiles.cac &&
      uploadedFiles.utility &&
      uploadedFiles.taxId &&
      uploadedFiles.cac.progress === 100 &&
      uploadedFiles.utility.progress === 100 &&
      uploadedFiles.taxId.progress === 100
    );
  };

  const handleSubmit = async () => {
    if (!isAllUploaded()) return;

    setIsSubmitting(true);

    try {
      // Get form data from previous step
      const schoolFormDataString = localStorage.getItem("schoolFormData");
      if (!schoolFormDataString) {
        setErrorMessage(
          "School information is missing. Please start the registration process again."
        );
        setShowErrorModal(true);
        setIsSubmitting(false);
        return;
      }

      const schoolFormData = JSON.parse(schoolFormDataString);

      // Prepare document data
      const documentData = {
        cac: uploadedFiles.cac?.file || null,
        utility: uploadedFiles.utility?.file || null,
        taxId: uploadedFiles.taxId?.file || null,
      };

      // Call registration API
      const response = await registerSchool(schoolFormData, documentData);

      if (response.success && response.statusCode === 201) {
        // Clear stored data on success
        localStorage.removeItem("schoolFormData");
        setShowSuccessModal(true);
      } else {
        // Show error modal
        setErrorMessage(
          response.message || "Registration failed. Please try again."
        );
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to home page after closing the success modal
    router.push("/");
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    // Stay on the current page to allow retry
  };

  const FileUploadArea = ({
    type,
    label,
    inputRef,
    isOptional = false,
  }: {
    type: "cac" | "utility" | "taxId";
    label: string;
    inputRef: React.RefObject<HTMLInputElement>;
    isOptional?: boolean;
  }) => {
    const file = uploadedFiles[type];

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          {label}{" "}
          {isOptional && <span className="text-gray-400">(optional)</span>}
        </Label>

        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-brand-primary transition-colors"
          >
            <Upload className="w-8 h-8 text-brand-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Choose a file or drag & drop it here
            </p>
            <p className="text-xs text-gray-500">
              {type === "cac"
                ? "PDF, DOC, DOCX format, up to 10MB"
                : type === "utility"
                ? "PDF, PNG, JPG format, up to 10MB"
                : "PDF, DOC, DOCX format, up to 10MB"}
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-3 text-brand-primary border-brand-primary"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Browse file
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(type)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{file.progress}%</p>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={
            type === "cac"
              ? ".pdf,.doc,.docx"
              : type === "utility"
              ? ".pdf,.png,.jpg,.jpeg"
              : ".pdf,.doc,.docx"
          }
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              handleFileUpload(type, selectedFile);
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-brand-primary mb-6">
            SmartEdu-Hub
          </h1>

          {/* Step indicators */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div className="w-8 h-0.5 bg-brand-primary mx-2"></div>
              <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Help us verify your school
          </h2>
          <p className="text-gray-500 text-sm">
            Upload official documents of your school to verify it
          </p>
        </div>

        {/* Upload Areas */}
        <div className="space-y-6">
          <FileUploadArea
            type="cac"
            label="CAC or Government approval letter"
            inputRef={cacInputRef}
          />

          <FileUploadArea
            type="utility"
            label="Utility bill"
            inputRef={utilityInputRef}
          />

          <FileUploadArea
            type="taxId"
            label="Tax certificate"
            inputRef={taxIdInputRef}
            isOptional
          />

          <Button
            onClick={handleSubmit}
            disabled={!isAllUploaded() || isSubmitting}
            className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
              isAllUploaded() && !isSubmitting
                ? "bg-brand-primary hover:bg-[#4338CA]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal open={showSuccessModal} onClose={handleSuccessModalClose} />

      {/* Error Modal */}
      <ErrorModal
        open={showErrorModal}
        onClose={handleErrorModalClose}
        message={errorMessage}
      />
    </div>
  );
};

export default ConfirmCreate;
