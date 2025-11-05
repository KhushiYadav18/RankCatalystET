"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import QuestionCard from "@/components/quiz/QuestionCard";
import Timer from "@/components/quiz/Timer";
import AttentionIndicator from "@/components/quiz/AttentionIndicator";
import CalibrationOverlay from "@/components/quiz/CalibrationOverlay";
import WebGazerVideoStyler from "@/components/quiz/WebGazerVideoStyler";
import { apiClient } from "@/lib/apiClient";
import { webgazerClient } from "@/lib/attention/webgazerClient";
import { computeAttentionMetrics } from "@/lib/attention/attentionUtils";
import type { Question, AttentionMetrics } from "@/lib/types";
import { config } from "@/config";

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const chapterSlug = params.chapter as string;

  const [calibrating, setCalibrating] = useState(true);
  const [calibrationQuality, setCalibrationQuality] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [optionChanges, setOptionChanges] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [maxQuestions, setMaxQuestions] = useState(15);
  const [attentionRatio, setAttentionRatio] = useState(0.5); // Start at 50% until we have data
  const [userDetected, setUserDetected] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  const questionAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    // Wait a bit for WebGazer script to load
    const timer = setTimeout(() => {
      initializeQuiz();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [chapterSlug, router]);

  // Continuous attention updates - ensure this runs throughout the quiz
  useEffect(() => {
    if (!startTime || !question) {
      console.log('Attention update skipped:', { startTime: !!startTime, question: !!question });
      return;
    }

    console.log('Starting attention updates for question', questionIndex);

    // Update attention every 200ms
    const interval = setInterval(() => {
      updateAttentionMetrics();
    }, 200);

    // Also update immediately
    setTimeout(() => {
      updateAttentionMetrics();
    }, 100);

    return () => {
      console.log('Stopping attention updates for question', questionIndex);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, question, questionIndex]); // Re-run when question changes

  const initializeQuiz = async () => {
    try {
      // Initialize WebGazer (will request camera permission)
      await webgazerClient.init();
      
      // Show calibration overlay
      // Calibration will call handleCalibrationComplete when done
    } catch (error) {
      console.error("Failed to initialize WebGazer:", error);
      // Continue without WebGazer - use fallback
      handleCalibrationComplete(0.5);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      webgazerClient.destroy();
    };
  }, []);

  const handleCalibrationComplete = async (quality: number) => {
    setCalibrationQuality(quality);
    setCalibrating(false);

    try {
      // Get device info
      const deviceInfo = `${navigator.userAgent}, ${window.screen.width}x${window.screen.height}`;

      // Start session
      const response = await apiClient.startSession(
        chapterSlug,
        config.defaultMaxQuestions,
        true,
        quality,
        deviceInfo
      );

      setSessionId(response.quiz_session_id);
      setQuestion(response.question);
      setQuestionIndex(response.current_question_index);
      setMaxQuestions(response.max_questions);
      setStartTime(new Date());

      // Start tracking
      webgazerClient.startTracking();
      
      // Initial attention update
      setTimeout(() => {
        updateAttentionMetrics();
      }, 500);
    } catch (error: any) {
      console.error("Failed to start session:", error);
      alert("Failed to start quiz. Please try again.");
      router.push("/dashboard");
    }
  };

  const updateAttentionMetrics = () => {
    if (!questionAreaRef.current || !startTime) {
      // Log why we're skipping
      if (!questionAreaRef.current) {
        console.warn('updateAttentionMetrics: questionAreaRef not ready');
      }
      if (!startTime) {
        console.warn('updateAttentionMetrics: startTime not set');
      }
      return;
    }

    const questionBox = questionAreaRef.current.getBoundingClientRect();
    const allSamples = webgazerClient.getGazeSamples();
    
    // Use only recent samples (last 50) for more responsive calculation
    const recentSamples = allSamples.slice(-50);
    
    // Check if user is detected (getting valid samples)
    const validSamples = recentSamples.filter(s => s.x !== null && s.y !== null);
    const userPresent = validSamples.length > 3 || recentSamples.length > 10; // More lenient threshold
    
    setUserDetected(userPresent);
    
    // Alert if user not detected
    if (!userPresent && !alertShown && allSamples.length > 30) {
      setAlertShown(true);
      alert("⚠️ Please position yourself in front of the camera. Attention tracking will be affected.");
      setTimeout(() => setAlertShown(false), 5000);
    }
    
    // Always calculate metrics even with few samples - this ensures attention updates
    if (recentSamples.length === 0) {
      // No samples yet - keep previous value or set to 0
      if (allSamples.length === 0) {
        setAttentionRatio(0);
      }
      // Log for debugging
      console.log('No recent samples for attention calculation', {
        allSamples: allSamples.length,
        questionIndex,
        isTracking: (webgazerClient as any).isTracking
      });
      return;
    }
    
    // Update samples with onTask status
    webgazerClient.updateSampleOnTask(questionBox);
    
    const metrics = computeAttentionMetrics(questionBox, recentSamples);
    
    // Calculate attention with penalty if user not detected
    let calculatedRatio = metrics.attention_ratio;
    
    // Debug logging (only when significant changes) - use ref to avoid dependency
    const currentRatio = attentionRatio;
    if (Math.abs(calculatedRatio - currentRatio) > 0.1 || recentSamples.length < 10) {
      console.log('Attention update:', {
        ratio: calculatedRatio.toFixed(2),
        previousRatio: currentRatio.toFixed(2),
        samples: metrics.num_gaze_samples,
        allSamples: allSamples.length,
        onTask: metrics.num_on_task_samples,
        offTask: metrics.num_off_task_samples,
        offScreen: metrics.off_screen_ratio,
        userPresent,
        questionIndex
      });
    }
    
    if (!userPresent && validSamples.length < 3) {
      // Penalize attention if user not detected
      calculatedRatio *= 0.3; // Reduce to 30% of actual value
    }
    
    // Check for confusion/attention drop patterns
    // If many samples are off-task or off-screen, decrease attention
    const offScreenRatio = metrics.off_screen_ratio || 0;
    if (offScreenRatio > 0.5) {
      // User looking away frequently - decrease attention
      calculatedRatio *= 0.5;
    }
    
    // Always update immediately with calculated ratio
    if (metrics.num_gaze_samples > 0) {
      setAttentionRatio(Math.max(0, Math.min(1, calculatedRatio)));
    } else {
      // If we have samples but no valid ones, set based on user presence
      setAttentionRatio(userPresent ? 0.2 : 0);
    }
  };

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null && selectedOption !== index) {
      setOptionChanges(optionChanges + 1);
    }
    setSelectedOption(index);
  };

  const handleSubmit = async () => {
    if (selectedOption === null || !sessionId || !question || !startTime) return;

    setSubmitting(true);
    webgazerClient.stopTracking();

    try {
      const submittedAt = new Date();
      const responseTimeMs = submittedAt.getTime() - startTime.getTime();

      // Compute final attention metrics
      const questionBox = questionAreaRef.current?.getBoundingClientRect() || null;
      const samples = webgazerClient.getGazeSamples();
      webgazerClient.updateSampleOnTask(questionBox);
      
      // Ensure we always have valid metrics
      const baseMetrics = computeAttentionMetrics(questionBox, samples);
      
      // Use actual metrics - don't default to 50% if we have samples
      const attentionMetrics: AttentionMetrics = {
        attention_ratio: baseMetrics.num_gaze_samples > 0 
          ? baseMetrics.attention_ratio 
          : 0.5, // Only default to 50% if truly no samples
        off_screen_ratio: baseMetrics.off_screen_ratio || 0,
        off_screen_duration_ms: baseMetrics.off_screen_duration_ms || 0,
        num_gaze_samples: baseMetrics.num_gaze_samples || 0,
        num_on_task_samples: baseMetrics.num_on_task_samples || 0,
        num_off_task_samples: baseMetrics.num_off_task_samples || 0,
        option_changes: optionChanges,
        raw_attention_trace: baseMetrics.raw_attention_trace || [],
      };

      // Submit answer
      const response = await apiClient.submitAnswer(
        sessionId,
        question.id,
        questionIndex,
        startTime,
        submittedAt,
        responseTimeMs,
        selectedOption,
        false,
        attentionMetrics
      );

      // Check response structure - handle both success and completion
      if (response && typeof response === 'object') {
        if (response.has_more === true && response.question) {
          // Next question
          setQuestion(response.question);
          setQuestionIndex(response.next_question_index || questionIndex + 1);
          setSelectedOption(null);
          setOptionChanges(0);
          setStartTime(new Date());
          // Clear samples and reset attention - will update from new samples
          setAttentionRatio(0);
          webgazerClient.clearSamples();
          
          // Ensure tracking is active for next question
          webgazerClient.stopTracking();
          
          console.log('Moving to next question, restarting tracking...', {
            nextQuestionIndex: response.next_question_index || questionIndex + 1
          });
          
          // Restart tracking immediately
          setTimeout(() => {
            webgazerClient.startTracking();
            console.log('Tracking restarted for question', response.next_question_index || questionIndex + 1);
            
            // Update attention multiple times to ensure it starts calculating
            setTimeout(() => {
              updateAttentionMetrics();
            }, 200);
            
            setTimeout(() => {
              updateAttentionMetrics();
            }, 500);
            
            setTimeout(() => {
              updateAttentionMetrics();
            }, 1000);
          }, 100);
        } else {
          // Quiz complete (has_more === false or no question)
          router.push(`/quiz/${chapterSlug}/result/${sessionId}`);
        }
      } else {
        // If response is not an object, check if quiz should continue
        // This handles edge cases
        console.warn("Unexpected response format:", response);
        // Still proceed to results page
        router.push(`/quiz/${chapterSlug}/result/${sessionId}`);
      }
    } catch (error: any) {
      console.error("Failed to submit answer:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      // Show more specific error message
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          error.message || 
                          "Failed to submit answer. Please try again.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (calibrating) {
    return <CalibrationOverlay onComplete={handleCalibrationComplete} />;
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WebGazerVideoStyler />
      
      {/* User detection alert */}
      {!userDetected && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="text-sm font-semibold">
            Camera not detecting you. Please position yourself in front of the screen.
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <Timer startTime={startTime || new Date()} />
        <AttentionIndicator attentionRatio={attentionRatio} />
      </div>

      <div ref={questionAreaRef}>
        <QuestionCard
          question={question}
          selectedOption={selectedOption}
          onSelectOption={handleSelectOption}
          questionIndex={questionIndex}
          totalQuestions={maxQuestions}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null || submitting}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}

