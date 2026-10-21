/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07080d",
        surface: "#0d0f17",
        surface2: "#141724",
        line: "rgba(255,255,255,0.08)",
        ink: "#eef0f7",
        muted: "#8d92a8",
        violet: "#b18cff",
        indigo: "#6e78ff",
        ok: "#4ade80",
        warn: "#fbbf24",
        err: "#f87171",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ['"Geist"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        orbit: {
          "0%": { transform: "rotate(calc(var(--angle, 0) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle, 0) * -1deg))" },
          "100%": { transform: "rotate(calc(var(--angle, 0) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle, 0) * -1deg) - 360deg))" },
        },
        "border-beam": { "100%": { "offset-distance": "100%" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        pulsedot: { "50%": { opacity: "0.25" } },
      },
      animation: {
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
        "border-beam": "border-beam calc(var(--duration) * 1s) infinite linear",
        marquee: "marquee 38s linear infinite",
        pulsedot: "pulsedot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
