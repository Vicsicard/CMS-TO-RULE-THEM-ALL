/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'selfcast-primary': '#0047AB',    // SelfCast primary blue
        'selfcast-secondary': '#6B8E23',  // SelfCast secondary green
        'selfcast-accent': '#FF8C00',     // SelfCast accent orange
        'selfcast-dark': '#202020',       // SelfCast dark gray
        'selfcast-light': '#F5F5F5',      // SelfCast light gray
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
