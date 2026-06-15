/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          dark: "#1a1a2e",
          DEFAULT: "#16213e",
          light: "#0f3460",
        },
        accent: {
          DEFAULT: "#e94560",
          muted: "#533483",
        },
      },
    },
  },
  plugins: [],
};
