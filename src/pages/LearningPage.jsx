import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
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
const COLORS = {
  deep: "#03045E",
  navy: "#023E8A",
  blue: "#0077B6",
  sky: "#0096C7",
  cyan: "#00B4D8",
  ice: "#48CAE4",
  mist: "#90E0EF",
  snow: "#ADE8F4",
  cloud: "#CAF0F8",
  ink: "#0B1220",
};

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

/**
 * Premium card style (white, clean)
 */
const premiumCardSx = {
  borderRadius: "16px",
  border: "1px solid rgba(2, 62, 138, 0.08)",
  boxShadow: "0 8px 32px rgba(2, 62, 138, 0.06)",
  background: "#fff",
};

/**
 * ✅ Dropdown styles: force BLACK text so it's visible
 */
const selectBlackSx = {
  color: "#0B1220",
  "& .MuiSelect-select": {
    color: "#0B1220",
  },
  "& .MuiSvgIcon-root": {
    color: "rgba(11,18,32,0.75)", // dropdown arrow
  },
  "& fieldset": {
    borderColor: "rgba(3, 62, 138, 0.18)",
  },
  "&:hover fieldset": {
    borderColor: "rgba(3, 62, 138, 0.30)",
  },
  "&.Mui-focused fieldset": {
    borderColor: "rgba(3, 62, 138, 0.45)",
  },
};

const menuPaperProps = {
  PaperProps: {
    sx: {
      borderRadius: 2,
      mt: 1,
      border: "1px solid rgba(3,62,138,0.10)",
      boxShadow: "0 18px 60px rgba(2,62,138,0.14)",
      "& .MuiMenuItem-root": {
        color: "#0B1220",
      },
    },
  },
};

/**
 * Webcam Panel
 */
function WebcamPanel({ onFrame, running, setRunning }) {
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
          background: "#000",
          border: "1px solid rgba(3,62,138,0.10)",
          aspectRatio: "16 / 9",
          position: "relative",
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

        {!running && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.55))",
              color: "rgba(255,255,255,0.92)",
              textAlign: "center",
              px: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 16 }}>Camera is off</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 13, opacity: 0.85 }}>
                Click “Start Camera” to begin practicing
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Button
        fullWidth
        startIcon={<VideocamRoundedIcon />}
        onClick={() => (running ? stop() : start())}
        sx={{
          mt: 2,
          py: 1.2,
          borderRadius: 2.5,
          background: COLORS.deep,
          color: "white",
          fontWeight: 900,
          textTransform: "none",
          "&:hover": { background: COLORS.navy },
        }}
      >
        {running ? "Stop Camera" : "Start Camera"}
      </Button>

      {error && (
        <Typography sx={{ mt: 1, color: "error.main", fontSize: 13 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default function LearningPage() {
  const navigate = useNavigate();

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
          setFeedback("Correct ✅ Great job! Hold steady for a moment.");
          bumpAttempt(true);
        } else {
          if (conf >= 0.55) bumpAttempt(false);
          setStatus("wrong");
          setFeedback(`Try again: I see "${label ?? "-"}" (${Math.round(conf * 100)}%).`);
        }
      } catch (e) {
        setStatus("waiting");
        setFeedback("Waiting for backend prediction...");
      } finally {
        setLoadingPredict(false);
      }
    },
    [running, loadingPredict, letter]
  );

  useEffect(() => {
    setPred(null);
    setStatus("waiting");
    setFeedback("Waiting for hand gesture...");
  }, [letter]);

  const StatusChip = () => {
    if (status === "correct")
      return (
        <Chip
          icon={<CheckCircleRoundedIcon sx={{ fontSize: "18px !important" }} />}
          label="Correct"
          size="small"
          color="success"
          sx={{ fontWeight: 700, borderRadius: "6px", px: 0.5 }}
        />
      );

    if (status === "wrong")
      return (
        <Chip
          icon={<ErrorRoundedIcon sx={{ fontSize: "18px !important" }} />}
          label="Try again"
          size="small"
          color="warning"
          sx={{ fontWeight: 700, borderRadius: "6px", px: 0.5 }}
        />
      );

    return (
      <Chip
        icon={<HourglassBottomRoundedIcon sx={{ fontSize: "18px !important" }} />}
        label="Waiting"
        size="small"
        sx={{
          fontWeight: 700,
          borderRadius: "6px",
          px: 0.5,
          background: "rgba(0,0,0,0.05)",
          color: "rgba(0,0,0,0.5)"
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch", // Ensure children stretch to full width
        background: `linear-gradient(180deg, ${COLORS.cloud} 0%, #ffffff 85%)`,
        px: { xs: 2.5, sm: 4, md: 5, lg: 6, xl: 8 },
        py: { xs: 3, sm: 4 },
        overflowX: "hidden"
      }}
    >
      {/* Top bar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3.5 }}>
        <Tooltip title="Back">
          <IconButton
            onClick={() => navigate("/mode")}
            sx={{
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              "&:hover": { background: "#f8f9fa" }
            }}
          >
            <ArrowBackRoundedIcon sx={{ fontSize: 20, color: COLORS.ink }} />
          </IconButton>
        </Tooltip>

        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: 22, sm: 26 }, color: COLORS.ink, lineHeight: 1.2 }}>
            Learning Mode
          </Typography>
          <Typography sx={{ color: "rgba(11,18,32,0.5)", fontSize: 13.5 }}>
            Practice letters at your own pace with real-time AI feedback
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        <Chip
          label={
            <Typography sx={{ fontSize: 13, color: COLORS.ink }}>
              Target: <Box component="span" sx={{ fontWeight: 800 }}>{letter}</Box>
            </Typography>
          }
          variant="outlined"
          sx={{
            borderRadius: "100px",
            borderColor: "rgba(0,0,0,0.12)",
            background: "#fff",
            height: 36,
            px: 0.5
          }}
        />
      </Box>

      <Box sx={{ width: "100%", flexGrow: 1 }}>
        <Grid
          container
          spacing={4}
          sx={{ width: "auto" }}
        >
          {/* LEFT COLUMN */}
          <Grid size={{ xs: 12, md: 8, lg: 8, xl: 8 }}>
            <Stack spacing={4}>
              {/* Camera Card */}
              <Card sx={premiumCardSx}>
                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.ink, mb: 2.5 }}>
                    Camera
                  </Typography>

                  <WebcamPanel running={running} setRunning={setRunning} onFrame={predictFromFrame} />

                  {loadingPredict && (
                    <Box sx={{ mt: 2, px: 2 }}>
                      <LinearProgress sx={{ borderRadius: 10, height: 6 }} />
                    </Box>
                  )}
                </CardContent>
              </Card>

              {/* Live Feedback Card */}
              <Card sx={premiumCardSx}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.ink }}>
                      Live Feedback
                    </Typography>
                    <StatusChip />
                  </Box>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: "12px",
                        display: "grid",
                        placeItems: "center",
                        background: status === "correct" ? "rgba(10,166,71,0.1)" : "rgba(173, 232, 244, 0.45)",
                        border: "1px solid",
                        borderColor: status === "correct" ? "rgba(10,166,71,0.2)" : "rgba(0,119,182,0.15)",
                        flexShrink: 0,
                        transition: "all 0.3s ease"
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: 36, color: status === "correct" ? "#0aa647" : COLORS.blue }}>
                        {pred?.label ?? "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography sx={{ color: COLORS.ink, fontSize: 15, fontWeight: 500 }}>
                        {!running ? "Start your camera to begin practice" : feedback}
                      </Typography>
                      {running && pred && (
                        <Typography sx={{ mt: 0.5, fontSize: 13, color: "rgba(11,18,32,0.4)" }}>
                          System is {Math.round(pred.confidence * 100)}% sure
                        </Typography>
                      )}
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      mt: 3.5,
                      p: 2,
                      borderRadius: "12px",
                      background: "rgba(173, 232, 244, 0.12)",
                      border: "1px solid rgba(173, 232, 244, 0.25)",
                    }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: 13, color: COLORS.deep, mb: 0.5 }}>
                      Tip for better accuracy
                    </Typography>
                    <Typography sx={{ fontSize: 12.5, color: "rgba(11,18,32,0.5)" }}>
                      Keep your hand centered, steady, and well-lit. Avoid busy backgrounds.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid size={{ xs: 12, md: 4, lg: 4, xl: 4 }}>
            <Stack spacing={4}>
              {/* Select Letter Card */}
              <Card sx={premiumCardSx}>
                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.ink, mb: 2 }}>
                    Select Letter
                  </Typography>

                  <FormControl fullWidth>
                    <Select
                      value={letter}
                      onChange={(e) => setLetter(e.target.value)}
                      sx={selectBlackSx}
                      MenuProps={menuPaperProps}
                      size="small"
                    >
                      {LETTERS.map((L) => (
                        <MenuItem key={L} value={L}>
                          {L}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      mt: 2.5,
                      borderRadius: "12px",
                      p: 3,
                      textAlign: "center",
                      background: "rgba(202, 240, 248, 0.25)",
                      border: "1px solid rgba(202, 240, 248, 0.5)",
                    }}
                  >
                    <Typography sx={{ color: "rgba(11,18,32,0.4)", fontSize: 13, mb: 0.5 }}>
                      Practice this letter:
                    </Typography>
                    <Typography sx={{ fontSize: 64, fontWeight: 800, color: COLORS.deep, lineHeight: 1 }}>
                      {letter}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              {/* How to Sign Card */}
              <Card sx={premiumCardSx}>
                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.ink }}>
                    How to sign “{letter}”
                  </Typography>
                  <Typography sx={{ mt: 0.5, color: "rgba(11,18,32,0.4)", fontSize: 13, mb: 2.5 }}>
                    Match the hand shape shown below
                  </Typography>

                  <Box
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "1px solid rgba(0,0,0,0.06)",
                      background: "#fdfdfd",
                      display: "grid",
                      placeItems: "center",
                      p: 1.5,
                      aspectRatio: "4 / 3"
                    }}
                  >
                    <img
                      src={getGestureImage(letter)}
                      alt={`ASL ${letter}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </Box>
                  <Typography sx={{ mt: 1.5, fontSize: 11, color: "rgba(0,0,0,0.3)", textAlign: "center" }}>
                    (Add custom image at: src/assets/gestures/{letter}.png)
                  </Typography>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card sx={premiumCardSx}>
                <CardContent sx={{ p: 4 }}>
                  <Typography sx={{ fontWeight: 800, fontSize: 16, color: COLORS.ink, mb: 2.5 }}>
                    Stats (Letter {letter})
                  </Typography>

                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{
                        borderRadius: "10px", p: 1.5, textAlign: "center",
                        background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.04)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                      }}>
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Attempts
                        </Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: 24, color: COLORS.ink }}>
                          {currentStats.attempts}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Box sx={{
                        borderRadius: "10px", p: 1.5, textAlign: "center",
                        background: "rgba(10,166,71,0.05)", border: "1px solid rgba(10,166,71,0.1)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                      }}>
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Correct
                        </Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: 24, color: "#0aa647" }}>
                          {currentStats.correct}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <Box sx={{
                        borderRadius: "10px", p: 1.5, textAlign: "center",
                        background: "rgba(0,119,182,0.05)", border: "1px solid rgba(0,119,182,0.1)",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                      }}>
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)", mb: 0.5, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          Accuracy
                        </Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: 24, color: COLORS.blue }}>
                          {currentStats.accuracy}%
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Typography sx={{ fontSize: 12.5, color: "rgba(11,18,32,0.5)", lineHeight: 1.5, fontWeight: 500 }}>
                      Aim for 80%+ accuracy before moving to the next letter.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
