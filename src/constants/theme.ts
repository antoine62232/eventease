const colors = {
  primary: "#2563EB",
  primaryText: "#FFFFFF",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  success: "#16A34A",
  danger: "#DC2626",
} as const;

// Échelle d'espacements
const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

const radius = { sm: 6, md: 12, lg: 20 } as const;

const fontSize = { sm: 13, md: 16, lg: 20, xl: 28 } as const;

export const theme = { colors, spacing, radius, fontSize } as const;

export type Theme = typeof theme;