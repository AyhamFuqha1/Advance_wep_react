/** GET /ai/summaries — Laravel returns { data: [...] } */
export interface SummaryListItem {
  id: number;
  summary_text: string;
  key_points: { id: number; concept: string; concept_type?: string }[];
  subject: { id: number; name: string; color?: string } | null;
  material: { id: number; file_name: string } | null;
  created_at: string | null;
}

/** GET /ai/quizzes */
export interface QuizListItem {
  id: number;
  difficulty: string;
  subject: { id: number; name: string; color?: string } | null;
  material: { id: number; file_name: string } | null;
  question_count: number;
  questions: {
    id: number;
    quiz_id: number;
    question_text: string;
    explanation: string | null;
    options: {
      id: number;
      question_id: number;
      option_label: string | null;
      option_text: string;
      is_correct: boolean;
    }[];
  }[];
  created_at: string | null;
}
