/**
 * Shared TypeScript interfaces for RankCatalyst
 */

export interface Chapter {
  id: number;
  slug: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface AttentionMetrics {
  attention_ratio: number;
  off_screen_ratio: number;
  off_screen_duration_ms: number;
  num_gaze_samples: number;
  num_on_task_samples: number;
  num_off_task_samples: number;
  option_changes: number;
  raw_attention_trace?: { t_ms: number; on_task: boolean }[];
}

export interface GazeSample {
  x: number | null;
  y: number | null;
  timestamp: number;
  onTask?: boolean;
}

export interface QuizSessionStartResponse {
  quiz_session_id: string;
  chapter: Chapter;
  max_questions: number;
  current_question_index: number;
  question: Question;
}

export interface QuizAnswerResponse {
  has_more: boolean;
  next_question_index?: number;
  question?: Question;
  is_correct?: boolean;
}

export interface QuizSummaryResponse {
  session: {
    id: string;
    chapter: Chapter;
    started_at: string;
    ended_at: string | null;
    total_questions: number;
    num_correct: number;
    overall_accuracy: number;
    overall_attention_ratio: number;
    overall_avg_response_time_ms: number;
    webgazer_enabled: boolean;
    calibration_quality: number | null;
  };
  per_question_stats: {
    question_index: number;
    question_id: string;
    difficulty: string;
    is_correct: boolean;
    response_time_ms: number;
    attention_ratio: number;
    off_screen_ratio?: number;
  }[];
  difficulty_breakdown: Record<
    'easy' | 'medium' | 'hard',
    {
      questions: number;
      correct: number;
      accuracy: number;
      avg_attention_ratio: number;
      avg_response_time_ms: number;
    }
  >;
  llm_summary: string;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export interface LoginResponse {
  user: User;
  access: string;
  refresh: string;
}

