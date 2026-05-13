/** Shapes returned by Laravel AiContentController (JSON, snake_case). */

export interface AiSummaryBlock {
  id?: number;
  job_id?: number;
  summary_text: string;
}

export interface AiKeyPoint {
  id?: number;
  summary_id?: number;
  concept: string;
  concept_type?: string;
}

export interface SummaryApiResponse {
  job?: Record<string, unknown>;
  summary: AiSummaryBlock;
  key_points: AiKeyPoint[];
}

export interface QuestionOptionRow {
  id?: number;
  question_id?: number;
  option_label?: string | null;
  option_text: string;
  is_correct?: boolean;
}

export interface AiQuestionRow {
  id?: number;
  quiz_id?: number;
  question_text: string;
  explanation?: string | null;
  options?: QuestionOptionRow[];
}

export interface AiQuizBlock {
  id?: number;
  job_id?: number;
  subject_id?: number;
  difficulty?: string;
  questions?: AiQuestionRow[];
}

export interface QuizApiResponse {
  job?: Record<string, unknown>;
  quiz: AiQuizBlock;
}

export type AiResultModalState =
  | { kind: "summary"; data: SummaryApiResponse }
  | { kind: "quiz"; data: QuizApiResponse };
