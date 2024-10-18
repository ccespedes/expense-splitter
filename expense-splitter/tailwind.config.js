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
        "card-bg": "#f4f4f4",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // sans becomes default app font
        rubik: ["Rubik", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
