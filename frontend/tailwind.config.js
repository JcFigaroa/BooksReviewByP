/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cozy reading-nook palette built from three core colors:
        // cream paper #FEFAF3 (frost), burgundy #790D16 (berry), forest green #124D1C (pine)
        frost: {
          50: "#fefaf3",
          100: "#f9f1e3",
          200: "#efe3cf",
          300: "#e0cfb4",
          400: "#c4ae8e",
        },
        ink: {
          400: "#8d817a",
          500: "#6d615b",
          700: "#463b37",
          900: "#2a201e",
        },
        pine: {
          50: "#edf4ee",
          100: "#d4e5d7",
          500: "#2c6a37",
          600: "#124d1c",
          700: "#0c3913",
        },
        // Warm accent: soft burgundy tints for chips and highlights
        ember: {
          50: "#fbf0ec",
          100: "#f3dcd6",
          400: "#c27a7c",
          500: "#a2454b",
          700: "#790d16",
        },
        berry: {
          50: "#fbeeee",
          100: "#f2d4d6",
          600: "#790d16",
          700: "#5c0910",
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Nunito"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        cozy: "0 1px 2px rgba(42, 32, 30, 0.04), 0 8px 24px -12px rgba(42, 32, 30, 0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 220ms ease-out both",
      },
    },
  },
  plugins: [],
};
