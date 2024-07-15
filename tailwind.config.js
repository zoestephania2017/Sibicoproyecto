/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.php",
    "./dashboard/**/*.php",
    "./error/*.php",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        emerald: {
          500: "#10b981",
        },
        gray: {
          500: "#6b7280",
        },
        blue: {
          500: "#3b82f6",
        },
        yellow: {
          500: "#f59e0b",
        },
        orange: {
          500: "#f97316",
        },
        red: {
          500: "#ef4444",
        },
        purple: {
          500: "#8b5cf6",
        },
        rose: {
          500: "#ec4899",
        },
      },
      height: {
        map: "45rem",
      }
    },
  },
  plugins: [],
}