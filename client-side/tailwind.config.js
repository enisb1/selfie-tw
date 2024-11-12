/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/*.html",
    "./script/*.js",
    "./src/views/*.vue",
    "./src/App.vue",
    "./src/components/*.vue",
    "./src/components/Calendar/*.vue",
    "./src/components/Calendar/Daily/*.vue",
    "./src/components/Notifications/*.vue",
    "./src/components/Notes/*.vue"

  ],
  theme: {
    extend: { 
      colors:{
        primary: '#dddbf1',
        secondary: '#383f51', //charcoal
        third: '#3C4F76', //ylblue
        fourth: '#dddbf1', //lavender
      },
    },
  },
  plugins: [],
}

