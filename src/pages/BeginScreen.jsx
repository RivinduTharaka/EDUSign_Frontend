import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageShell, { COLORS } from "../components/PageShell.jsx";
import { primaryBtnSx } from "../components/ui";

export default function BeginScreen() {
  const navigate = useNavigate();

  return (
    <PageShell maxWidth="lg">
      <Box
        sx={{
          position: "relative",
          minHeight: "calc(100vh - 80px)",
          display: "grid",
          placeItems: "center",
          px: { xs: 1.5, sm: 2.5, md: 3 },
          py: { xs: 3, sm: 4, md: 5 },
        }}
      >
        {/* ✅ FULL PAGE BACKGROUND BOX */}
        <Box
          sx={{
            position: "absolute",
            inset: { xs: 10, sm: 14, md: 18 },
            borderRadius: { xs: "26px", sm: "34px", md: "44px" },
            overflow: "hidden",
            background: `linear-gradient(180deg, ${COLORS.snow}55, ${COLORS.mist}25)`,
            border: `1px solid rgba(3, 62, 138, 0.10)`,
            boxShadow: "0 30px 80px rgba(3, 62, 138, 0.10)",
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -120,
              left: -120,
              width: { xs: 260, sm: 340, md: 460 },
              height: { xs: 260, sm: 340, md: 460 },
              borderRadius: "50%",
              background: `${COLORS.ice}55`,
              filter: "blur(45px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(0deg, rgba(3,4,94,0.10), transparent 70%)`,
            }}
          />
        </Box>

        {/* ---- Background character placeholder (behind text) ---- */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              background: `linear-gradient(180deg, ${COLORS.snow}55, ${COLORS.mist}25)`,
              border: `1px solid rgba(3, 62, 138, 0.10)`,
              boxShadow: "0 30px 80px rgba(3, 62, 138, 0.10)",
              animation: "floaty 3.2s ease-in-out infinite",
              opacity: { xs: 0.6, sm: 0.75, md: 0.85 },
            }}
          >
            {/* head */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 22, md: 34 },
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: 78, sm: 92, md: 110 },
                height: { xs: 78, sm: 92, md: 110 },
                borderRadius: "50%",
                background: `${COLORS.mist}AA`,
                border: `1px solid rgba(3, 62, 138, 0.08)`,
              }}
            />

            {/* body */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 120, sm: 150, md: 180 },
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: 170, sm: 220, md: 290 },
                height: { xs: 185, sm: 240, md: 330 },
                borderRadius: "64px",
                background: `${COLORS.ice}66`,
                border: `1px solid rgba(3, 62, 138, 0.08)`,
              }}
            />

            {/* shoulders */}
            <Box
              sx={{
                position: "absolute",
                top: { xs: 145, sm: 180, md: 220 },
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: 220, sm: 280, md: 330 },
                height: { xs: 70, sm: 95, md: 110 },
                borderRadius: "999px",
                background: `${COLORS.snow}55`,
              }}
            />

            {/* bottom shadow */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(0deg, rgba(3,4,94,0.18), transparent 65%)`,
              }}
            />
          </Box>
        </Box>

        {/* ---- Foreground content ---- */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            width: "100%",
            maxWidth: 980,
            animation: "fadeUp 0.85s ease-out both",
            px: { xs: 1, sm: 2 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              letterSpacing: { xs: "0.10em", sm: "0.16em", md: "0.20em" },
              fontSize: { xs: 52, sm: 86, md: 130, lg: 150 },
              lineHeight: { xs: 0.95, md: 0.9 },
              color: COLORS.deep,
              opacity: 0.92,
              userSelect: "none",
              wordBreak: "break-word",
            }}
          >
            EDUSign
          </Typography>

          <Typography
            sx={{
              mt: { xs: 2.5, sm: 4, md: 5 },
              mx: "auto",
              maxWidth: 760,
              fontSize: { xs: 13, sm: 15, md: 16.5 },
              lineHeight: 1.7,
              color: "rgba(11,18,32,0.68)",
              textShadow: "0 14px 40px rgba(255,255,255,0.65)",
            }}
          >
            Learn sign language with your webcam and AI. Practice signs, get real-time feedback,
            and improve step-by-step in a fun way.
          </Typography>

          {/* ✅ CHANGED HERE */}
          <Button
            onClick={() => navigate("/mode")}
            sx={{
              mt: { xs: 3, sm: 3.5 },
              width: { xs: "92%", sm: 260 },
              maxWidth: 320,
              ...primaryBtnSx,
              background: COLORS.deep,
            }}
          >
            Let’s begin
          </Button>
        </Box>

        <style>{`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(12px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes floaty {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </Box>
    </PageShell>
  );
}
