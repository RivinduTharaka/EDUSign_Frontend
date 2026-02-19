import { COLORS } from "./PageShell";

export const cardSx = {
  borderRadius: 3,
  background: "#fff",
  border: `1px solid rgba(3,4,94,0.08)`,
  boxShadow: "0 10px 26px rgba(3, 62, 138, 0.08)",
};

export const primaryBtnSx = {
  borderRadius: 2,
  py: 1.2,
  fontWeight: 800,
  textTransform: "none",
  background: COLORS.deep,
  "&:hover": { background: COLORS.navy },
};

export const softBtnSx = {
  borderRadius: 2,
  py: 1.2,
  fontWeight: 800,
  textTransform: "none",
  background: "rgba(3,62,138,0.06)",
  border: "1px solid rgba(3,62,138,0.16)",
  color: COLORS.navy,
  "&:hover": { background: "rgba(3,62,138,0.10)" },
};
