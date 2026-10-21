/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Winter cozy palette: frosted window, deep night ink, pine, and candlelight
        frost: {
          50: "#f7f9fc",
          100: "#edf2f7",
          200: "#dbe4ee",
          300: "#c2d0de",
          400: "#9fb2c6",
        },
        ink: {
          400: "#7b8a9c",
          500: "#5f6f82",
          700: "#3a4859",
          900: "#1f2a37",
        },
        pine: {
          50: "#eef5f1",
          100: "#dcebe3",
          500: "#4f7d6c",
          600: "#3f6b5c",
          700: "#2f5447",
        },
        ember: {
          50: "#fbf3ec",
          100: "#f5e4d4",
          400: "#d49a6a",
          500: "#c4834f",
          700: "#8a5a35",
        },
        berry: {
          50: "#f9eceb",
          100: "#f1d5d3",
          600: "#a3504c",
          700: "#86403d",
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Nunito"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        cozy: "0 1px 2px rgba(31, 42, 55, 0.04), 0 8px 24px -12px rgba(31, 42, 55, 0.18)",
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
