/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#05299e",
        primary: "#1c2536",
        secondary: "#070d0d",
        kush: "#893773",
        accent: "#184eb4",
        "card-bg": "#f8f8f8",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // sans becomes default app font
        rubik: ["Rubik", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
    },
  },
  plugins: [],
};
