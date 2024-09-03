/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      colors: {
        primary: "#6C1EEB",
        hover: "#3944BC",
        para:"#2C2C2C",
        text:"#151515"
      },
    },
  },

  plugins: [],
});
