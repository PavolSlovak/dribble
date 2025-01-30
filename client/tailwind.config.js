/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pastelGreen: "#DBEFBC",
        pastelOrange: "#DBAD6A",
        pastelRed: "#ED9390",
        pastelDark: "#023436",
        pastelYellow: "#F4D35E",
        lightGray: "#c9c5cb",
        darkGray: "#8b94a3",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        mono: ["Alata", "monospace"],
      },
      container: {
        screens: {
          sm: "100%",
          md: "100%",
          xl: "1200px",
        },
      },
    },
  },

  plugins: [],
};
