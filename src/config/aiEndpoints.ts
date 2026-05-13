/** Laravel: POST api/ai/summaries */
export const AI_SUMMARIES_ENDPOINT = "/ai/summaries";

/** Laravel: POST api/ai/quizzes */
export const AI_QUIZZES_ENDPOINT = "/ai/quizzes";

/** AI calls Anthropic in-process; default axios 10s is too short. */
export const AI_REQUEST_TIMEOUT_MS = 180_000;

export const aiRequestConfig = { timeout: AI_REQUEST_TIMEOUT_MS };

export type GenerateSummaryBody = {
  subject_id: number;
  material_id: number;
  key_points?: number;
  model?: string;
};

export type QuizDifficulty = "easy" | "medium" | "hard";

export type GenerateQuizBody = {
  subject_id: number;
  material_id: number;
  difficulty?: QuizDifficulty;
  question_count?: number;
  model?: string;
};
