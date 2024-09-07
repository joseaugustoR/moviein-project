/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    fontFamily: {
      sans: ["Poppins", "Inter", "Arial", "sans-serif"]
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        card: "hsl(var(--card))",
        background: "hsl(var(--background))",
        text: "hsl(var(--text))",

        primary: "hsl(var(--primary))",
        redPalid: "hsl(var(--redPalid))",
        red: "hsl(var(--red))",
        dark: "hsl(var(--dark))",

        success: "hsl(var(--status-success))",
        info: "hsl(var(--status-info))",
        warning: "hsl(var(--status-warning))",
        orange: "hsl(var(--status-orange))"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}