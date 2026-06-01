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
          cream: "#eef7ff",
          sand: "#dbeafe",
          ink: "#071833",
          muted: "#4b6386",
          accent: "#2563eb",
          line: "rgba(37, 99, 235, 0.16)"
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
