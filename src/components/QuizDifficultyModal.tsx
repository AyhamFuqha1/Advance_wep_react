import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, HelpCircle } from "lucide-react";
import type { QuizDifficulty } from "../config/aiEndpoints";

const LEVELS: { value: QuizDifficulty; title: string; hint: string }[] = [
  { value: "easy", title: "Easy", hint: "Straightforward recall" },
  { value: "medium", title: "Medium", hint: "Typical exam style" },
  { value: "hard", title: "Hard", hint: "Deeper reasoning" },
];

interface Props {
  isOpen: boolean;
  fileLabel?: string;
  onClose: () => void;
  onChoose: (difficulty: QuizDifficulty) => void;
}

export default function QuizDifficultyModal({ isOpen, fileLabel, onClose, onChoose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onKeyDown]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-5"
      style={{
        zIndex: 10001,
        background: "rgba(26, 26, 26, 0.45)",
        backdropFilter: "blur(6px)",
      }}
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-difficulty-title"
        className="w-full max-w-md rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: "#fafaf8",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 sm:py-5"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f4f4f1 100%)",
            borderBottom: "1px solid #e5e5e2",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(145deg, #eef6ff, #e0ecfc)" }}
            >
              <HelpCircle className="w-5 h-5" style={{ color: "#3a3a3a" }} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#5b8dd9" }}>
                New quiz
              </p>
              <h2 id="quiz-difficulty-title" className="text-lg sm:text-xl font-serif truncate" style={{ color: "#1a1a1a" }}>
                Choose difficulty
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

        <div className="px-5 sm:px-6 py-5 sm:py-6">
          {fileLabel && (
            <p className="text-sm mb-5 truncate rounded-lg px-3 py-2" style={{ background: "#ffffff", border: "1px solid #ebeae6", color: "#555" }}>
              <span className="font-medium" style={{ color: "#1a1a1a" }}>Material: </span>
              {fileLabel}
            </p>
          )}
          <p className="text-sm mb-4" style={{ color: "#666" }}>
            This controls how demanding the questions are. You can always generate another quiz later.
          </p>
          <div className="flex flex-col gap-3">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => onChoose(lvl.value)}
                className="w-full text-left rounded-xl px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e5e5e2",
                }}
              >
                <span className="font-semibold text-base block" style={{ color: "#1a1a1a" }}>
                  {lvl.title}
                </span>
                <span className="text-sm" style={{ color: "#777" }}>
                  {lvl.hint}
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full h-10 rounded-full text-sm font-medium"
            style={{ background: "#f0f0ed", color: "#333", border: "1px solid #ddd" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
