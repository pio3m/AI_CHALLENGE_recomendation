import React, { useState, useEffect } from "react";

const question = "Hey, let's get to know each other! What's your name?";

export default function Step1Name({ form, updateForm, next }) {
  const [typed, setTyped] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx < question.length) {
      const timeout = setTimeout(() => {
        setTyped((t) => t + question[idx]);
        setIdx(idx + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [idx]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6935F9] to-[#6139F1] mb-3">
          <span className="text-3xl text-white">🎭</span>
        </div>
        <div className="text-lg md:text-xl font-bold text-center mb-3 min-h-[36px]">
          {typed}
          <span className="animate-pulse">|</span>
        </div>
      </div>
      <input
        className="border-none rounded-xl px-4 py-2 w-full max-w-2xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#6935F9] text-base transition shadow-sm bg-gray-50"
        placeholder="Enter your name..."
        value={form.name}
        onChange={(e) => updateForm({ name: e.target.value })}
        required
      />
      <button
        className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition font-bold text-base disabled:opacity-50"
        onClick={next}
        disabled={!form.name.trim()}
      >
        Next step
      </button>
    </div>
  );
} 