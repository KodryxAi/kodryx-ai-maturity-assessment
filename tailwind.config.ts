import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "kx-navy": "#0E2A3A",
        "kx-gold": "#C9A24D",
        "kx-grey": "#6B7280",
        "kx-grey-50": "#F7F8FA",
        "kx-grey-100": "#EEF0F3",
        "kx-grey-200": "#D8DCE2",
      },
      borderRadius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
