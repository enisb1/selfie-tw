/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/*.html",
    "./public/*.js",
    "./pages/*.html",
    "./script/*.js",
    "./src/views/*.vue",
    "./src/App.vue",
    "./src/components/*.vue",
    "./src/components/Calendar/*.vue",
    "./src/components/Calendar/Daily/*.vue",
    "./src/components/Calendar/Weekly/*.vue",
    "./src/components/Calendar/Weekly/*.js",
    "./src/components/Calendar/Monthly/*.vue",
    "./src/components/Calendar/Monthly/*.js",
    "./src/components/Notifications/*.vue",
    "./src/components/Notes/*.vue",
    "./src/components/Chat/*.vue",
  ],
  theme: {
    extend: { 
      backgroundImage:{
          'prova':"url(../images/stanzagif.gif)",
      },
      colors:{
        primary: '#dddbf1',
        secondary: '#383f51', //charcoal
        third: '#3C4F76', //ylblue
        fourth: '#dddbf1', //lavender
        fifth: '#D1BEB0', //dune
        sixth: '#AB9F9D', //rose quartz
        seventh: '#cbbeb5',//
        eighth: '#ddb39b',//
      },
      maxHeight: {
        '3/5': '60vh', // 3/5 of the viewport height (used in modal projects)
        '4/5': '80vh', // 4/5 of the viewport height (used in modal vue)
      },
    },
  },
  plugins: [],
}

