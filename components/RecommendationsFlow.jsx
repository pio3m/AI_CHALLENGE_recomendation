import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Możesz podmienić na ikony z lucide-react/heroicons jeśli będą dostępne
const BrainIcon = () => <span className="text-6xl">🧠</span>;
const ClapperboardIcon = () => <span className="text-6xl">🎬</span>;

const keywordsFallback = ["Comedy", "Tragicomedy", "Drama", "Action"];

export default function RecommendationsFlow({ form, recommendations = [], onClose, isLoading = false }) {
  const [phase, setPhase] = useState(1);
  const [foundCount, setFoundCount] = useState(0);
  const [showList, setShowList] = useState(false);
  const navigate = useNavigate();

  // Ustaw rzeczywistą liczbę rekomendacji
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      setFoundCount(recommendations.length);
    }
  }, [recommendations]);

  // Animowane zliczanie znalezionych filmów podczas loading
  useEffect(() => {
    if (isLoading && phase === 1) {
      // Symuluj wyszukiwanie od 0 do rzeczywistej liczby
      const targetCount = recommendations.length || 45;
      const interval = setInterval(() => {
        setFoundCount((c) => {
          if (c < targetCount) {
            return c + 1;
          } else {
            clearInterval(interval);
            return targetCount;
          }
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isLoading, phase, recommendations.length]);

  // Automatyczne przejście do fazy 2 po zakończeniu loading
  useEffect(() => {
    if (!isLoading && phase === 1 && foundCount > 0) {
      const timeout = setTimeout(() => setPhase(2), 1000);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, phase, foundCount]);

  // Zbierz keywordy z form
  const keywords = form?.preferences?.length ? form.preferences : keywordsFallback;

  return (
    <div className="w-full min-h-[70vh] flex flex-col">
      {/* Usunięto górny pasek z przyciskami */}
      <AnimatePresence mode="wait">
        {showList ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center flex-1 min-h-[50vh]"
          >
            <div className="text-4xl mb-6">🍿</div>
            <div className="text-2xl md:text-3xl font-bold mb-2 text-center">Movie list will appear here</div>
            <div className="text-gray-500 text-lg mb-4 text-center">(Placeholder for recommendations)</div>
            <button className="mt-6 text-sm underline text-gray-400" onClick={onClose}>Close</button>
          </motion.div>
        ) : isLoading || phase === 1 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center flex-1 min-h-[50vh]"
          >
            <BrainIcon />
            <div className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-center">Searching movie database...</div>
            <div className="text-gray-500 text-lg mb-12 text-center">Searching among 45,000 movies. (MVP version)</div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center flex-1 min-h-[50vh]"
          >
            <ClapperboardIcon />
            <div className="text-2xl md:text-3xl font-bold mt-12 mb-6 text-center">From now on your recommendations will be tailored to</div>
            <div className="text-gray-500 text-lg mb-12 text-center">You can change them anytime in settings.</div>
            <div className="text-xl font-bold text-gray-700 mb-8">Found {foundCount} matching movies</div>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              {keywords.map((kw, i) => (
                <span key={kw + i} className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-lg shadow">
                  {kw}
                </span>
              ))}
            </div>
            <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-12 py-5 rounded-xl shadow-lg hover:shadow-xl transition font-bold text-lg mt-4" onClick={() => {
              if (recommendations && recommendations.length > 0) {
                const titles = recommendations.map(r => r.title || r.name);
                localStorage.setItem('rf_recommendation_titles', JSON.stringify(titles));
              }
              window.location.href = '/recommendations-main.html';
            }}>
              Check recommendations
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 