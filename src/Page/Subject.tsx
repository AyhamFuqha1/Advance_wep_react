import FileCard from "../components/FileCard";
import { Upload, Brain, HelpCircle, Loader2, BookOpen } from "lucide-react";
import { UploadModal } from "../components/UploadModal";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "../components/contexts/ToastContext";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { useParams } from "react-router-dom";
import useAuthenticatedMutation from "../hooks/useAuthenticatedMutation";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import api from "../config/axios.config";
import {
  AI_QUIZZES_ENDPOINT,
  AI_SUMMARIES_ENDPOINT,
  aiRequestConfig,
  type QuizDifficulty,
} from "../config/aiEndpoints";
import type { AiResultModalState, QuizApiResponse, SummaryApiResponse } from "../interfaces/aiContent";
import AiResultModal from "../components/AiResultModal";
import QuizDifficultyModal from "../components/QuizDifficultyModal";
import { coerceQuizResponse, coerceSummaryResponse } from "../utils/aiPayload";
interface StudyFile {
  id: number;
  file_name: string;
  created_at: string;
  type?: "pdf" | "doc";
}

type SubjectApiResponse = StudyFile[] | { files?: StudyFile[]; name?: string };

function formatApiError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return error.message || fallback;
    }
    const status = error.response.status;
    const raw = error.response.data;
    if (typeof raw === "string") {
      return status >= 500
        ? `Server error (${status}). Check Laravel logs.`
        : `Request failed (${status})`;
    }
    const d = raw as Record<string, unknown> | undefined;
    if (d && typeof d.message === "string") return d.message;
    if (d && typeof d.error === "string") return d.error;
    if (d?.errors && typeof d.errors === "object") {
      const errs = d.errors as Record<string, string[] | string>;
      for (const v of Object.values(errs)) {
        if (Array.isArray(v) && typeof v[0] === "string") return v[0];
        if (typeof v === "string") return v;
      }
    }
    return `Request failed (${status})`;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

function normalizeSubjectFiles(raw: SubjectApiResponse | undefined): StudyFile[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  return Array.isArray(raw.files) ? raw.files : [];
}

function subjectHeading(raw: SubjectApiResponse | undefined): string {
  if (raw && !Array.isArray(raw) && typeof raw.name === "string" && raw.name.trim()) {
    return raw.name;
  }
  return "Study materials";
}
const Subject = () => {
  const { id } = useParams();
  const subjectId = Number(id);
  const [idDelete, setIdDelete] = useState<number | null>(null);
  const { showToast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { data, isLoading } = useAuthenticatedQuery({
    url: `/subjects/${subjectId}`,
    key: ["subject", String(subjectId)],
  });
  const { mutate: uploadFile } = useAuthenticatedMutation({
    url: "/files",
    method: "post",
  });

  const { mutate: DeleteFile } = useAuthenticatedMutation({
    url: `/files/${idDelete}`,
    method: "delete",
  });
  const queryClient = useQueryClient();

  const files = useMemo(
    () => normalizeSubjectFiles(data as SubjectApiResponse | undefined),
    [data],
  );
  const heading = useMemo(
    () => subjectHeading(data as SubjectApiResponse | undefined),
    [data],
  );

  const [loadingSummaryFileId, setLoadingSummaryFileId] = useState<number | null>(null);
  const [loadingQuizFileId, setLoadingQuizFileId] = useState<number | null>(null);
  const [subjectSummaryLoading, setSubjectSummaryLoading] = useState(false);
  const [subjectQuizLoading, setSubjectQuizLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResultModalState | null>(null);
  const [quizDifficultyModal, setQuizDifficultyModal] = useState<{
    materialId: number;
    fromHeader: boolean;
    fileLabel?: string;
  } | null>(null);

  /** Laravel always requires subject_id + material_id (file). */
  const resolveSingleMaterialForHeader = (): number | null => {
    if (files.length === 1) return files[0].id;
    return null;
  };

  const handleFileSummary = async (fileId: number) => {
    setLoadingSummaryFileId(fileId);
    try {
      const { data } = await api.post<SummaryApiResponse>(
        AI_SUMMARIES_ENDPOINT,
        {
          subject_id: subjectId,
          material_id: fileId,
        },
        aiRequestConfig,
      );
      const normalized = coerceSummaryResponse(data);
      if (!normalized) {
        showToast("Unexpected response from server (summary).", "error");
        return;
      }
      showToast("Summary ready", "success");
      setAiResult({ kind: "summary", data: normalized });
    } catch (e) {
      showToast(formatApiError(e, "Failed to generate summary"), "error");
    } finally {
      setLoadingSummaryFileId(null);
    }
  };

  const openQuizPicker = (materialId: number, fromHeader: boolean) => {
    const fileLabel = files.find((f) => f.id === materialId)?.file_name;
    setQuizDifficultyModal({ materialId, fromHeader, fileLabel });
  };

  const runQuizGeneration = async (
    materialId: number,
    difficulty: QuizDifficulty,
    fromHeader: boolean,
  ) => {
    if (fromHeader) setSubjectQuizLoading(true);
    else setLoadingQuizFileId(materialId);
    try {
      const { data } = await api.post<QuizApiResponse>(
        AI_QUIZZES_ENDPOINT,
        {
          subject_id: subjectId,
          material_id: materialId,
          difficulty,
        },
        aiRequestConfig,
      );
      const normalized = coerceQuizResponse(data);
      if (!normalized) {
        showToast("Unexpected response from server (quiz).", "error");
        return;
      }
      showToast("Quiz ready", "success");
      setAiResult({ kind: "quiz", data: normalized });
    } catch (e) {
      showToast(formatApiError(e, "Failed to generate quiz"), "error");
    } finally {
      if (fromHeader) setSubjectQuizLoading(false);
      else setLoadingQuizFileId(null);
    }
  };

  const handleQuizDifficultyChosen = (difficulty: QuizDifficulty) => {
    if (!quizDifficultyModal) return;
    const { materialId, fromHeader } = quizDifficultyModal;
    setQuizDifficultyModal(null);
    void runQuizGeneration(materialId, difficulty, fromHeader);
  };

  const handleFileQuizRequest = (fileId: number) => {
    openQuizPicker(fileId, false);
  };

  const handleSubjectQuizClick = () => {
    const materialId = resolveSingleMaterialForHeader();
    if (materialId === null) {
      if (files.length === 0) {
        showToast("Upload at least one file first.", "warning");
      } else {
        showToast(
          "This subject has several files — use Quiz on the file card you want.",
          "info",
        );
      }
      return;
    }
    openQuizPicker(materialId, true);
  };

  const handleSubjectSummary = async () => {
    const materialId = resolveSingleMaterialForHeader();
    if (materialId === null) {
      if (files.length === 0) {
        showToast("Upload at least one file first.", "warning");
      } else {
        showToast(
          "This subject has several files — use Summary on the file card you want.",
          "info",
        );
      }
      return;
    }
    setSubjectSummaryLoading(true);
    try {
      const { data } = await api.post<SummaryApiResponse>(
        AI_SUMMARIES_ENDPOINT,
        {
          subject_id: subjectId,
          material_id: materialId,
        },
        aiRequestConfig,
      );
      const normalized = coerceSummaryResponse(data);
      if (!normalized) {
        showToast("Unexpected response from server (summary).", "error");
        return;
      }
      showToast("Summary ready", "success");
      setAiResult({ kind: "summary", data: normalized });
    } catch (e) {
      showToast(formatApiError(e, "Failed to generate summary"), "error");
    } finally {
      setSubjectSummaryLoading(false);
    }
  };

  const handleUploadComplete = (file: File) => {
    const fd = new FormData();
    fd.append("subject_id", String(subjectId));
    fd.append("file", file);
    uploadFile(fd, {
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
              {heading}
            </h1>
            <p className="text-lg" style={{ color: "#555555" }}>
              Manage your materials and generate AI content
            </p>
          </div>
          <div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
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
                type="button"
                disabled={subjectSummaryLoading}
                className="h-10 px-5 rounded-full flex items-center gap-2 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
                  color: "#1a1a1a",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  if (subjectSummaryLoading) return;
                  e.currentTarget.style.borderColor = "#555555";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
                onClick={handleSubjectSummary}
              >
                {subjectSummaryLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                Generate Summary
              </button>

              <button
                type="button"
                disabled={subjectQuizLoading}
                className="h-10 px-5 rounded-full flex items-center gap-2 font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:pointer-events-none"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e5e5",
                  color: "#1a1a1a",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  if (subjectQuizLoading) return;
                  e.currentTarget.style.borderColor = "#555555";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
                onClick={handleSubjectQuizClick}
              >
                {subjectQuizLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <HelpCircle className="w-4 h-4" />
                )}
                Generate Quiz
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {files.length > 0 ? (
            files.map((file: StudyFile) => {
              return (
                <FileCard
                  key={file.id}
                  fileId={file.id}
                  name={file.file_name}
                  date={file.created_at}
                  onDelete={() => handelDeleteComplete(file.id)}
                  onGenerateSummary={() => handleFileSummary(file.id)}
                  onGenerateQuiz={() => handleFileQuizRequest(file.id)}
                  summaryLoading={loadingSummaryFileId === file.id}
                  quizLoading={
                    loadingQuizFileId === file.id ||
                    (subjectQuizLoading && files.length === 1 && file.id === files[0]?.id)
                  }
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
      <AiResultModal state={aiResult} onClose={() => setAiResult(null)} />
      <QuizDifficultyModal
        isOpen={quizDifficultyModal !== null}
        fileLabel={quizDifficultyModal?.fileLabel}
        onClose={() => setQuizDifficultyModal(null)}
        onChoose={handleQuizDifficultyChosen}
      />
    </div>
  );
};

export default Subject;
