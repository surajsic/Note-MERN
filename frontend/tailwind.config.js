/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //Colours used in the object
      colors:{
        primary:"#2B85ff",
        secondary:"#EF863E",
      },
    },
  },
  plugins: [],
}