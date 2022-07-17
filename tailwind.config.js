/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadein: 'fadein 200ms ease-in-out forwards',
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      colors: {
        'accent-primary-100': '#3B82F6',
        'accent-primary-200': '#2563EB',
        'accent-secondary-100': '#EF4444',
        'accent-secondary-200': '#DC2626'

      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
