/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark Theme Palette
        primary: {
          500: '#3B82F6', // Blue-500
          600: '#2563EB', // Blue-600
        },
        dark: {
          900: '#0F172A', // Slate-900 (Main Background)
          800: '#1E293B', // Slate-800 (Card Background)
          700: '#334155', // Slate-700 (Border/Hover)
          600: '#475569', // Slate-600 (Lighter Hover)
        },
        surface: {
          glass: 'rgba(30, 41, 59, 0.7)', // Glassmorphism
          highlight: 'rgba(255, 255, 255, 0.05)',
        },
        status: {
          success: '#10B981', // Emerald-500
          warning: '#F59E0B', // Amber-500
          danger: '#EF4444', // Red-500
          info: '#3B82F6', // Blue-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-blue': '0 0 10px rgba(59, 130, 246, 0.5)',
        'neon-red': '0 0 10px rgba(239, 68, 68, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}