import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import HourglassBottomRoundedIcon from "@mui/icons-material/HourglassBottomRounded";
import NoPhotographyRoundedIcon from "@mui/icons-material/NoPhotographyRounded";

const COLORS = {
  deep: "#03045E",
  navy: "#023E8A",
  blue: "#0077B6",
  ink: "#0B1220",
};

const premiumCardSx = {
  borderRadius: 3,
  border: "1px solid rgba(3, 62, 138, 0.10)",
  boxShadow: "0 16px 50px rgba(2,62,138,0.10)",
  background: "#fff",
};

function StatusChip({ status }) {
  if (status === "correct")
    return (
      <Chip
        icon={<CheckCircleRoundedIcon />}
        label="Correct"
        color="success"
        sx={{ fontWeight: 900 }}
      />
    );
  if (status === "wrong")
    return (
      <Chip
        icon={<ErrorRoundedIcon />}
        label="Try again"
        color="warning"
        sx={{ fontWeight: 900 }}
      />
    );
  return (
    <Chip
      icon={<HourglassBottomRoundedIcon />}
      label="Waiting"
      size="small"
      sx={{
        fontWeight: 900,
        bgcolor: "rgba(11,18,32,0.06)",
        border: "1px solid rgba(11,18,32,0.10)",
      }}
    />
  );
}

/**
 * Webcam + frame capture (internal)
 * ✅ Updated to match your reference layout:
 * - Card-like camera area with thin blue accent border
 * - "Camera is off" centered message (icon + 2 lines)
 * - Start button looks like full-width blue bar
 */
function WebcamPanel({ running, setRunning, onFrame }) {
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

  // capture loop (throttled)
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
      {/* Camera Frame (matches image) */}
      <Box
        sx={{
          borderRadius: 2.5,
          overflow: "hidden",
          background: "#000",
          border: "1px solid rgba(3,62,138,0.14)",
          boxShadow: "0 10px 30px rgba(2,62,138,0.10)",
          aspectRatio: { xs: "16 / 10", sm: "16 / 9" },
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

        {/* Overlay when off (exact vibe like screenshot) */}
        {!running && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "rgba(255,255,255,0.92)",
              textAlign: "center",
              px: 2,
            }}
          >
            <Stack spacing={1} alignItems="center">
              <NoPhotographyRoundedIcon sx={{ fontSize: 40, opacity: 0.85 }} />
              <Typography sx={{ fontWeight: 900, fontSize: 15 }}>
                Camera is off
              </Typography>
              <Typography sx={{ fontSize: 12.5, opacity: 0.75 }}>
                Click Start Camera to begin practicing
              </Typography>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Button bar like screenshot */}
      <Button
        fullWidth
        startIcon={<VideocamRoundedIcon />}
        onClick={() => (running ? stop() : start())}
        sx={{
          mt: 1.6,
          py: 1.15,
          borderRadius: 1.8,
          background: COLORS.deep,
          color: "white",
          fontWeight: 900,
          textTransform: "none",
          boxShadow: "0 12px 25px rgba(3,4,94,0.22)",
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

export default function LearningLeftPanel({
  running,
  setRunning,
  onFrame,
  loadingPredict,
  status,
  pred,
  feedback,
}) {
  return (
    <Stack spacing={2.5}>
      {/* Camera Card */}
      <Card sx={premiumCardSx}>
        <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
          <Typography sx={{ fontWeight: 950, color: COLORS.ink, mb: 1.5 }}>
            Camera
          </Typography>

          <WebcamPanel running={running} setRunning={setRunning} onFrame={onFrame} />

          {loadingPredict && (
            <Box sx={{ mt: 1.6 }}>
              <LinearProgress />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Live Feedback (matches image: title + chip on right + big dash square + tip box) */}
      <Card sx={premiumCardSx}>
        <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography sx={{ fontWeight: 950, color: COLORS.ink }}>
              Live Feedback
            </Typography>
            <Box sx={{ flex: 1 }} />
            <StatusChip status={status} />
          </Stack>

          <Divider sx={{ my: 1.7 }} />

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Left mini tile (blue-tinted) */}
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                background: "rgba(0, 119, 182, 0.10)",
                border: "1px solid rgba(0, 119, 182, 0.18)",
                flexShrink: 0,
              }}
            >
              <Typography sx={{ fontWeight: 950, fontSize: 26, color: COLORS.deep }}>
                {pred?.label ?? "–"}
              </Typography>
            </Box>

            {/* Main feedback line */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: "rgba(11,18,32,0.72)", lineHeight: 1.6 }}>
                {feedback}
              </Typography>

              <Typography sx={{ mt: 0.6, fontSize: 12.5, color: "rgba(11,18,32,0.55)" }}>
                Confidence:{" "}
                {pred?.confidence != null ? `${Math.round(pred.confidence * 100)}%` : "—"}
              </Typography>
            </Box>
          </Stack>

          {/* Tip box like screenshot */}
          <Box
            sx={{
              mt: 2,
              borderRadius: 2,
              p: 1.6,
              background: "rgba(72, 202, 228, 0.10)",
              border: "1px solid rgba(0, 180, 216, 0.18)",
            }}
          >
            <Typography sx={{ fontWeight: 900, color: COLORS.ink, fontSize: 13 }}>
              Tip for better accuracy
            </Typography>
            <Typography sx={{ mt: 0.4, color: "rgba(11,18,32,0.65)", fontSize: 12.5 }}>
              Keep your hand centered, steady, and well-lit. Avoid busy backgrounds.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
