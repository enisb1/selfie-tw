/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", 
    "./js/daily-calendar.js",
    "./js/weekly-calendar.js"],
  theme: {
    extend: {
      colors:{
        primary: '#dddbf1',
        secondary: '383f51',
      },
    },
  },
  plugins: [],
}

