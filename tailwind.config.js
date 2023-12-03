/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      screens: {
        sm: "480px",
        "2xl": "1400px",
      },
      colors: {
        primary: {
          blue_button: "rgb(71, 82, 196)"
          
        },
        secondary: {

        }
      },
      borderRadius: {
      },
      keyframes: {
      },
      animation: {
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}