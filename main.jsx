// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import OnboardingContainer from "./components/OnboardingContainer";
import RecommendationsPage from "./components/RecommendationsPage";
import RecommendationsMainPage from "./components/RecommendationsMainPage";

// helper – unika podwójnego createRoot i automatycznie owija w <BrowserRouter>
function mount(id, element) {
  const host = document.getElementById(id);
  if (host && !host._reactRoot) {
    const root = createRoot(host);
    host._reactRoot = root;
    root.render(<BrowserRouter>{element}</BrowserRouter>);
  }
}

mount(
  "react-onboarding-root",
  <OnboardingContainer onClose={() => (window.location.href = "/")} />
);

mount("react-recommendations-root", <RecommendationsPage />);
mount("react-recommendations-main-root", <RecommendationsMainPage />);
