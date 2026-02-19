import React from "react";
import { Box, Container } from "@mui/material";

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

export default function PageShell({ children, maxWidth = "lg" }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${COLORS.snow} 0%, #EEF6FF 45%, ${COLORS.mist} 140%)`,
        py: { xs: 4, sm: 5 },
      }}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
}

export { COLORS };
