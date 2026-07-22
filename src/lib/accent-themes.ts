export type AccentThemeKey = "violet" | "or" | "orange" | "emeraude" | "rouge" | "bleu";

export interface AccentTheme {
  key: AccentThemeKey;
  label: string;
  from: string;
  via: string;
  to: string;
  solid: string;
  soft: string;
}

export const ACCENT_THEMES: Record<AccentThemeKey, AccentTheme> = {
  violet: {
    key: "violet",
    label: "Violet (par défaut)",
    from: "#6D28D9",
    via: "#A855F7",
    to: "#EC4899",
    solid: "#8B5CF6",
    soft: "rgba(139,92,246,0.12)",
  },
  or: {
    key: "or",
    label: "Or",
    from: "#5C4308",
    via: "#C9A24C",
    to: "#F5C76A",
    solid: "#C9A24C",
    soft: "rgba(201,162,76,0.14)",
  },
  orange: {
    key: "orange",
    label: "Orange",
    from: "#9A3412",
    via: "#FF6B35",
    to: "#FF8C42",
    solid: "#FF6B35",
    soft: "rgba(255,107,53,0.14)",
  },
  emeraude: {
    key: "emeraude",
    label: "Émeraude",
    from: "#065F46",
    via: "#10B981",
    to: "#34D399",
    solid: "#10B981",
    soft: "rgba(16,185,129,0.14)",
  },
  rouge: {
    key: "rouge",
    label: "Rouge",
    from: "#7F1D1D",
    via: "#DC2626",
    to: "#F87171",
    solid: "#DC2626",
    soft: "rgba(220,38,38,0.14)",
  },
  bleu: {
    key: "bleu",
    label: "Bleu",
    from: "#1E3A8A",
    via: "#2563EB",
    to: "#60A5FA",
    solid: "#2563EB",
    soft: "rgba(37,99,235,0.14)",
  },
};

export const ACCENT_THEME_OPTIONS = Object.values(ACCENT_THEMES);

export function getAccentTheme(key: string | null | undefined): AccentTheme {
  return (key && ACCENT_THEMES[key as AccentThemeKey]) || ACCENT_THEMES.violet;
}
