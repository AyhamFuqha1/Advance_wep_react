import FileCard from "../components/FileCard";
import { Upload, Brain, HelpCircle, Loader2, BookOpen } from "lucide-react";
import { UploadModal } from "../components/UploadModal";
import { useEffect, useState } from "react";
import { useToast } from "../components/contexts/ToastContext";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { useParams } from "react-router-dom";
import useAuthenticatedMutation from "../hooks/useAuthenticatedMutation";

import { useQueryClient } from "@tanstack/react-query";
interface StudyFile {
  id: number;
  file_name: string;
  created_at: string;
  type?: "pdf" | "doc";
}
const Subject = () => {
  const { id } = useParams();
  const subjectId = Number(id);
  const formData = new FormData();
  const [idDelete, setIdDelete] = useState<number | null>(null);
  const { showToast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data, isLoading } = useAuthenticatedQuery({
    url: `/subjects/${subjectId}`,
    key: ["subject", String(subjectId)],
    config: {
      headers: {
        Authorization: `Bearer 2|CWh5bU7xw4OEZH8m4sctsd5WvxYEFdIHtEILhpVk4ce751b3`,
      },
    },
  });
  const { mutate: uploadFile } = useAuthenticatedMutation({
    url: "/files",
    method: "post",
    config: {
      headers: {
        Authorization: `Bearer 2|CWh5bU7xw4OEZH8m4sctsd5WvxYEFdIHtEILhpVk4ce751b3`,
      },
    },
  });

  const { mutate: DeleteFile } = useAuthenticatedMutation({
    url: `/files/${idDelete}`,
    method: "delete",
    config: {
      headers: {
        Authorization: `Bearer 2|CWh5bU7xw4OEZH8m4sctsd5WvxYEFdIHtEILhpVk4ce751b3`,
      },
    },
  });
  const queryClient = useQueryClient();
  const handleUploadComplete = (file: File) => {
    formData.append("subject_id", String(subjectId));
    formData.append("file", file);
    uploadFile(formData, {
      onSuccess: (res) => {
        console.log(res);
        showToast("File uploaded successfully", "success");
        queryClient.invalidateQueries({
          queryKey: ["subject", String(subjectId)],
        });
      },
    
    });
  };
  useEffect(() => {
    if (idDelete !== null) {
      DeleteFile(undefined, {
        onSuccess: (res) => {
          console.log(res);
          showToast("File deleted successfully", "success");
          setIdDelete(null);
          queryClient.invalidateQueries({
            queryKey: ["subject", String(subjectId)],
          });
        },
        onError: () => {
          showToast("Delete failed", "error");
        },
      });
    }
  }, [idDelete]);
  const handelDeleteComplete = (id: number) => {
    setIdDelete(id);
  };
  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  return (
    <div className="min-h-screen" style={{ background: "#f7f7f5" }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-20">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="font-serif mb-2"
              style={{
                fontSize: "clamp(2rem, 5vw, 3rem)",
                color: "#1a1a1a",
              }}
            >
              Mathematics
            </h1>
            <p className="text-lg" style={{ color: "#555555" }}>
              Manage your materials and generate AI content
            </p>
          </div>
          <div>
            <div className="flex flex-wrap gap-3">
              <button
                //  onClick={() => setShowUploadModal(true)}
                className="h-10 px-5 rounded-full flex items-center gap-2 text-white font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "#3a3a3a",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5b8dd9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3a3a3a";
                }}
                onClick={() => setShowUploadModal(true)}
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>

              <button
                //   onClick={() => navigate(`/summary/${subjectId}`)}
                className="h-10 px-5 rounded-full flex items-center gap-2 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
                  color: "#1a1a1a",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#555555";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
              >
                <Brain className="w-4 h-4" />
                Generate Summary
              </button>

              <button
                //    onClick={() => navigate(`/quiz/${subjectId}`)}
                className="h-10 px-5 rounded-full flex items-center gap-2 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
                  color: "#1a1a1a",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#555555";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
              >
                <HelpCircle className="w-4 h-4" />
                Generate Quiz
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {data.length > 0 ? (
            data.map((file: StudyFile) => {
              return (
                <FileCard
                  key={file.id}
                  name={file.file_name}
                  date={new Date(file.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  onDelete={() => handelDeleteComplete(file.id)}
                />
              );
            })
          ) : (
            // Empty State
            <div className="text-center py-20 animate-fade-up">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "#ffffff" }}
              >
                <BookOpen className="w-12 h-12" style={{ color: "#777777" }} />
              </div>
              <h3
                className="text-2xl font-serif mb-2"
                style={{ color: "#1a1a1a" }}
              >
                No files uploaded yet
              </h3>
              <p className="mb-8" style={{ color: "#555555" }}>
                Click "Upload File" to add your study materials
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="h-12 px-8 rounded-full flex items-center gap-2 text-white font-medium mx-auto transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: "#3a3a3a",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5b8dd9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3a3a3a";
                }}
              >
                <Upload className="w-5 h-5" />
                Upload Your First File
              </button>
            </div>
          )}
        </div>
      </div>
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default Subject;
