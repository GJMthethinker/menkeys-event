import type { Config } from "tailwindcss";

// Design tokens — voir /lib/design-tokens.md pour la justification de chaque choix.
// Palette héritée du logo Menkeys (lion couronné rouge/blanc sur fond noir).
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0a0a0a",       // fond principal
        surface: "#161514",    // cartes
        "surface-2": "#1e1c1a",// cartes surélevées / éléments actifs
        line: "#2c2a27",       // bordures, séparateurs
        crimson: "#e31b23",    // accent principal (CTA, prix, alertes)
        "crimson-dark": "#9c1015",
        ivory: "#f4f1ea",      // texte principal sur fond sombre
        muted: "#948f86",      // texte secondaire
        gold: "#c9a227",       // VVIP, statut "vérifié", accents premium
      },
      fontFamily: {
        display: ["var(--font-anton)", "sans-serif"], // titres, prix, chiffres clés
        sans: ["var(--font-inter)", "sans-serif"],     // corps de texte, UI
      },
      clipPath: {
        "corner-tr": "polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)",
        "corner-bl": "polygon(0 0, 100% 0, 100% 100%, 22px 100%, 0 calc(100% - 22px))",
      },
    },
  },
  plugins: [],
};

export default config;
