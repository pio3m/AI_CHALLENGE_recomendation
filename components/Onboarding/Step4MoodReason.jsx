import React, { useState, useEffect } from "react";

const subtitle = "Just share a short reason or skip";

export default function Step4MoodReason({ form, updateForm, next, prev }) {
  const [typed, setTyped] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx < subtitle.length) {
      const timeout = setTimeout(() => {
        setTyped((t) => t + subtitle[idx]);
        setIdx(idx + 1);
      }, 25);
      return () => clearTimeout(timeout);
    }
  }, [idx]);

  const wordCount = form.moodReason.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6935F9] to-[#6139F1] mb-3">
          <span className="text-3xl text-white">🧩</span>
        </div>
        <div className="text-lg md:text-xl font-bold text-center mb-1">What influenced your mood?</div>
        <div className="text-gray-500 mb-1 min-h-[20px] text-base">{typed}<span className="animate-pulse">|</span></div>
      </div>
      <textarea
        className="border border-gray-200 rounded-xl px-3 py-2 w-full max-w-2xl mb-2 focus:outline-none focus:ring-2 focus:ring-[#6935F9] text-base transition shadow-sm resize-none"
        placeholder="Example: After a rough day, I need something light and uplifting..."
        value={form.moodReason}
        onChange={(e) =>
          updateForm({
            moodReason: e.target.value.slice(0, 255),
          })
        }
        rows={3}
        maxLength={255}
      />
      <div className="w-full max-w-2xl flex justify-between text-xs text-gray-400 mb-4">
        <span>Your input is private and only used to fine-tune your movie recommendations.</span>
        <span>{wordCount}/255</span>
      </div>
      <div className="w-full max-w-2xl bg-blue-50 border border-blue-100 rounded-xl px-2 py-2 mb-4 flex items-start gap-2">
        <span className="text-lg mt-1">💡</span>
        <div>
          <div className="font-semibold text-blue-900 mb-1 text-sm">Not sure what to write?</div>
          <div className="text-gray-600 text-xs">
            Think of anything that shaped your mood: a stressful meeting, exciting news, a breakup, a boring day... Would you prefer a movie that reflects how you feel, or one that helps you feel different?
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-2xl justify-between mt-4">
        <button
          className="px-4 py-2 rounded-xl border text-gray-600 bg-white hover:bg-gray-100 transition text-base font-semibold shadow-sm"
          onClick={prev}
        >
          Previous
        </button>
        <button
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition font-bold text-base disabled:opacity-50"
          onClick={next}
          disabled={form.moodReason.length === 0}
        >
          Next step
        </button>
      </div>
    </div>
  );
} 