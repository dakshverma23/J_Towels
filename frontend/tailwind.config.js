/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Jost", "system-ui", "sans-serif"]
      },
      colors: {
        ven: {
          cream: "#f7f4ef",
          sand: "#ebe6de",
          ink: "#1a1a1a",
          muted: "#6b6560",
          accent: "#8b7355",
          line: "#d4cec4"
        }
      },
      letterSpacing: {
        widest2: "0.35em"
      },
      transitionTimingFunction: {
        ven: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};
