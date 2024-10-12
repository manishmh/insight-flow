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
        "ssm": "300px",
        "sm": "480px",
        "2xl": "1400px",
        "3xl" : "1600px",
        "4xl" : "1750px",
      },
      colors: {
        primary: {
          blue_button: "rgb(71, 82, 196)"
        },
        secondary: {

        }
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      }, 
    },
  },
  plugins: [require("tailwindcss-animate", '@tailwindcss/line-clamp')],
}