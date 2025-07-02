import React from "react";

const moods = [
  { label: "Happy", emoji: "😊" },
  { label: "In love", emoji: "😍" },
  { label: "Angry", emoji: "😡" },
  { label: "Stressed", emoji: "😰" },
  { label: "Tired", emoji: "😴" },
  { label: "Nostalgic", emoji: "🥲" },
  { label: "Sad", emoji: "😢" },
];

export default function Step3Mood({ form, updateForm, next, prev }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6935F9] to-[#6139F1] mb-3">
          <span className="text-3xl text-white">🎭</span>
        </div>
        <div className="text-lg md:text-xl font-bold text-center mb-1">How are you feeling right now?</div>
        <div className="text-gray-500 mb-1 text-center text-base">
          Pick the emotion that best describes your current mood.
        </div>
        <div className="font-semibold text-gray-700 mb-4 text-center">
          This helps us recommend movies that truly resonate with how you feel.
        </div>
      </div>
      <div className="flex flex-wrap gap-6 justify-center mb-6 w-full max-w-2xl">
        {moods.map((m) => (
          <button
            key={m.label}
            className={`flex flex-col items-center px-4 py-3 rounded-2xl border-2 transition w-24 h-24 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-[#6935F9]
              ${form.mood === m.label
                ? "border-[#A259FF] bg-gradient-to-br from-purple-50 to-purple-100 shadow-purple-100"
                : "border-gray-200 bg-gradient-to-br from-gray-50 to-white hover:from-purple-50 hover:to-white hover:border-purple-200 hover:shadow-2xl"}
            `}
            onClick={() => updateForm({ mood: m.label })}
            type="button"
          >
            <span className="text-3xl mb-2">{m.emoji}</span>
            <span className="text-base font-medium text-gray-800">{m.label}</span>
          </button>
        ))}
      </div>
      <div className="flex w-full max-w-2xl justify-between mt-4">
        <button
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition text-base font-semibold shadow-sm"
          onClick={prev}
        >
          Previous
        </button>
        <button
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={next}
          disabled={!form.mood}
        >
          Next step
        </button>
      </div>
    </div>
  );
} 