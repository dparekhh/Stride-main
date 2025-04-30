/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF5704', // Brand orange
          dark: '#E64E03', // Slightly darker orange for hover/active states
          light: '#FF7033', // Slightly lighter orange for highlights
        },
        // Secondary colors for UI states (notifications, buttons, etc.)
        success: '#10B981', // Green for success notifications, approval buttons
        error: '#EF4444', // Red for error notifications, reject buttons
        warning: '#F59E0B', // Yellow for warnings, draft/in review states
        info: '#3B82F6', // Blue for info notifications
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}