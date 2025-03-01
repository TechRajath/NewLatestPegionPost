/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fingerPaint: ['"Finger Paint"', "Finger Paint"],
        lato: ["Lato", "sans-serif"],
        "dm-sans": ['"DM Sans"', "sans-serif"],
      },

      fontSize: {
        "4xl-custom": ["3rem", "1.2"], // Responsive size for logo
        //"2xl-custom": ["1.5rem", "1.2"], // Responsive size for button
      },
      theme: {
        screens: {
          xs: "375px",
          // other breakpoints...
        },
      },
    },
  },
  plugins: [],
};
