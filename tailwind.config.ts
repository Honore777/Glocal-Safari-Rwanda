import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F4EFE6",
        cream: "#F7F1E3",
        safari: {
          green: "#1F382B",
          "green-light": "#2E5240",
        },
        golden: {
          light: "#F2C14E",
          mid: "#D99A1C",
          dark: "#B8730F",
          deep: "#8A5208",
        },
        sunset: {
          orange: "#E8821E",
          amber: "#D4900A",
          glow: "#FFD27D",
        },
        charcoal: {
          DEFAULT: "#2A1F14",
          light: "#3D2E1A",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["var(--font-sans)", "Inter", "Plus Jakarta Sans", "sans-serif"],
      },
      backgroundImage: {
        "golden-gradient": "linear-gradient(135deg, #F2C14E 0%, #D99A1C 45%, #B8730F 100%)",
        "sunset-gradient": "linear-gradient(180deg, #FFD27D 0%, #E8821E 50%, #B8730F 100%)",
        "hero-overlay": "linear-gradient(to top, rgba(42,31,20,0.85) 0%, rgba(42,31,20,0.25) 45%, rgba(42,31,20,0.45) 100%)",
        "card-gold": "linear-gradient(160deg, #E8A21C 0%, #C17F1A 60%, #8A5208 100%)",
      },
      boxShadow: {
        gold: "0 10px 40px -10px rgba(184,115,15,0.5)",
        "gold-lg": "0 20px 60px -15px rgba(184,115,15,0.6)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.12)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 1.2s ease-in-out",
        "ken-burns": "ken-burns 8s ease-out forwards",
        "fade-up": "fade-up 0.9s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
