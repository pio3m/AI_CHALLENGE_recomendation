import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";

const BrainIcon = () => <span className="text-6xl">🧠</span>;
const ClapperboardIcon = () => <span className="text-6xl">🎬</span>;
const keywordsFallback = ["Comedy", "Tragicomedy", "Drama", "Action"];

function RecommendationsPage() {
  const [phase, setPhase] = useState(1);
  const [foundCount, setFoundCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  // Pobierz rekomendacje z localStorage
  useEffect(() => {
    const storedTitles = localStorage.getItem('rf_recommendation_titles');
    if (storedTitles) {
      try {
        const titles = JSON.parse(storedTitles);
        if (Array.isArray(titles) && titles.length > 0) {
          setRecommendations(titles);
          setFoundCount(titles.length);
        }
      } catch (e) {
        console.error('Error parsing stored recommendations:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (phase === 1 && foundCount > 0) {
      const interval = setInterval(() => {
        setFoundCount((c) => {
          if (c < recommendations.length) {
            return c + 1;
          } else {
            clearInterval(interval);
            return recommendations.length;
          }
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase, foundCount, recommendations.length]);

  useEffect(() => {
    if (phase === 1 && foundCount > 0) {
      const timeout = setTimeout(() => setPhase(2), 3500);
      return () => clearTimeout(timeout);
    }
  }, [phase, foundCount]);

  const keywords = keywordsFallback;
  const [showParams, setShowParams] = useState(false);
  const [showVibe, setShowVibe] = useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh]">
        <div className="text-xl font-bold text-gray-700 mb-6">Found {foundCount} matching movies</div>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {keywords.map((kw, i) => (
            <span
              key={kw + i}
              className="px-8 py-4 rounded-full border border-blue-200 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-lg transition shadow-sm hover:shadow-md cursor-pointer select-none"
              style={{ minWidth: '140px', textAlign: 'center' }}
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Renderuj tylko jeśli jest odpowiedni root (dla recommendations.html)
const rootDiv = document.getElementById("react-recommendations-root");
if (rootDiv) {
  const root = createRoot(rootDiv);
  root.render(<RecommendationsPage />);
}

export default RecommendationsPage; 