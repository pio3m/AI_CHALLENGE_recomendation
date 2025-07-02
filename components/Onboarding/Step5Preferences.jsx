import React, { useState } from "react";

const buttonStyles = [
  "bg-gradient-to-r from-red-500 to-pink-500",      // Action
  "bg-gradient-to-r from-blue-500 to-indigo-500",   // Animation
  "bg-gradient-to-r from-purple-500 to-pink-500",   // Adult Animation
  "bg-gradient-to-r from-indigo-500 to-blue-500",   // Anime
  "bg-gradient-to-r from-pink-500 to-purple-500",   // Fairy Tale
  "bg-gradient-to-r from-blue-500 to-purple-500",   // Biblical
  "bg-gradient-to-r from-red-500 to-pink-500",      // Biographical
  "bg-gradient-to-r from-red-500 to-pink-500",      // Black Comedy
  "bg-gradient-to-r from-blue-500 to-purple-500",   // For Kids
  "bg-gradient-to-r from-indigo-500 to-purple-500", // For Teens
  "bg-gradient-to-r from-blue-500 to-indigo-500",   // Documentary
  "bg-gradient-to-r from-pink-500 to-purple-500",   // Drama
  "bg-gradient-to-r from-red-500 to-pink-500",      // Thriller
  "bg-gradient-to-r from-red-500 to-pink-500",      // Erotic
  "bg-gradient-to-r from-blue-500 to-indigo-500",   // Family
  "bg-gradient-to-r from-purple-500 to-pink-500",   // Fantasy
  "bg-gradient-to-r from-red-500 to-purple-500",    // Gangster
  "bg-gradient-to-r from-blue-500 to-purple-500",   // Historical
  "bg-gradient-to-r from-red-500 to-purple-500",    // Disaster
  "bg-gradient-to-r from-pink-500 to-purple-500",   // Comedy
  "bg-gradient-to-r from-red-500 to-pink-500",      // Crime
  "bg-gradient-to-r from-purple-500 to-blue-500"    // Surprise me
];

const chips = [
  "Action", "Animation", "Adult Animation", "Anime", "Fairy Tale", "Biblical",
  "Biographical", "Black Comedy", "For Kids", "For Teens", "Documentary",
  "Drama", "Thriller", "Erotic", "Family", "Fantasy", "Gangster",
  "Historical", "Disaster", "Comedy", "Crime", "Surprise me! 🎲"
];

export default function Step5Preferences({ form, updateForm, prev, next, loading }) {
  const [input, setInput] = useState(form.customPreference || "");

  const toggleChip = (chip) => {
    if (chip.includes("Surprise")) {
      updateForm({ preferences: ["Surprise me! 🎲"], customPreference: "" });
      setInput("");
      return;
    }
    if (form.preferences.includes(chip)) {
      updateForm({
        preferences: form.preferences.filter((c) => c !== chip),
      });
    } else {
      updateForm({
        preferences: [...form.preferences.filter((c) => !c.includes("Surprise")), chip],
      });
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    updateForm({ customPreference: e.target.value });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
      <div className="flex flex-col items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6935F9] to-[#6139F1] mb-3">
          <span className="text-3xl text-white">🎬</span>
        </div>
        <div className="text-lg md:text-xl font-bold text-center mb-1">What are you in the mood for?</div>
        <div className="text-gray-500 mb-1 text-center text-base">
          Type in any themes, genres, or keywords you're craving today.
        </div>
      </div>
      <input
        className="border-none rounded-xl px-4 py-2 w-full max-w-2xl mb-3 focus:outline-none focus:ring-2 focus:ring-[#6935F9] text-base transition shadow-sm bg-gray-50"
        placeholder="Example: Something from the 80s, with synth music and time travel..."
        value={input}
        onChange={handleInput}
      />
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6 w-full max-w-2xl">
        {chips.map((chip, i) => (
          <button
            key={chip}
            className={`py-2 px-4 rounded-lg font-semibold text-base shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#6935F9] hover:shadow-lg ${
              chip === "Surprise me! 🎲"
                ? "bg-gradient-to-r from-gray-100 to-gray-50 hover:from-purple-100 hover:to-purple-50 text-gray-800 border border-gray-200"
                : `${buttonStyles[i]} text-white hover:opacity-90`
            } ${form.preferences.includes(chip) ? 'ring-2 ring-[#6935F9] scale-105 shadow-lg' : ''}`}
            onClick={() => toggleChip(chip)}
            type="button"
          >
            {chip}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl bg-blue-50 border border-blue-100 rounded-xl px-2 py-2 mb-4 flex items-start gap-2">
        <span className="text-lg mt-1">💡</span>
        <div>
          <div className="font-semibold text-blue-900 mb-1 text-sm">Not sure what to write?</div>
          <div className="text-gray-600 text-xs">
            Feel free to be specific: romantic comedy, movies about friendship, noir vibes, slow cinema, lots of action, etc.
          </div>
        </div>
      </div>
      <div className="flex w-full max-w-2xl justify-between mt-4">
        <button
          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 transition text-base font-semibold shadow-sm"
          onClick={prev}
        >
          Previous
        </button>
        <button
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[220px] hover:opacity-90"
          onClick={next}
          disabled={form.preferences.length === 0 || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              Loading...
            </span>
          ) : (
            'Get your recommendations!'
          )}
        </button>
      </div>
    </div>
  );
}
