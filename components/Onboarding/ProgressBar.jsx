import React from "react";

export default function ProgressBar({ step, total }) {
  const percent = Math.round((step / (total - 1)) * 100);
  return (
    <div className="mb-6 w-full">
      <div className="flex justify-between text-sm mb-1 px-0">
        <span className="text-gray-500 font-medium">Level of profile personalization</span>
        <span className="text-[#A259FF] font-bold">{percent}% Completed</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, minWidth: percent > 0 ? '1rem' : 0 }}
        />
      </div>
    </div>
  );
} 