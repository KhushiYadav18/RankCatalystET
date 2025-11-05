"use client";

interface AttentionIndicatorProps {
  attentionRatio: number;
}

export default function AttentionIndicator({ attentionRatio }: AttentionIndicatorProps) {
  const getColor = () => {
    if (attentionRatio >= 0.6) return "bg-green-500";
    if (attentionRatio >= 0.4) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-600">Attention:</div>
      <div className="relative w-4 h-4">
        <div
          className={`w-4 h-4 rounded-full ${getColor()} transition-colors`}
          style={{
            opacity: Math.max(0.3, attentionRatio),
          }}
        />
      </div>
      <span className="text-sm text-gray-600">
        {Math.round(attentionRatio * 100)}%
      </span>
    </div>
  );
}

