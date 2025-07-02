import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Step1Name from "./Onboarding/Step1Name";
import Step2Age from "./Onboarding/Step2Age";
import Step3Mood from "./Onboarding/Step3Mood";
import Step4MoodReason from "./Onboarding/Step4MoodReason";
import Step5Preferences from "./Onboarding/Step5Preferences";
import ProgressBar from "./Onboarding/ProgressBar";
import RecommendationsFlow from "./RecommendationsFlow";
import { fetchEmotions, fetchRecommendations } from "../src/api.js"; // ✅

const steps = [
  Step1Name,
  Step2Age,
  Step3Mood,
  Step4MoodReason,
  Step5Preferences,
];

export default function OnboardingContainer({ onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    age: "",
    mood: "",
    moodReason: "",
    preferences: [],
    customPreference: "",
  });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const CurrentStep = steps[step];

  const next = async () => {
    if (step === steps.length - 1) {
      setLoading(true);
      try {
        const sentence = [
          `Dziś czuję się ${form.mood}`,
          form.moodReason && `bo ${form.moodReason}`,
          form.preferences.length && `chciałbym coś w stylu ${form.preferences.join(", ")}`,
        ]
          .filter(Boolean)
          .join(". ");

        console.log("🧠 Tworzone zdanie:", sentence);

        const emotions = await fetchEmotions(sentence);
        console.log("🎭 Emocje:", emotions);

        // Pobierz wykluczone tytuły z localStorage
        const excluded = JSON.parse(localStorage.getItem('rf_excluded_titles') || '[]');

        const recs = await fetchRecommendations(emotions, 45, excluded);
        console.log("🎬 Rekomendacje:", recs);

        // Zapisz mood i moodReason do localStorage
        localStorage.setItem('rf_mood', form.mood);
        localStorage.setItem('rf_mood_reason', form.moodReason);

        setRecommendations(recs);
        setShowRecommendations(true);
      } catch (err) {
        console.error("❌ Błąd pobierania rekomendacji:", err);
        alert("Ups! Nie udało się pobrać rekomendacji.");
      } finally {
        setLoading(false);
      }
    } else {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const updateForm = (fields) => setForm((f) => ({ ...f, ...fields }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen min-w-full bg-white">
      <div className="relative w-full max-w-5xl mx-auto px-16 py-20 bg-white rounded-3xl flex flex-col items-center">
        {showRecommendations ? (
          <RecommendationsFlow
            form={form}
            recommendations={recommendations}
            onClose={onClose}
            isLoading={loading}
          />
        ) : (
          <>
            <ProgressBar step={step} total={steps.length} />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.4 }}
              >
                <CurrentStep
                  form={form}
                  updateForm={updateForm}
                  next={next}
                  prev={prev}
                  onClose={onClose}
                  step={step}
                  loading={loading && step === steps.length - 1}
                />
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
