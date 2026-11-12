// ============================================================
// REPOGUARD — MANUAL REVIEW REQUIRED: tailwind.config.js
// Scanned: 2026-11-12T18:30:16.774Z
// The following findings could NOT be automatically patched:
//   [CRITICAL] js-obfuscated-hex: JavaScript hex/unicode escape obfuscation sequence
//   [MEDIUM] high-entropy-secret: High-entropy string detected — possible hardcoded credential or API key
// ============================================================

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
};
// REMOVED BY REPOGUARD: obfuscated malware payload
