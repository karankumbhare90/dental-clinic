import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'
import containerQueries from '@tailwindcss/container-queries'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f6d75",
        "primary-dark": "#0a4f55",
        "primary-light": "#e0f2f3",
        "accent-coral": "#ff7f50",
        "accent-coral-dark": "#e66a3c",
        "secondary-mint": "#e0f2f1",
        "secondary-blue": "#e3f2fd",
        "background-light": "#f6f8f8",
        "background-dark": "#112021",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [
    forms,
    typography,
    containerQueries,
  ],
};
