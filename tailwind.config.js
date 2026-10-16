/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#09080e",
          surface: "#0f0d18",
          card: "rgba(18, 15, 28, 0.7)",
          cardHover: "rgba(28, 22, 46, 0.85)",
          deep: "#240046",
          dark: "#3c096c",
          electric: "#7b2cbf",
          neon: "#9d4edd",
          bright: "#c77dff",
          glow: "#e0aaff",
        },
      },
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(157, 78, 221, 0.25)",
        glowLg: "0 0 50px rgba(199, 125, 255, 0.4)",
      },
    },
  },
  plugins: [],
}
