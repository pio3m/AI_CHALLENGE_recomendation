import React, { useState } from "react";
import OnboardingContainer from "./components/OnboardingContainer";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div>
      {/* Twoja strona główna */}
      <button
        onClick={() => setShowOnboarding(true)}
        className="bg-gradient-to-tr from-[#6935F9] to-[#6139F1] text-white px-8 py-2 rounded-lg shadow-md hover:shadow-lg transition font-semibold"
        style={{ position: 'fixed', top: 32, right: 32, zIndex: 100 }}
      >
        Zacznij teraz!
      </button>
      {showOnboarding && (
        <OnboardingContainer onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  );
} 