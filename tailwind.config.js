/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emergency-blue': '#0F172A',
        'emergency-card': '#1E293B',
        'emergency-card-hover': '#2D3748',
        'emergency-accent-blue': '#3B82F6',
        'emergency-orange': '#F97316',
        'emergency-red': '#EF4444',
        'emergency-green': '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
