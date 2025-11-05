"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AccuracyByDifficultyProps {
  data: Record<
    "easy" | "medium" | "hard",
    {
      questions: number;
      correct: number;
      accuracy: number;
    }
  >;
}

export default function AccuracyByDifficulty({ data }: AccuracyByDifficultyProps) {
  const chartData = [
    {
      difficulty: "Easy",
      accuracy: Math.round(data.easy.accuracy * 100),
      questions: data.easy.questions,
    },
    {
      difficulty: "Medium",
      accuracy: Math.round(data.medium.accuracy * 100),
      questions: data.medium.questions,
    },
    {
      difficulty: "Hard",
      accuracy: Math.round(data.hard.accuracy * 100),
      questions: data.hard.questions,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Accuracy by Difficulty
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="difficulty" />
          <YAxis domain={[0, 100]} label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="accuracy" fill="#0ea5e9" name="Accuracy (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

