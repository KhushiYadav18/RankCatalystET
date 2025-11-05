"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartProps {
  data: {
    question_index: number;
    is_correct: boolean;
    response_time_ms: number;
  }[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map((item) => ({
    question: item.question_index,
    accuracy: item.is_correct ? 100 : 0,
    responseTime: item.response_time_ms / 1000, // Convert to seconds
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" label={{ value: "Question", position: "insideBottom", offset: -5 }} />
          <YAxis yAxisId="left" label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft" }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: "Time (s)", angle: 90, position: "insideRight" }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="accuracy"
            stroke="#0ea5e9"
            name="Accuracy (%)"
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="responseTime"
            stroke="#f59e0b"
            name="Response Time (s)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

