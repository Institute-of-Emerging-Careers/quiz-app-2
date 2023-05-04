const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./**/*.html", "./**/*.js", "./**/*.ejs"],
  theme: {
    extend: {
      colors: {
        "iec-blue": "#2A6095",
        "iec-blue-hover": "#306aa5",
        green: colors.emerald,
        yellow: colors.amber,
        purple: colors.violet,
        gray: colors.neutral,
      },
      left: {
        "1/8": "12.5%",
      },
      width: {
        "1/8": "12.5%",
        "2/8": "25%",
        "6/8": "75%",
        "7/8": "87.5%",
      },
      height: {
        "90vh": "90vh",
        "80vh": "80vh",
      },
      dropShadow: {
        gradient: "0 15px 15px rgba(72,8,94,0.5)",
        little: "0 3px 3px rgba(72,8,94,0.5)",
        none: "0 0 0",
      },
      maxWidth: {
        my1: "200px",
      },
      inset: {
        my1: "55%",
        "25/2": "12.5%",
      },
      // that is animation class
      animation: {
        fade: 'fadeIn 1s ease-linear',
      },

      // that is actual animation
      keyframes: theme => ({
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1},
        },

      }),
    },
  },
  fontFamily: {
    body: ["Roboto", "sans-serif"],
  },
  plugins: [],
};
