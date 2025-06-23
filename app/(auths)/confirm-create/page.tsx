"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import SuccessModal from "@/components/home/SuccessModal";

interface UploadedFile {
  name: string;
  size: number;
  progress: number;
}

const ConfirmCreate = () => {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleSubmit = () => {
    if (isAllUploaded()) {
      // Get form data from previous step
      const schoolFormData = localStorage.getItem("schoolFormData");
      const documentData = {
        cac: uploadedFiles.cac,
        utility: uploadedFiles.utility,
        taxId: uploadedFiles.taxId,
      };

      console.log("School Form Data:", JSON.parse(schoolFormData || "{}"));
      console.log("Document Data:", documentData);

      // Clear stored data
      localStorage.removeItem("schoolFormData");

      // Show success modal instead of alert
      setShowSuccessModal(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Redirect to home page after closing the modal
    router.push("/");
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
              JPEG, PNG or PDF format, up to 10MB
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
          accept=".pdf,.jpg,.jpeg,.png"
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
            label="CAC or Government letter of approval"
            inputRef={cacInputRef}
          />

          <FileUploadArea
            type="utility"
            label="Utility bill"
            inputRef={utilityInputRef}
          />

          <FileUploadArea
            type="taxId"
            label="Tax ID certificate or evidence of tax compliance"
            inputRef={taxIdInputRef}
            isOptional
          />

          <Button
            onClick={handleSubmit}
            disabled={!isAllUploaded()}
            className={`w-full py-3 text-white font-medium rounded-lg transition-colors ${
              isAllUploaded()
                ? "bg-brand-primary hover:bg-[#4338CA]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Submit Application
          </Button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal open={showSuccessModal} onClose={handleModalClose} />
    </div>
  );
};

export default ConfirmCreate;
