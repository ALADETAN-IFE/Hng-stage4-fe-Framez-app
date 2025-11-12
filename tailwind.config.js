/** @type {import('tailwindcss').Config} */
module.exports = {

  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        framez: {
          midnight: "#050E1A",
          nightfall: "#0B1423",
          slate: "#1C2836",
          sky: "#59B2D9",
          accent: "#F6A33D",
          mist: "#94A3B8",
        },
      },
    },
  },
  plugins: [],
}