/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light Enterprise Theme Palette
        background: {
          primary: '#F9FAFB', // Cool Light Grey
          secondary: '#FFFFFF', // Pure White
          accent: '#F3F4F6', // Subtle section background
        },
        text: {
          primary: '#111827', // Deep Grey/Black
          secondary: '#4B5563', // Medium Grey
          light: '#9CA3AF', // Light Grey
        },
        primary: {
          50: '#ecfeff',
          100: '#cffafe', // Cyan-100
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22D3EE', // Cyan-400
          500: '#06B6D4', // Cyan-500
          600: '#0891B2', // Cyan-600
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        accent: {
          teal: '#04D9CE',
          lime: '#86EFAC', // Softer Lime that resolves to green-300
          blue: '#1A87FF',
          purple: '#A855F7',
        },
        status: {
          success: '#10B981', // Emerald-500
          warning: '#F59E0B', // Amber-500
          danger: '#EF4444', // Red-500
          info: '#3B82F6', // Blue-500
        },
        // Legacy support mapping for old components (remapped to light theme equivalents)
        dark: {
          900: '#F9FAFB', // Remapped to bg-primary
          800: '#FFFFFF', // Remapped to white (card bg)
          700: '#E5E7EB', // Remapped to border grey
          600: '#D1D5DB', // Remapped to darker border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'lift': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'float': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
        'glow-teal': '0 0 15px rgba(4, 217, 206, 0.3)',
        'glow-lime': '0 0 15px rgba(163, 255, 18, 0.3)',
        'glow-blue': '0 0 15px rgba(26, 135, 255, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
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
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}