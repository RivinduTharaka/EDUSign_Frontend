import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import backgroundVideo from "../assets/0217.mp4";
import { useNavigate } from "react-router-dom";

export default function ModeSelectScreen() {
  const navigate = useNavigate();

  const Card = ({ title, desc, cta, onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        cursor: "pointer",
        borderRadius: { xs: 3, sm: 2 },
        p: { xs: 2.5, sm: 3.2, md: 3.6 },
        minHeight: { xs: 170, sm: 200, md: 220 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        // ✅ glass style
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.06) 100%)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 22px 70px rgba(0,0,0,0.45)",

        position: "relative",
        overflow: "hidden",
        transform: "translateY(0px)",
        transition: "transform 0.18s ease, border-color 0.18s ease",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(600px 240px at 20% 20%, rgba(140,120,255,0.20), transparent 60%)",
          pointerEvents: "none",
        },
        "&:hover": {
          transform: { xs: "translateY(0px)", md: "translateY(-2px)" },
          borderColor: "rgba(255,255,255,0.22)",
        },
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          sx={{
            fontSize: { xs: 26, sm: 34 },
            fontWeight: 800,
            lineHeight: 1.1,
            mb: 1.2,
            color: "rgba(255,255,255,0.96)",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 14.5, sm: 16 },
            color: "rgba(195, 180, 255, 0.85)",
            lineHeight: 1.6,
            maxWidth: 560,
          }}
        >
          {desc}
        </Typography>
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          mt: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          color: "rgba(255,255,255,0.92)",
        }}
      >
        <Typography sx={{ fontSize: { xs: 18, sm: 22 }, fontWeight: 600 }}>
          {cta}
        </Typography>
        <ArrowForwardRoundedIcon sx={{ fontSize: 26, opacity: 0.95 }} />
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        color: "white",
        backgroundColor: "#000",
      }}
    >
      {/* ✅ Fixed background video */}
      <Box
        component="video"
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        sx={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          backgroundColor: "#000",
        }}
      />

      {/* ✅ Overlay: black top/bottom + gradient middle */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          background: `
            linear-gradient(180deg,
              #000 0%,
              #0000008a 12%,
              rgba(5, 6, 26, 0.38) 22%,
              rgba(11,16,58,0.75) 45%,
              rgba(21,29,68,0.75) 70%,
              rgba(5, 5, 18, 0.53) 82%,
              #0000005d 92%,
              #000 100%
            )
          `,
        }}
      />

      {/* ✅ TOP TITLE */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          textAlign: "center",
          pt: { xs: 2.2, sm: 2.8 },
          pointerEvents: "none",
        }}
      >
        <Typography
          sx={{
            fontWeight: 400,
            letterSpacing: { xs: "0.45em", sm: "0.6em" },
            fontSize: { xs: 22, sm: 26, md: 30 },
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 10px 40px rgba(0,0,0,0.35)",
            userSelect: "none",
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.12))",
          }}
        >
          EDUSign
        </Typography>

        <Typography
          sx={{
            mt: 0.6,
            fontSize: { xs: 12, sm: 13 },
            color: "rgba(255,255,255,0.55)",
            textShadow: "0 10px 30px rgba(0,0,0,0.28)",
            userSelect: "none",
          }}
        >
          Developed By AI
        </Typography>
      </Box>

      {/* ✅ Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          px: { xs: 2, sm: 4 },
          pb: { xs: 2.5, sm: 4 },
          pt: { xs: 10, sm: 12 },
        }}
      >
        {/* ✅ Bottom Cards */}
        <Box
          sx={{
            transform: "translateY(-20px)",
            width: "100%",
            maxWidth: 1320,
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Card
            title="Learning Mode"
            desc="Practice letters step-by-step with real-time AI feedback using your webcam. Improve accuracy and learn at your own pace."
            cta="Start Learning"
            onClick={() => navigate("/learn")}
          />

          <Card
            title="Word Building"
            desc="Test your skills with random letters and scoring. When you sign correctly, the system pauses briefly and moves to the next."
            cta="Start Word Building"
            onClick={() => navigate("/quiz")}
          />
        </Box>

        {/* ✅ Back */}
        <Box sx={{ textAlign: "center", mt: { xs: 2, sm: 3 } }}>
          <Typography
            onClick={() => navigate("/begin")}
            sx={{
              cursor: "pointer",
              display: "inline-block",
              px: 2.2,
              py: 1,
              borderRadius: 2.5,
              color: "rgba(255,255,255,0.75)",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              "&:hover": { background: "rgba(255,255,255,0.10)" },
              userSelect: "none",
            }}
          >
            ← Back
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
