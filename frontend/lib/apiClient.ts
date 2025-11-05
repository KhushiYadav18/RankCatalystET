/**
 * API Client for RankCatalyst
 * Handles all API calls with JWT token management
 */
import axios, { AxiosInstance } from 'axios';
import { config } from '@/config';
import type {
  Chapter,
  QuizSessionStartResponse,
  QuizAnswerResponse,
  QuizSummaryResponse,
  LoginResponse,
  User,
  AttentionMetrics,
} from './types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          const refresh = localStorage.getItem('refresh');
          if (refresh) {
            try {
              const response = await axios.post(
                `${config.apiBaseUrl}/auth/token/refresh/`,
                { refresh }
              );
              localStorage.setItem('access', response.data.access);
              // Retry original request
              error.config.headers.Authorization = `Bearer ${response.data.access}`;
              return this.client.request(error.config);
            } catch (refreshError) {
              // Refresh failed, clear tokens and redirect to login
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              window.location.href = '/auth/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, passwordConfirm: string, firstName?: string, lastName?: string): Promise<LoginResponse> {
    const response = await this.client.post('/auth/register/', {
      email,
      password,
      password_confirm: passwordConfirm,
      first_name: firstName || '',
      last_name: lastName || '',
    });
    return response.data;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post('/auth/login/', {
      email,
      password,
    });
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/auth/me/');
    return response.data;
  }

  // Quiz endpoints
  async getChapters(): Promise<Chapter[]> {
    const response = await this.client.get('/quizzes/chapters/');
    // Handle paginated response or direct array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // If paginated, return results array
    return response.data.results || [];
  }

  async startSession(
    chapterSlug: string,
    maxQuestions: number,
    webgazerEnabled: boolean,
    calibrationQuality: number | null,
    deviceInfo: string
  ): Promise<QuizSessionStartResponse> {
    const response = await this.client.post('/quizzes/sessions/start/', {
      chapter_slug: chapterSlug,
      max_questions: maxQuestions,
      webgazer_enabled: webgazerEnabled,
      calibration_quality: calibrationQuality,
      device_info: deviceInfo,
    });
    return response.data;
  }

  async submitAnswer(
    sessionId: string,
    questionId: string,
    questionIndex: number,
    startedAt: Date,
    submittedAt: Date,
    responseTimeMs: number,
    selectedOptionIndex: number | null,
    wasSkipped: boolean,
    attentionMetrics: AttentionMetrics
  ): Promise<QuizAnswerResponse> {
    try {
      const response = await this.client.post(`/quizzes/sessions/${sessionId}/answer/`, {
        question_id: questionId,
        question_index: questionIndex,
        started_at: startedAt.toISOString(),
        submitted_at: submittedAt.toISOString(),
        response_time_ms: responseTimeMs,
        selected_option_index: selectedOptionIndex,
        was_skipped: wasSkipped,
        attention_metrics: attentionMetrics,
      });
      
      // Ensure response has the expected structure
      if (response.data && typeof response.data === 'object') {
        return response.data;
      }
      
      // If response is not in expected format, log and return default
      console.warn('Unexpected response format:', response.data);
      return {
        has_more: false,
        is_correct: false,
      };
    } catch (error: any) {
      // Log detailed error for debugging
      console.error('Submit answer error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  }

  async getSummary(sessionId: string): Promise<QuizSummaryResponse> {
    const response = await this.client.get(`/quizzes/sessions/${sessionId}/summary/`);
    return response.data;
  }
}

export const apiClient = new ApiClient();

