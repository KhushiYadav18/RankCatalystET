"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import PerformanceChart from "@/components/charts/PerformanceChart";
import AttentionChart from "@/components/charts/AttentionChart";
import AccuracyByDifficulty from "@/components/charts/AccuracyByDifficulty";
import type { QuizSummaryResponse } from "@/lib/types";

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const chapterSlug = params.chapter as string;

  const [summary, setSummary] = useState<QuizSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    loadSummary();
  }, [sessionId, router]);

  const loadSummary = async () => {
    try {
      const data = await apiClient.getSummary(sessionId);
      setSummary(data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push("/auth/login");
      } else {
        setError("Failed to load summary. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading results...</div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error || "Failed to load results"}</div>
      </div>
    );
  }

  const { session, per_question_stats, difficulty_breakdown, llm_summary } = summary;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Session Summary - {session.chapter.name}
      </h1>
      <p className="text-gray-600 mb-8">
        Completed on {new Date(session.ended_at || session.started_at).toLocaleDateString()}
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Accuracy</div>
          <div className="text-3xl font-bold text-primary-600">
            {Math.round(session.overall_accuracy * 100)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {session.num_correct} / {session.total_questions} correct
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Average Attention</div>
          <div className="text-3xl font-bold text-green-600">
            {Math.round(session.overall_attention_ratio * 100)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Focus maintained
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="text-sm text-gray-600 mb-1">Avg Response Time</div>
          <div className="text-3xl font-bold text-yellow-600">
            {Math.round(session.overall_avg_response_time_ms / 1000)}s
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Per question
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PerformanceChart data={per_question_stats} />
        <AttentionChart data={per_question_stats} />
      </div>

      <div className="mb-8">
        <AccuracyByDifficulty data={difficulty_breakdown} />
      </div>

      {/* LLM Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Feedback</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{llm_summary}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Link
          href={`/quiz/${chapterSlug}`}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Retake Quiz
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

