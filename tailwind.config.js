/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/*.html",
    "./script/*.js",
    "./src/App.vue"
  ],
  theme: {
    extend: {
      colors:{
        primary: '#dddbf1',
        secondary: '#383f51', //charcoal
        third: '#3C4F76',
        dun:{
          500: '#D1BEB0',
        },
        ylblue:{
          500: '#3C4F76',
        },
        charcoal:{
          500: '#383F51',
        },
        lavender:{
          500: '#DDDBF1',
        },
      },
    },
  },
  plugins: [],
}

