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

interface AttentionChartProps {
  data: {
    question_index: number;
    attention_ratio: number;
  }[];
}

export default function AttentionChart({ data }: AttentionChartProps) {
  const chartData = data.map((item) => ({
    question: item.question_index,
    attention: Math.round(item.attention_ratio * 100),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Attention Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" label={{ value: "Question", position: "insideBottom", offset: -5 }} />
          <YAxis domain={[0, 100]} label={{ value: "Attention (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="attention"
            stroke="#10b981"
            name="Attention (%)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

