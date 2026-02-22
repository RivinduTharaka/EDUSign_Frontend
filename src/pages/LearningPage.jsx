import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useNavigate } from "react-router-dom";

/**
 * LocalStorage keys
 */
const LS_KEY = "edusign_learning_stats_v1";

/**
 * Helper: A-Z
 */
const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

/**
 * Theme palette (white / black / blue)
 */
const THEMES = {
  light: {
    primary: "#1A73E8",
    primaryDark: "#1557B0",
    secondary: "#4C6EF5",
    accent: "#22D3EE",
    background: "#F1F5F9",
    card: "rgba(255, 255, 255, 0.9)",
    cardBorder: "rgba(0, 0, 0, 0.05)",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    divider: "rgba(0, 0, 0, 0.05)",
    glass: "rgba(255, 255, 255, 0.7)",
  },
  dark: {
    primary: "#3B82F6",
    primaryDark: "#2563EB",
    secondary: "#6366F1",
    accent: "#06B6D4",
    background: "#0F172A",
    card: "rgba(30, 41, 59, 0.8)",
    cardBorder: "rgba(255, 255, 255, 0.1)",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    success: "#10B981",
    warning: "#FBBF24",
    error: "#F87171",
    divider: "rgba(255, 255, 255, 0.05)",
    glass: "rgba(15, 23, 42, 0.6)",
  },
};
const LS_THEME_KEY = "edusign_theme_mode";

function loadStats() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveStats(stats) {
  localStorage.setItem(LS_KEY, JSON.stringify(stats));
}

/**
 * Put images like: src/assets/gestures/A.png, B.png ...
 */
function getGestureImage(letter) {
  return new URL(`../assets/gestures/${letter}.png`, import.meta.url).href;
}

const getPremiumCardSx = (C) => ({
  borderRadius: "20px",
  border: "1px solid",
  borderColor: C.cardBorder,
  background: C.card,
  backdropFilter: "blur(16px)",
  boxShadow: `0 4px 24px ${C.background === "#F1F5F9" ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.2)"}`,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s ease",
});

const getSelectSx = (C) => ({
  color: C.textPrimary,
  "& .MuiSelect-select": {
    color: C.textPrimary,
    fontWeight: 600,
    py: 1,
  },
  "& .MuiSvgIcon-root": {
    color: C.textSecondary,
  },
  "& fieldset": {
    borderColor: C.cardBorder,
    borderRadius: "12px",
  },
  "&:hover fieldset": {
    borderColor: C.textSecondary,
  },
  "&.Mui-focused fieldset": {
    borderColor: C.primary,
  },
});

const getMenuPaperProps = (C) => ({
  PaperProps: {
    sx: {
      borderRadius: 3,
      mt: 0.5,
      background: C.background,
      border: `1px solid ${C.cardBorder}`,
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
      "& .MuiMenuItem-root": {
        color: C.textPrimary,
        fontSize: "14px",
        mx: 0.5,
        my: 0.2,
        borderRadius: "8px",
        "&:hover": {
          background: C.divider,
        },
        "&.Mui-selected": {
          background: C.primary,
          color: "#FFF",
          "&:hover": {
            background: C.primaryDark,
          },
        },
      },
    },
  },
});

/**
 * Webcam Panel
 */
function WebcamPanel({ onFrame, running, setRunning, colors: C }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const [error, setError] = useState("");

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setRunning(true);
    } catch (e) {
      console.error(e);
      setError("Camera permission denied or camera not available.");
      setRunning(false);
    }
  };

  const stop = () => {
    const s = streamRef.current;
    if (s) s.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setRunning(false);
  };

  useEffect(() => {
    if (!running) return;

    let rafId = null;
    let lastSent = 0;

    const tick = () => {
      const now = Date.now();
      const intervalMs = 350;

      if (videoRef.current && canvasRef.current && now - lastSent > intervalMs) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const w = 320;
        const h = 240;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, 0, 0, w, h);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        onFrame?.(dataUrl);

        lastSent = now;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => rafId && cancelAnimationFrame(rafId);
  }, [running, onFrame]);

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          // background: "#000",
          border: `1px solid ${C.cardBorder}`,
          aspectRatio: "16 / 9",
          position: "relative",
          // boxShadow: "0 8px 30px rgba(0, 0, 0, 0.15)",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            display: "block",
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Technical Overlays */}
        {running && (
          <>
            {/* Corner Brackets */}
            <Box sx={{ position: "absolute", top: 15, left: 15, width: 30, height: 30, borderTop: "1.5px solid #fff", borderLeft: "1.5px solid #fff", opacity: 0.5 }} />
            <Box sx={{ position: "absolute", top: 15, right: 15, width: 30, height: 30, borderTop: "1.5px solid #fff", borderRight: "1.5px solid #fff", opacity: 0.5 }} />
            <Box sx={{ position: "absolute", bottom: 15, left: 15, width: 30, height: 30, borderBottom: "1.5px solid #fff", borderLeft: "1.5px solid #fff", opacity: 0.5 }} />
            <Box sx={{ position: "absolute", bottom: 15, right: 15, width: 30, height: 30, borderBottom: "1.5px solid #fff", borderRight: "1.5px solid #fff", opacity: 0.5 }} />

            {/* Tag */}
            <Box
              sx={{
                position: "absolute",
                top: 15,
                left: 15,
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                // background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(4px)",
                px: 1.2,
                py: 0.4,
                borderRadius: "4px",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: C.error,
                  animation: "pulse 1.5s infinite",
                  "@keyframes pulse": {
                    "0%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.5, transform: "scale(1.2)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                  },
                }}
              />
              <Typography sx={{ color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>ANALYSIS ACTIVE</Typography>
            </Box>
          </>
        )}

        {!running && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: C.background === "#F1F5F9" ? "rgba(241, 245, 249, 0.95)" : "rgba(15, 21, 42, 0.95)",
              backdropFilter: "blur(8px)",
              color: C.textPrimary,
              textAlign: "center",
              px: 2,
            }}
          >
            <Box>
              <VideocamRoundedIcon sx={{ fontSize: 40, mb: 1, color: C.textSecondary, opacity: 0.3 }} />
              <Typography sx={{ fontWeight: 800, fontSize: 16 }}>Camera Standby</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 12, color: C.textSecondary, maxWidth: 220 }}>
                Activate your camera to start real-time ASL recognition
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Button
        fullWidth
        variant="contained"
        startIcon={<VideocamRoundedIcon />}
        onClick={() => (running ? stop() : start())}
        sx={{
          mt: 2,
          py: 1,
          borderRadius: "12px",
          background: running ? `${C.error}22` : C.primary,
          color: running ? C.error : "#FFF",
          border: running ? `1px solid ${C.error}44` : "none",
          fontWeight: 700,
          fontSize: "14px",
          textTransform: "none",
          boxShadow: running ? "none" : `0 4px 12px ${C.primary}33`,
          "&:hover": {
            background: running ? `${C.error}33` : C.primaryDark,
          },
          transition: "all 0.2s ease",
        }}
      >
        {running ? "Stop Camera" : "Start Practice"}
      </Button>

      {error && (
        <Typography sx={{ mt: 1, color: C.error, fontSize: 12, textAlign: "center", fontWeight: 600 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default function LearningPage() {
  const navigate = useNavigate();

  // Theme support
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem(LS_THEME_KEY) || "dark");
  const C = THEMES[themeMode];

  useEffect(() => {
    localStorage.setItem(LS_THEME_KEY, themeMode);
  }, [themeMode]);

  const toggleTheme = () => setThemeMode(themeMode === "light" ? "dark" : "light");

  const [letter, setLetter] = useState("A");
  const [running, setRunning] = useState(false);

  const [pred, setPred] = useState(null); // {label, confidence}
  const [status, setStatus] = useState("waiting"); // waiting | correct | wrong
  const [feedback, setFeedback] = useState("Waiting for hand gesture...");
  const [loadingPredict, setLoadingPredict] = useState(false);

  const [stats, setStats] = useState(() => loadStats());

  const currentStats = useMemo(() => {
    const s = stats?.[letter] || { attempts: 0, correct: 0 };
    const accuracy = s.attempts ? Math.round((s.correct / s.attempts) * 100) : 0;
    return { ...s, accuracy };
  }, [stats, letter]);

  const bumpAttempt = (isCorrect) => {
    setStats((prev) => {
      const next = { ...(prev || {}) };
      const cur = next[letter] || { attempts: 0, correct: 0 };
      cur.attempts += 1;
      if (isCorrect) cur.correct += 1;
      next[letter] = cur;
      saveStats(next);
      return next;
    });
  };

  const predictFromFrame = useCallback(
    async (dataUrl) => {
      if (!running) return;
      if (loadingPredict) return;

      setLoadingPredict(true);
      try {
        const res = await fetch("http://localhost:8000/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: dataUrl,
            target: letter,
            mode: "learning",
          }),
        });

        if (!res.ok) throw new Error("Predict failed");
        const json = await res.json();

        setPred(json);

        const conf = json?.confidence ?? 0;
        const label = json?.label;

        const isCorrect = label === letter && conf >= 0.7;

        if (isCorrect) {
          setStatus("correct");
          setFeedback("Excellent! Gesture recognized correctly.");
          bumpAttempt(true);
        } else {
          if (conf >= 0.55) bumpAttempt(false);
          setStatus("wrong");
          setFeedback(`Not quite: Detected "${label ?? "-"}" (${Math.round(conf * 100)}%).`);
        }
      } catch (e) {
        setStatus("waiting");
        setFeedback("Waiting for system response...");
      } finally {
        setLoadingPredict(false);
      }
    },
    [running, loadingPredict, letter]
  );

  useEffect(() => {
    setPred(null);
    setStatus("waiting");
    setFeedback("Awaiting visual acquisition...");
  }, [letter]);

  const StatusChip = () => {
    if (status === "correct")
      return (
        <Chip
          icon={<CheckCircleRoundedIcon sx={{ fontSize: "14px !important" }} />}
          label="RECOGNIZED"
          size="small"
          sx={{
            fontWeight: 800,
            borderRadius: "6px",
            px: 0.5,
            fontSize: "10px",
            height: 24,
            background: C.success,
            color: "#FFF",
          }}
        />
      );

    if (status === "wrong")
      return (
        <Chip
          icon={<ErrorRoundedIcon sx={{ fontSize: "14px !important" }} />}
          label="ANALYZING"
          size="small"
          sx={{
            fontWeight: 800,
            borderRadius: "6px",
            px: 0.5,
            fontSize: "10px",
            height: 24,
            background: `${C.warning}22`,
            color: C.warning,
            border: `1px solid ${C.warning}44`,
          }}
        />
      );

    return (
      <Chip
        icon={<HourglassBottomRoundedIcon sx={{ fontSize: "14px !important" }} />}
        label="STANDBY"
        size="small"
        sx={{
          fontWeight: 800,
          borderRadius: "6px",
          px: 0.5,
          fontSize: "10px",
          height: 24,
          background: C.divider,
          color: C.textSecondary,
        }}
      />
    );
  };

  const premiumCard = getPremiumCardSx(C);

  return (
    <Box
      sx={{
        height: { xs: "auto", md: "100vh" },
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: C.background,
        px: { xs: 2, md: 3 }, // Slightly reduced padding for more width
        py: { xs: 2, md: 2 },
        color: C.textPrimary,
        overflow: { xs: "auto", md: "hidden" },
        position: "relative",
        transition: "background 0.3s ease",
      }}
    >
      {/* Top Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Tooltip title="Back">
          <IconButton
            onClick={() => navigate("/mode")}
            sx={{
              background: C.glass,
              border: `1px solid ${C.cardBorder}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              "&:hover": { background: C.divider, transform: "translateX(-2px)" },
            }}
          >
            <ArrowBackRoundedIcon sx={{ fontSize: 18, color: C.textPrimary }} />
          </IconButton>
        </Tooltip>

        <Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, color: C.textPrimary, lineHeight: 1 }}>
            Practice Mode
          </Typography>
          <Typography sx={{ color: C.textSecondary, fontSize: 11, mt: 0.5, fontWeight: 500 }}>
            Session ID: ASL-{letter}-902
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Theme Toggle */}
        <Tooltip title={themeMode === "light" ? "Switch to Dark" : "Switch to Light"}>
          <IconButton
            onClick={toggleTheme}
            sx={{
              background: C.glass,
              border: `1px solid ${C.cardBorder}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              mr: 1,
              "&:hover": { background: C.divider },
            }}
          >
            {themeMode === "light" ? (
              <DarkModeRoundedIcon sx={{ fontSize: 18, color: C.textPrimary }} />
            ) : (
              <LightModeRoundedIcon sx={{ fontSize: 18, color: C.textPrimary }} />
            )}
          </IconButton>
        </Tooltip>

        <Box
          sx={{
            background: C.glass,
            border: `1px solid ${C.cardBorder}`,
            borderRadius: "12px",
            px: 2,
            py: 0.8,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 10, color: C.textSecondary, fontWeight: 800, letterSpacing: 1 }}>
            TARGET
          </Typography>
          <Typography sx={{ fontSize: 20, fontWeight: 900, color: C.primary }}>
            {letter}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2.5,
          minHeight: 0,
        }}
      >
        {/* Left: Video & Analysis */}
        <Box sx={{ flex: 6, display: "flex", flexDirection: "column", gap: 2.5, minHeight: 0 }}>
          <Card sx={{ ...premiumCard, flex: 1, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: 13, color: C.textPrimary }}>
                  Acquisition Feed
                </Typography>
                <Typography sx={{ fontSize: 10, color: C.textSecondary, fontWeight: 700 }}>
                  320x240 @ 350ms
                </Typography>
              </Box>
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <WebcamPanel running={running} setRunning={setRunning} onFrame={predictFromFrame} colors={C} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right: Config, Analysis & Reference */}
        <Box sx={{ flex: 6, display: "flex", flexDirection: "column", gap: 2.5, minHeight: 0 }}>
          <Card sx={premiumCard}>
            <CardContent sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: C.textPrimary, mb: 1.5 }}>
                Module Config
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  sx={getSelectSx(C)}
                  MenuProps={getMenuPaperProps(C)}
                  size="small"
                >
                  {LETTERS.map((L) => (
                    <MenuItem key={L} value={L}>ASL Glyph: {L}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>

          {/* New Row: Analysis & Reference */}
          <Box sx={{ display: "flex", gap: 2.5, flex: 1, minHeight: 0 }}>
            {/* Neural Analysis */}
            <Card sx={{ ...premiumCard, flex: 1 }}>
              <CardContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 13, color: C.textPrimary }}>
                    Neural Analysis
                  </Typography>
                  <StatusChip />
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      background: status === "correct" ? `${C.success}15` : `${C.primary}10`,
                      border: `1px solid ${status === "correct" ? `${C.success}33` : `${C.primary}22`}`,
                      flexShrink: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: 32,
                        color: status === "correct" ? C.success : C.primary,
                      }}
                    >
                      {pred?.label ?? "—"}
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: C.textPrimary, fontSize: 14, fontWeight: 700, mb: 0.5, lineHeight: 1.2 }}>
                      {!running ? "Paused" : feedback}
                    </Typography>
                    {running && pred && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ width: "100%", height: 4, background: C.divider, borderRadius: 10, overflow: "hidden", mb: 0.5 }}>
                          <Box
                            sx={{
                              width: `${pred.confidence * 100}%`,
                              height: "100%",
                              background: status === "correct" ? C.success : C.primary,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: 9, color: C.textSecondary, fontWeight: 600 }}>
                          {Math.round(pred.confidence * 100)}% Match
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Visual Reference */}
            <Card sx={{ ...premiumCard, flex: 1 }}>
              <CardContent sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: 800, fontSize: 13, color: C.textPrimary, mb: 0.5 }}>
                  Visual Reference
                </Typography>
                <Typography sx={{ color: C.textSecondary, fontSize: 10, mb: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  Match the gesture below
                </Typography>

                <Box
                  sx={{
                    flex: 1,
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: C.divider,
                    display: "grid",
                    placeItems: "center",
                    p: 1.5,
                    position: "relative",
                    border: `1px dashed ${C.cardBorder}`,
                  }}
                >
                  <img
                    src={getGestureImage(letter)}
                    alt={`ASL ${letter}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      filter: themeMode === "dark" ? "brightness(0.9) contrast(1.1)" : "none",
                    }}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Session Analytics */}
          <Card sx={premiumCard}>
            <CardContent sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 13, color: C.textPrimary, mb: 1.5 }}>
                Session Analytics
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexWrap: "wrap"
                }}
              >
                {[
                  { label: "Attempts", value: currentStats.attempts, color: C.textSecondary },
                  { label: "Success", value: currentStats.correct, color: C.success },
                  { label: "Accuracy", value: `${currentStats.accuracy}%`, color: C.primary },
                ].map((stat) => (
                  <Box
                    key={stat.label}
                    sx={{
                      flex: 1,
                      minWidth: "70px",
                      p: 1,
                      borderRadius: "10px",
                      background: C.divider,
                      textAlign: "center",
                      border: `1px solid ${C.cardBorder}`
                    }}
                  >
                    <Typography sx={{ fontSize: 8, fontWeight: 700, color: C.textSecondary, textTransform: "uppercase", mb: 0.2 }}>
                      {stat.label}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 900, color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
