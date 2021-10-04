module.exports = {
  purge: true,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "iec-blue": "#2A6095",
        "iec-blue-hover": "#306aa5",
      },
      left: {
        "1/8": "12.5%",
      },
    },
  },
  fontFamily: {
    body: ["Roboto", "sans-serif"],
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      backgroundOpacity: ["focus"],
    },
  },
  plugins: [],
};
