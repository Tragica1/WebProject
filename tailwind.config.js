/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/*.html",
    "./static/css/*.css",
    "./static/js/*.js"
  ],
  theme: {
    extend: {
      height: {
        'custom': '760px',
        'custom-2': '825px',
      }
    },
  },
  plugins: [],
}

