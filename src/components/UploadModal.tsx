import { useState, useRef } from "react";
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "./contexts/ToastContext";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file:File) => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: UploadModalProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(
    null,
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.endsWith(".pdf")
    ) {
      showToast(
        "Please upload PDF or presentation files only",
        "error",
      );
      setUploadError(true);
      setTimeout(() => setUploadError(false), 2000);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Please select a file first", "error");
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsUploading(false);
    setUploadSuccess(true);

    // Call the completion callback
    onUploadComplete(selectedFile);

    // Reset and close after a short delay
    setTimeout(() => {
      setUploadSuccess(false);
      setSelectedFile(null);
      onClose();
    }, 1500);
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const resetModal = () => {
    setSelectedFile(null);
    setUploadSuccess(false);
    setUploadError(false);
    setIsUploading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(4px)",
        }}
        onClick={resetModal}
      />

      {/* Modal Card */}
      <div
        className="relative w-full max-w-md animate-scale-in"
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100"
          style={{ color: "#555555" }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-2xl font-serif mb-2"
            style={{ color: "#1a1a1a" }}
          >
            Upload Material
          </h2>
          <p className="text-sm" style={{ color: "#555555" }}>
            Upload your study files (PDF, Slides)
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClickUpload}
          className="cursor-pointer transition-all duration-300"
          style={{
            border: `2px dashed ${isDragging ? "#5b8dd9" : "#e5e5e5"}`,
            borderRadius: "16px",
            padding: "40px 20px",
            background: isDragging ? "#f7f9fc" : "#fafafa",
            minHeight: "150px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300"
            style={{
              background: isDragging ? "#5b8dd9" : "#e5e5e5",
              color: isDragging ? "#ffffff" : "#555555",
            }}
          >
            <Upload className="w-7 h-7" />
          </div>

          {/* Text */}
          {selectedFile ? (
            <div className="text-center">
              <p
                className="font-medium mb-1"
                style={{ color: "#1a1a1a" }}
              >
                {selectedFile.name}
              </p>
              <p
                className="text-sm"
                style={{ color: "#777777" }}
              >
                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                MB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p
                className="font-medium mb-1"
                style={{ color: "#1a1a1a" }}
              >
                Drag & drop or click to upload
              </p>
              <p
                className="text-sm"
                style={{ color: "#777777" }}
              >
                PDF, PPTX files supported
              </p>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={
            !selectedFile || isUploading || uploadSuccess
          }
          className="w-full h-12 rounded-xl font-medium text-white transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          style={{
            background: uploadSuccess
              ? "#10b981"
              : uploadError
                ? "#ef4444"
                : "#3a3a3a",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={(e) => {
            if (
              !isUploading &&
              !uploadSuccess &&
              selectedFile
            ) {
              e.currentTarget.style.background = "#5b8dd9";
            }
          }}
          onMouseLeave={(e) => {
            if (
              !isUploading &&
              !uploadSuccess &&
              !uploadError
            ) {
              e.currentTarget.style.background = "#3a3a3a";
            }
          }}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : uploadSuccess ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Upload Complete!
            </>
          ) : uploadError ? (
            <>
              <XCircle className="w-5 h-5" />
              Upload Failed
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload File
            </>
          )}
        </button>
      </div>
    </div>
  );
}