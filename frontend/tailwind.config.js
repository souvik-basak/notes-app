/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // color in the project
      colors: {
        primary: "#3B82F6",
        secondary: "#F59E0B",
        danger: "#F44336",
      },
    },
  },
  plugins: [],
};
