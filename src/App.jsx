import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import LoaderScreen from "./pages/LoaderScreen";
import BeginScreen from "./pages/BeginScreen";
import ModeSelectScreen from "./pages/ModeSelectScreen";
import LearningPage from "./pages/LearningPage";
import WordBuildingPage from "./pages/WordBuildingPage";

function LoaderRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/begin"), 3000);
    return () => clearTimeout(t);
  }, [navigate]);
  return <LoaderScreen />;
}

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<LoaderRedirect />} />
        <Route path="/begin" element={<BeginScreen onBegin={() => { }} />} />
        <Route path="/mode" element={<ModeSelectScreen />} />
        <Route path="/learn" element={<LearningPage />} />
        <Route path="/quiz" element={<WordBuildingPage />} />
      </Routes>
    </Box>
  );
}
