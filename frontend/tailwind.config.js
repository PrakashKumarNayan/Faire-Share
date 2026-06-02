// import {nextui} from '@nextui-org/react'
const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorLevel1: '#02161C', // Replace with your desired color   #00df9a  #302E3B
        colorLevel2: '#243C39',
        colorLevel3: '#FFFFFF',
        colorLevel4: '#323421',
        colorLevel5: '#8D8B6A',
      }
    },
    

    fontFamily:{
      myFont: ["Vollkorn"]
    }
  },
  darkMode: "class",
  plugins: [nextui()],
}

