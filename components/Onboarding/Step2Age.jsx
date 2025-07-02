import React from "react";

const ageGroups = [
  "Under 13",
  "13–17",
  "18–24",
  "25–34",
  "35–44",
  "45+",
];

export default function Step2Age({ form, updateForm, next, prev }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6935F9] to-[#6139F1] mb-3">
          <span className="text-3xl text-white">🎂</span>
        </div>
        <div className="text-lg md:text-xl font-bold text-center mb-1">How old are you?</div>
        <div className="text-gray-500 mb-1 text-center text-base">Choose your age group</div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6 w-full max-w-2xl">
        {ageGroups.map((age) => (
          <button
            key={age}
            className={`px-4 py-2 rounded-lg font-bold text-base shadow transition focus:outline-none focus:ring-2 focus:ring-[#6935F9] mx-1 my-1
              ${form.age === age
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white ring-2 ring-[#6935F9] scale-105"
                : "bg-white text-gray-700 border border-gray-300 hover:shadow-lg"}
            `}
            onClick={() => updateForm({ age })}
            type="button"
          >
            {age}
          </button>
        ))}
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
          disabled={!form.age}
        >
          Next step
        </button>
      </div>
    </div>
  );
} 