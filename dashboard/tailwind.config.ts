import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#FAFAF9",
          subtle: "#F5F5F3",
          muted: "#EEEDE9",
          inverse: "#1C1917",
        },
        fg: {
          DEFAULT: "#1C1917",
          secondary: "#78716C",
          tertiary: "#A8A29E",
          inverse: "#FAFAF9",
        },
        accent: {
          DEFAULT: "#2563EB",
          subtle: "rgba(37, 99, 235, 0.08)",
          muted: "rgba(37, 99, 235, 0.15)",
          solid: "#2563EB",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          raised: "#FFFFFF",
          overlay: "rgba(255, 255, 255, 0.85)",
        },
        border: {
          DEFAULT: "rgba(28, 25, 23, 0.06)",
          subtle: "rgba(28, 25, 23, 0.03)",
          strong: "rgba(28, 25, 23, 0.12)",
        },
        status: {
          idle: "#D6D3D1",
          active: "#2563EB",
          done: "#059669",
          warn: "#D97706",
          critical: "#DC2626",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "-apple-system",
          "system-ui",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "SF Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
        xs: ["0.6875rem", { lineHeight: "1rem" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.875rem", { lineHeight: "1.375rem" }],
        lg: ["1rem", { lineHeight: "1.5rem" }],
        xl: ["1.125rem", { lineHeight: "1.625rem" }],
        "2xl": ["1.375rem", { lineHeight: "1.75rem" }],
        "3xl": ["1.75rem", { lineHeight: "2.125rem" }],
      },
      letterSpacing: {
        tight: "-0.02em",
        tighter: "-0.03em",
        display: "-0.04em",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "6px",
        lg: "12px",
        xl: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)",
        "card-hover":
          "0 4px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        float: "0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
