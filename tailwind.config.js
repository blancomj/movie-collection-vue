/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          50: '#eef2ff',
          100: 'rgba(102, 126, 234, 0.1)',
          200: 'rgba(102, 126, 234, 0.2)',
          300: '#93a5f3',
          400: '#7b8fef',
          500: '#667eea',
          600: '#5a6fd8',
          700: '#4a5bc4',
          800: '#3d4ba3',
          900: '#2d3a7a'
        },
        accent: {
          DEFAULT: '#ffd700',
          light: '#ffe44d'
        },
        danger: '#dc3545',
        success: '#28a745',
        warning: '#ffc107',
        info: '#17a2b8',
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e1e2f',
          'dark-light': '#2a2a3d'
        }
      },
      borderRadius: {
        'card': '12px',
        'chip': '15px',
        'pill': '25px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'card': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 25px rgba(0, 0, 0, 0.15)',
        'drawer': '0 0 30px rgba(0, 0, 0, 0.3)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.3s ease',
        'slide-right': 'slideRight 0.3s ease'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}