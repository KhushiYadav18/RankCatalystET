"use client";

import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  questionIndex: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  questionIndex,
  totalQuestions,
}: QuestionCardProps) {
  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6" id="question-area">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">
          Question {questionIndex} of {totalQuestions}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[question.difficulty]}`}
        >
          {question.difficulty.toUpperCase()}
        </span>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedOption === index
                ? "border-primary-600 bg-primary-50"
                : "border-gray-200 hover:border-primary-300"
            }`}
          >
            <span className="font-medium text-gray-700">
              {String.fromCharCode(65 + index)}. {option}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

