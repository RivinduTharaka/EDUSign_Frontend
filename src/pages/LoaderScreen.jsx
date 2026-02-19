import React from "react";
import { Box, Typography } from "@mui/material";
import PanToolRoundedIcon from "@mui/icons-material/PanToolRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

const COLORS = {
  deep: "#03045E",
  navy: "#023E8A",
  blue: "#0077B6",
  sky: "#0096C7",
  cyan: "#00B4D8",
  aqua: "#48CAE4",
  ice: "#90E0EF",
  mist: "#ADE8F4",
  snow: "#CAF0F8",
};

export default function LoaderScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg,
          ${COLORS.deep} 0%,
          ${COLORS.navy} 18%,
          ${COLORS.blue} 42%,
          ${COLORS.sky} 62%,
          ${COLORS.ice} 120%
        )`,
      }}
    >
      {/* Soft glow blobs (only from your palette) */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <Box
          sx={{
            position: "absolute",
            top: -160,
            left: -160,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: `${COLORS.cyan}33`,
            filter: "blur(90px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -260,
            right: -260,
            width: 760,
            height: 760,
            borderRadius: "50%",
            background: `${COLORS.aqua}2E`,
            filter: "blur(110px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "38%",
            left: "58%",
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: `${COLORS.mist}22`,
            filter: "blur(120px)",
          }}
        />
      </Box>

      {/* Center content */}
      <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Icon card */}
        <Box
          sx={{
            width: 96,
            height: 96,
            mx: "auto",
            borderRadius: "28px",
            display: "grid",
            placeItems: "center",
            position: "relative",
            background: `linear-gradient(180deg, ${COLORS.snow}22, ${COLORS.mist}12)`,
            border: `1px solid ${COLORS.snow}33`,
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 70px rgba(0,0,0,0.25)",
            animation: "floaty 2.8s ease-in-out infinite",
          }}
        >
          {/* glow ring */}
          <Box
            sx={{
              position: "absolute",
              inset: -14,
              borderRadius: "34px",
              background: `radial-gradient(circle at 30% 30%, ${COLORS.snow}55, transparent 60%)`,
              filter: "blur(12px)",
              opacity: 0.95,
              animation: "pulseGlow 1.6s ease-in-out infinite",
            }}
          />

          {/* Sign icon (hand + eye) */}
          <Box sx={{ position: "relative" }}>
            <PanToolRoundedIcon
              sx={{
                fontSize: 44,
                color: COLORS.snow,
                filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
              }}
            />
            <VisibilityRoundedIcon
              sx={{
                fontSize: 22,
                position: "absolute",
                bottom: -6,
                right: -12,
                color: COLORS.snow,
                opacity: 0.95,
                filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
              }}
            />
          </Box>
        </Box>

        {/* Text */}
        <Typography
          sx={{
            mt: 2.5,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.06em",
            color: COLORS.snow,
            textShadow: "0 18px 50px rgba(0,0,0,0.35)",
          }}
        >
          Loading
        </Typography>

        {/* animated dots */}
        <Typography
          sx={{
            mt: 0.7,
            fontSize: 13,
            letterSpacing: "0.08em",
            color: `${COLORS.snow}B3`,
          }}
        >
          <span className="dots">Please wait</span>
        </Typography>
      </Box>

      {/* Animations */}
      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        .dots::after {
          content: "";
          display: inline-block;
          width: 28px;
          text-align: left;
          animation: dots 1.2s steps(4, end) infinite;
        }

        @keyframes dots {
          0% { content: ""; }
          25% { content: "."; }
          50% { content: ".."; }
          75% { content: "..."; }
          100% { content: ""; }
        }
      `}</style>
    </Box>
  );
}
