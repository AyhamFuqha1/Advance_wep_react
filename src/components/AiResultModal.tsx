import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, BookOpen, ListChecks, Sparkles } from "lucide-react";
import type { AiResultModalState, QuizApiResponse, SummaryApiResponse } from "../interfaces/aiContent";

interface Props {
  state: AiResultModalState | null;
  onClose: () => void;
}

export default function AiResultModal({ state, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!state) return;
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [state, onKeyDown]);

  if (!mounted || !state) return null;

  const isSummary = state.kind === "summary";

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-5"
      style={{
        zIndex: 10000,
        background: "rgba(26, 26, 26, 0.45)",
        backdropFilter: "blur(6px)",
      }}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-result-title"
        className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl flex flex-col shadow-2xl"
        style={{
          background: "#fafaf8",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header
          className="shrink-0 flex items-center justify-between gap-4 px-5 sm:px-8 py-5 sm:py-6"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f4f4f1 100%)",
            borderBottom: "1px solid #e5e5e2",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: isSummary ? "linear-gradient(145deg, #e8eef8, #dce6f7)" : "linear-gradient(145deg, #eef6ff, #e0ecfc)",
              }}
            >
              {isSummary ? (
                <BookOpen className="w-5 h-5" style={{ color: "#3a3a3a" }} />
              ) : (
                <ListChecks className="w-5 h-5" style={{ color: "#3a3a3a" }} />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#5b8dd9" }}>
                {isSummary ? "AI summary" : "AI quiz"}
              </p>
              <h2 id="ai-result-title" className="text-xl sm:text-2xl font-serif truncate" style={{ color: "#1a1a1a" }}>
                {isSummary ? "Summary" : "Quiz"}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
            style={{ border: "1px solid #e0e0dd" }}
            aria-label="Close"
          >
            <X className="w-5 h-5" style={{ color: "#444" }} />
          </button>
        </header>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-8 py-6 sm:py-8" style={{ color: "#1a1a1a" }}>
          {state.kind === "summary" && <SummaryBody data={state.data} />}
          {state.kind === "quiz" && (
            <QuizBody key={state.data.quiz?.id ?? "quiz"} data={state.data} />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function SummaryBody({ data }: { data: SummaryApiResponse }) {
  const { summary, key_points } = data;
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4" style={{ color: "#5b8dd9" }} />
          <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#666" }}>
            Overview
          </h4>
        </div>
        <div
          className="rounded-2xl px-5 py-5 sm:px-6 sm:py-6 text-[15px] sm:text-base leading-relaxed whitespace-pre-wrap"
          style={{
            background: "#ffffff",
            border: "1px solid #ebeae6",
            color: "#2d2d2d",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {summary.summary_text ?? ""}
        </div>
      </section>
      {key_points && key_points.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ListChecks className="w-4 h-4" style={{ color: "#5b8dd9" }} />
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "#666" }}>
              Key points
            </h4>
          </div>
          <ul className="grid gap-3 sm:grid-cols-1">
            {key_points.map((kp) => (
              <li
                key={kp.id ?? `${kp.concept}-${kp.concept_type}`}
                className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-xl px-4 py-3.5"
                style={{
                  background: "#ffffff",
                  border: "1px solid #ebeae6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                }}
              >
                <span className="font-medium text-[15px]" style={{ color: "#1a1a1a" }}>
                  {kp.concept}
                </span>
                {kp.concept_type && (
                  <span
                    className="text-[10px] sm:text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                    style={{ background: "#e8eef8", color: "#4a5568" }}
                  >
                    {kp.concept_type}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function questionStableKey(q: { id?: number }, idx: number): string {
  return q.id != null ? `q-${q.id}` : `qi-${idx}`;
}

function optionLetter(
  opt: { option_label?: string | null },
  optionIndex: number,
): string {
  const trimmed = opt.option_label?.trim();
  if (trimmed) return trimmed.toUpperCase();
  return String.fromCharCode(65 + optionIndex);
}

function correctOptionLabel(q: {
  options?: { option_label?: string | null; is_correct?: boolean }[];
}): string {
  const opts = q.options ?? [];
  const idx = opts.findIndex((o) => o.is_correct);
  if (idx === -1) return "";
  return optionLetter(opts[idx], idx);
}

function QuizBody({ data }: { data: QuizApiResponse }) {
  const quiz = data.quiz;
  const questions = quiz.questions ?? [];
  const quizId = quiz.id ?? 0;

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setSelections({});
    setRevealed(false);
  }, [quizId, questions.length]);

  const pickOption = (qKey: string, label: string) => {
    if (revealed) return;
    const normalized = String(label).trim().toUpperCase();
    setSelections((prev) => ({ ...prev, [qKey]: normalized }));
  };

  const unansweredCount = questions.reduce((n, q, idx) => {
    const key = questionStableKey(q, idx);
    return selections[key] ? n : n + 1;
  }, 0);

  const score = revealed
    ? questions.reduce((acc, q, idx) => {
        const key = questionStableKey(q, idx);
        const sel = selections[key]?.toUpperCase() ?? "";
        const corr = correctOptionLabel(q);
        return sel && corr && sel === corr ? acc + 1 : acc;
      }, 0)
    : 0;

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {quiz.difficulty && (
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{ background: "#1a1a1a", color: "#fafaf8" }}
            >
              {String(quiz.difficulty)}
            </span>
          )}
          <span className="text-sm" style={{ color: "#666" }}>
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </span>
        </div>
        {revealed && (
          <span className="text-sm font-semibold" style={{ color: "#1a1a1a" }}>
            Score: {score} / {questions.length}
          </span>
        )}
      </div>

      {!revealed && (
        <p
          className="text-sm rounded-xl px-4 py-3"
          style={{ background: "#eef4fc", color: "#334155", border: "1px solid #dbeafe" }}
        >
          Choose one answer for each question, then tap <strong>Check answers</strong> to see how you did and read the
          explanations.
        </p>
      )}

      <ol className="space-y-10 list-none p-0 m-0">
        {questions.map((q, idx) => {
          const qKey = questionStableKey(q, idx);
          const selected = selections[qKey] ?? "";
          const correct = correctOptionLabel(q);

          return (
            <li key={qKey} className="relative">
              <div className="flex gap-4">
                <div
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: revealed
                      ? selected && selected === correct
                        ? "#15803d"
                        : "#3a3a3a"
                      : "#3a3a3a",
                    color: "#fff",
                    boxShadow: "0 4px 12px rgba(58,58,58,0.2)",
                  }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <p className="font-semibold text-base sm:text-lg leading-snug" style={{ color: "#1a1a1a" }}>
                    {q.question_text}
                  </p>
                  <ul className="space-y-2.5">
                    {(q.options ?? []).map((opt, oi) => {
                      const letter = optionLetter(opt, oi);
                      const isSelected = selected === letter;
                      const isCorrect = Boolean(opt.is_correct);

                      let boxBg = "#ffffff";
                      let boxBorder = "1px solid #ebeae6";
                      let badgeBg = "#f0f0ed";
                      let badgeColor = "#333";

                      if (!revealed) {
                        if (isSelected) {
                          boxBg = "#f0f4fc";
                          boxBorder = "2px solid #5b8dd9";
                          badgeBg = "#5b8dd9";
                          badgeColor = "#fff";
                        }
                      } else {
                        if (isCorrect) {
                          boxBg = "#f0fdf4";
                          boxBorder = "1px solid #86efac";
                          badgeBg = "#22c55e";
                          badgeColor = "#fff";
                        } else if (isSelected && !isCorrect) {
                          boxBg = "#fef2f2";
                          boxBorder = "1px solid #fca5a5";
                          badgeBg = "#ef4444";
                          badgeColor = "#fff";
                        }
                      }

                      return (
                        <li key={opt.id ?? oi}>
                          <button
                            type="button"
                            disabled={revealed}
                            onClick={() => pickOption(qKey, letter)}
                            className="w-full text-left rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 text-sm sm:text-[15px] transition-all duration-150 disabled:cursor-default"
                            style={{
                              background: boxBg,
                              border: boxBorder,
                              boxShadow: revealed ? undefined : "0 1px 4px rgba(0,0,0,0.04)",
                            }}
                          >
                            <span
                              className="font-bold w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs"
                              style={{ background: badgeBg, color: badgeColor }}
                            >
                              {opt.option_label?.trim() || letter}
                            </span>
                            <span className="flex-1 min-w-0" style={{ color: "#2d2d2d" }}>
                              {opt.option_text}
                            </span>
                            {revealed && isCorrect && (
                              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#15803d" }}>
                                Correct
                              </span>
                            )}
                            {revealed && isSelected && !isCorrect && (
                              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "#b91c1c" }}>
                                Your answer
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {revealed && q.explanation && (
                    <blockquote
                      className="text-sm leading-relaxed pl-4 py-3 rounded-r-xl border-l-[3px]"
                      style={{
                        borderColor: "#5b8dd9",
                        background: "rgba(91, 141, 217, 0.08)",
                        color: "#444",
                      }}
                    >
                      {q.explanation}
                    </blockquote>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {questions.length === 0 && (
        <p className="text-center text-sm py-8 rounded-xl" style={{ color: "#777", background: "#ffffff" }}>
          No questions were returned in this quiz payload.
        </p>
      )}

      {questions.length > 0 && (
        <div
          className="sticky bottom-0 -mx-5 sm:-mx-8 mt-8 px-5 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #fafaf8 18%)",
            borderTop: "1px solid #e5e5e2",
          }}
        >
          <p className="text-xs sm:text-sm" style={{ color: revealed ? "#555" : "#666" }}>
            {revealed
              ? "Want another pass? Try again resets your choices and hides the answers."
              : unansweredCount > 0
                ? `${unansweredCount} question${unansweredCount === 1 ? "" : "s"} still need an answer.`
                : "Ready when you are."}
          </p>
          <div className="flex flex-wrap gap-2 justify-end">
            {revealed && (
              <button
                type="button"
                onClick={() => {
                  setSelections({});
                  setRevealed(false);
                }}
                className="h-10 px-5 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                style={{ background: "#ffffff", border: "1px solid #ccc", color: "#1a1a1a" }}
              >
                Try again
              </button>
            )}
            {!revealed && (
              <button
                type="button"
                disabled={unansweredCount > 0}
                onClick={() => setRevealed(true)}
                className="h-10 px-6 rounded-full text-sm font-medium text-white transition-all duration-200 disabled:opacity-45 disabled:cursor-not-allowed hover:shadow-md"
                style={{ background: unansweredCount > 0 ? "#9ca3af" : "#3a3a3a" }}
              >
                Check answers
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
