import type { QuizApiResponse, SummaryApiResponse } from "../interfaces/aiContent";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Accept Laravel JSON even if nesting differs slightly. */
export function coerceSummaryResponse(raw: unknown): SummaryApiResponse | null {
  if (!isRecord(raw)) return null;
  const summaryRaw = raw.summary;
  if (!isRecord(summaryRaw)) return null;
  const text =
    typeof summaryRaw.summary_text === "string"
      ? summaryRaw.summary_text
      : typeof summaryRaw.text === "string"
        ? summaryRaw.text
        : "";
  const summary: SummaryApiResponse["summary"] = {
    id: typeof summaryRaw.id === "number" ? summaryRaw.id : undefined,
    job_id: typeof summaryRaw.job_id === "number" ? summaryRaw.job_id : undefined,
    summary_text: text,
  };
  let key_points: SummaryApiResponse["key_points"] = [];
  const kp = raw.key_points;
  if (Array.isArray(kp)) {
    key_points = kp.filter(isRecord).map((row) => ({
      id: typeof row.id === "number" ? row.id : undefined,
      summary_id: typeof row.summary_id === "number" ? row.summary_id : undefined,
      concept: typeof row.concept === "string" ? row.concept : "",
      concept_type: typeof row.concept_type === "string" ? row.concept_type : undefined,
    }));
  }
  return {
    job: isRecord(raw.job) ? (raw.job as Record<string, unknown>) : undefined,
    summary,
    key_points,
  };
}

export function coerceQuizResponse(raw: unknown): QuizApiResponse | null {
  if (!isRecord(raw)) return null;
  const quizRaw = raw.quiz;
  if (!isRecord(quizRaw)) return null;
  const questionsIn = quizRaw.questions;
  const questions: NonNullable<QuizApiResponse["quiz"]["questions"]> = [];
  if (Array.isArray(questionsIn)) {
    for (const q of questionsIn) {
      if (!isRecord(q)) continue;
      const optsIn = q.options;
      const options: NonNullable<(typeof questions)[0]["options"]> = [];
      if (Array.isArray(optsIn)) {
        for (const opt of optsIn) {
          if (!isRecord(opt)) continue;
          options.push({
            id: typeof opt.id === "number" ? opt.id : undefined,
            question_id: typeof opt.question_id === "number" ? opt.question_id : undefined,
            option_label: typeof opt.option_label === "string" ? opt.option_label : null,
            option_text: typeof opt.option_text === "string" ? opt.option_text : "",
            is_correct: Boolean(opt.is_correct),
          });
        }
      }
      questions.push({
        id: typeof q.id === "number" ? q.id : undefined,
        quiz_id: typeof q.quiz_id === "number" ? q.quiz_id : undefined,
        question_text: typeof q.question_text === "string" ? q.question_text : "",
        explanation:
          typeof q.explanation === "string" ? q.explanation : q.explanation === null ? null : undefined,
        options,
      });
    }
  }
  const quiz: QuizApiResponse["quiz"] = {
    id: typeof quizRaw.id === "number" ? quizRaw.id : undefined,
    job_id: typeof quizRaw.job_id === "number" ? quizRaw.job_id : undefined,
    subject_id: typeof quizRaw.subject_id === "number" ? quizRaw.subject_id : undefined,
    difficulty: typeof quizRaw.difficulty === "string" ? quizRaw.difficulty : undefined,
    questions,
  };
  return {
    job: isRecord(raw.job) ? (raw.job as Record<string, unknown>) : undefined,
    quiz,
  };
}
