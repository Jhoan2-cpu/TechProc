/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores personalizada
        primary: {
          50: '#e5f7ff',
          100: '#ccefff',
          200: '#99dfff',
          300: '#66cfff',
          400: '#33bfff',
          500: '#26BBFF', // Deep Sky Blue - Color principal
          600: '#1e96cc',
          700: '#177199',
          800: '#0f4b66',
          900: '#082633',
        },
        secondary: {
          50: '#e8e7ec',
          100: '#d1cfd9',
          200: '#a39fb3',
          300: '#756f8d',
          400: '#473f67',
          500: '#201A2F', // Dark Purple - Color secundario
          600: '#1a1526',
          700: '#13101c',
          800: '#0d0a13',
          900: '#060509',
        },
        dark: {
          50: '#808080',
          100: '#666666',
          200: '#4d4d4d',
          300: '#333333',
          400: '#1a1a1a',
          500: '#111115', // Night
          600: '#0e0e11',
          700: '#0a0a0d',
          800: '#070709',
          900: '#030305',
        },
        smoky: {
          50: '#787874',
          100: '#5f5f5b',
          200: '#474743',
          300: '#2e2e2a',
          400: '#161612',
          500: '#0F0F02', // Smoky Black
          600: '#0c0c02',
          700: '#090901',
          800: '#060601',
          900: '#030300',
        },
        gray: {
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#bababa',
          400: '#a3a3a3',
          500: '#848282', // Gray
          600: '#6a6868',
          700: '#4f4e4e',
          800: '#353434',
          900: '#1a1a1a',
        },
        black: '#000000',
        white: '#FFFFFF',
        success: {
          50: '#d1fae5',
          100: '#a7f3d0',
          200: '#6ee7b7',
          300: '#34d399',
          400: '#10b981',
          500: '#059669', // Verde oscuro más consistente
          600: '#047857',
          700: '#065f46',
          800: '#064e3b',
          900: '#022c22',
        },
        warning: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706', // Naranja/ámbar oscuro más consistente
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
        },
        danger: {
          50: '#fee2e2',
          100: '#fecaca',
          200: '#fca5a5',
          300: '#f87171',
          400: '#ef4444',
          500: '#dc2626', // Rojo oscuro más consistente
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
