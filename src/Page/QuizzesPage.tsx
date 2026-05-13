import { Loader2, HelpCircle, FileText, ArrowRight, Layers } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthenticatedQuery from "../hooks/useAuthenticatedQuery";
import { ROUTES } from "../config/routes";
import type { QuizListItem } from "../interfaces/aiLibrary";
import AiResultModal from "../components/AiResultModal";
import type { AiResultModalState, QuizApiResponse } from "../interfaces/aiContent";

function extractList(payload: unknown): QuizListItem[] {
  if (Array.isArray(payload)) return payload as QuizListItem[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const d = (payload as { data: unknown }).data;
    if (Array.isArray(d)) return d as QuizListItem[];
  }
  return [];
}

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [modal, setModal] = useState<AiResultModalState | null>(null);

  const { data, isLoading, isError } = useAuthenticatedQuery({
    key: ["ai-quizzes"],
    url: "/ai/quizzes",
  });

  const items = useMemo(() => extractList(data), [data]);

  const openQuiz = (row: QuizListItem) => {
    const payload: QuizApiResponse = {
      quiz: {
        id: row.id,
        difficulty: row.difficulty,
        subject_id: row.subject?.id,
        questions: row.questions,
      },
    };
    setModal({ kind: "quiz", data: payload });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ background: "#f7f7f5" }}>
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#3a3a3a" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#f7f7f5" }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-20">
        <header className="mb-12 md:mb-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p
                className="text-sm font-medium uppercase tracking-widest mb-3"
                style={{ color: "#5b8dd9", letterSpacing: "0.12em" }}
              >
                Library
              </p>
              <h1
                className="font-serif mb-3"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "#1a1a1a",
                  lineHeight: 1.15,
                }}
              >
                Your quizzes
              </h1>
              <p className="text-lg max-w-2xl" style={{ color: "#555555" }}>
                Review every multiple-choice quiz generated from your study files. Open a card to see questions,
                answers, and explanations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="h-11 px-6 rounded-full text-white font-medium text-sm shrink-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center gap-2"
              style={{ background: "#3a3a3a", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
            >
              <Layers className="w-4 h-4" />
              Go to subjects
            </button>
          </div>
        </header>

        {isError && (
          <div
            className="rounded-2xl p-6 text-center mb-8"
            style={{ background: "#fff5f5", border: "1px solid #fecaca", color: "#991b1b" }}
          >
            Could not load quizzes. Check that you are logged in and the API is running.
          </div>
        )}

        {items.length === 0 ? (
          <div
            className="text-center py-20 md:py-28 rounded-3xl"
            style={{ background: "#ffffff", border: "1px solid #e8e8e6", boxShadow: "0 8px 40px rgba(0,0,0,0.04)" }}
          >
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: "linear-gradient(145deg, #eef4fc, #f7f7f5)" }}
            >
              <HelpCircle className="w-10 h-10" style={{ color: "#5b8dd9" }} />
            </div>
            <h2 className="text-2xl font-serif mb-2" style={{ color: "#1a1a1a" }}>
              No quizzes yet
            </h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: "#555555" }}>
              Pick a subject, choose a file, and use <strong>Quiz</strong> on the card to generate practice questions.
            </p>
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="h-12 px-8 rounded-full text-white font-medium inline-flex items-center gap-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "#3a3a3a" }}
            >
              Open dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {items.map((row) => (
              <article
                key={row.id}
                className="group rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e8e8e6",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: row.subject?.color ? `${row.subject.color}22` : "#f0f0ed" }}
                  >
                    <HelpCircle className="w-5 h-5" style={{ color: row.subject?.color || "#3a3a3a" }} />
                  </div>
                  <span
                    className="text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: "#f0f4fa", color: "#3a3a3a" }}
                  >
                    {row.difficulty}
                  </span>
                </div>

                <h3 className="font-semibold text-lg mb-1" style={{ color: "#1a1a1a" }}>
                  {row.subject?.name ?? "Quiz"}
                </h3>
                {row.material && (
                  <p className="text-sm flex items-center gap-2 mb-4" style={{ color: "#666" }}>
                    <FileText className="w-4 h-4 shrink-0 opacity-70" />
                    <span className="truncate">{row.material.file_name}</span>
                  </p>
                )}

                <p className="text-sm mb-6" style={{ color: "#555" }}>
                  <span className="font-semibold" style={{ color: "#1a1a1a" }}>
                    {row.question_count}
                  </span>{" "}
                  questions
                  {row.created_at && (
                    <span className="text-neutral-500">
                      {" "}
                      ·{" "}
                      {new Date(row.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openQuiz(row)}
                    className="h-10 px-5 rounded-full text-sm font-medium text-white transition-all duration-200 group-hover:shadow-md"
                    style={{ background: "#3a3a3a" }}
                  >
                    Open quiz
                  </button>
                  {row.subject && (
                    <button
                      type="button"
                      onClick={() => navigate(`/subject/${row.subject!.id}`)}
                      className="h-10 px-5 rounded-full text-sm font-medium transition-all duration-200"
                      style={{
                        background: "#ffffff",
                        border: "1px solid #ddd",
                        color: "#1a1a1a",
                      }}
                    >
                      Subject
                      <ArrowRight className="inline w-3.5 h-3.5 ml-1 -mt-0.5" />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AiResultModal state={modal} onClose={() => setModal(null)} />
    </div>
  );
}
