import React from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

const COLORS = {
  deep: "#03045E",
  blue: "#0077B6",
  ink: "#0B1220",
};

const premiumCardSx = {
  borderRadius: 3,
  border: "1px solid rgba(3, 62, 138, 0.10)",
  boxShadow: "0 16px 50px rgba(2,62,138,0.10)",
  background: "#fff",
};

const selectBlackSx = {
  color: "#0B1220",
  "& .MuiSelect-select": { color: "#0B1220" },
  "& .MuiSvgIcon-root": { color: "rgba(11,18,32,0.75)" },
  "& fieldset": { borderColor: "rgba(3, 62, 138, 0.18)" },
  "&:hover fieldset": { borderColor: "rgba(3, 62, 138, 0.30)" },
  "&.Mui-focused fieldset": { borderColor: "rgba(3, 62, 138, 0.45)" },
};

const menuPaperProps = {
  PaperProps: {
    sx: {
      borderRadius: 2,
      mt: 1,
      border: "1px solid rgba(3,62,138,0.10)",
      boxShadow: "0 18px 60px rgba(2,62,138,0.14)",
      "& .MuiMenuItem-root": { color: "#0B1220" },
    },
  },
};

function getGestureImage(letter) {
  return new URL(`../../assets/gestures/${letter}.png`, import.meta.url).href;
}

export default function LearningRightPanel({ letter, setLetter, letters, currentStats }) {
  return (
    <Stack spacing={2.5} sx={{ position: { md: "sticky" }, top: { md: 18 } }}>
      {/* Select */}
      <Card sx={premiumCardSx}>
        <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
          <Typography sx={{ fontWeight: 950, color: COLORS.ink, mb: 1.5 }}>
            Select Letter
          </Typography>

          <FormControl fullWidth>
            <Select
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              sx={selectBlackSx}
              MenuProps={menuPaperProps}
            >
              {letters.map((L) => (
                <MenuItem key={L} value={L} sx={{ color: "#0B1220" }}>
                  {L}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              mt: 2,
              borderRadius: 3,
              p: 2,
              textAlign: "center",
              background: "linear-gradient(180deg, rgba(0,119,182,0.10), rgba(0,180,216,0.06))",
              border: "1px solid rgba(0,119,182,0.14)",
            }}
          >
            <Typography sx={{ color: "rgba(11,18,32,0.65)", fontSize: 13 }}>
              Practice this letter:
            </Typography>
            <Typography sx={{ mt: 0.4, fontSize: 58, fontWeight: 950, color: COLORS.deep }}>
              {letter}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Reference image */}
      <Card sx={premiumCardSx}>
        <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
          <Typography sx={{ fontWeight: 950, color: COLORS.ink }}>
            How to sign “{letter}”
          </Typography>
          <Typography sx={{ mt: 0.5, color: "rgba(11,18,32,0.65)", fontSize: 13 }}>
            Match the hand shape shown below
          </Typography>

          <Box
            sx={{
              mt: 1.6,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid rgba(3,62,138,0.10)",
              background: "#fff",
              display: "grid",
              placeItems: "center",
              p: 1.5,
            }}
          >
            <img
              src={getGestureImage(letter)}
              alt={`ASL ${letter}`}
              style={{
                width: "100%",
                maxWidth: 260,
                height: "auto",
                borderRadius: 14,
                display: "block",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <Typography sx={{ mt: 1, fontSize: 12.5, color: "rgba(11,18,32,0.55)" }}>
              (Add image at: src/assets/gestures/{letter}.png)
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card sx={premiumCardSx}>
        <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
          <Typography sx={{ fontWeight: 950, color: COLORS.ink, mb: 1.5 }}>
            Stats (Letter {letter})
          </Typography>

          <Grid container spacing={1.5}>
            <Grid item xs={4}>
              <Box
                sx={{
                  borderRadius: 3,
                  p: 1.4,
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "rgba(11,18,32,0.60)" }}>
                  Attempts
                </Typography>
                <Typography sx={{ fontWeight: 950, fontSize: 22, color: COLORS.ink }}>
                  {currentStats.attempts}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  borderRadius: 3,
                  p: 1.4,
                  background: "rgba(10,166,71,0.08)",
                  border: "1px solid rgba(10,166,71,0.12)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "rgba(11,18,32,0.60)" }}>
                  Correct
                </Typography>
                <Typography sx={{ fontWeight: 950, fontSize: 22, color: "#0aa647" }}>
                  {currentStats.correct}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  borderRadius: 3,
                  p: 1.4,
                  background: "rgba(0,119,182,0.08)",
                  border: "1px solid rgba(0,119,182,0.12)",
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "rgba(11,18,32,0.60)" }}>
                  Accuracy
                </Typography>
                <Typography sx={{ fontWeight: 950, fontSize: 22, color: COLORS.blue }}>
                  {currentStats.accuracy}%
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}
