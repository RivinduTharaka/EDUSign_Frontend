import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1e88e5" },     // light blue
    secondary: { main: "#0d47a1" },   // dark blue
    background: {
      default: "#050814",            // near black
      paper: "rgba(10, 18, 40, 0.65)"
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.75)"
    }
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
    h1: { fontWeight: 900, letterSpacing: "0.25em" },
    h2: { fontWeight: 800 },
    button: { textTransform: "none", fontWeight: 700 }
  },
});
