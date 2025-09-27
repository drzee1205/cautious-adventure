/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ChatGPT Color Palette
        'gpt-bg': {
          light: '#ffffff',
          dark: '#212121'
        },
        'gpt-sidebar': {
          light: '#f7f7f8',
          dark: '#171717'
        },
        'gpt-text': {
          primary: {
            light: '#374151',
            dark: '#ececf1'
          },
          secondary: {
            light: '#6b7280',
            dark: '#9ca3af'
          }
        },
        'gpt-border': {
          light: '#e5e7eb',
          dark: '#4d4d4f'
        },
        'gpt-hover': {
          light: '#f9f9f9',
          dark: '#2a2a2a'
        },
        'gpt-primary': {
          DEFAULT: '#10a37f',
          hover: '#0d8a6f'
        },
        'gpt-error': '#ef4444',
        'gpt-warning': '#f59e0b',
        'gpt-success': '#10b981'
      },
      fontFamily: {
        'gpt': ['Söhne', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      fontSize: {
        'gpt-message': '16px',
        'gpt-sidebar': '14px',
        'gpt-timestamp': '12px'
      },
      lineHeight: {
        'gpt-message': '1.5'
      },
      fontWeight: {
        'gpt-message': '400',
        'gpt-sidebar': '500'
      },
      spacing: {
        'sidebar': '260px',
        'content': '768px'
      },
      borderRadius: {
        'gpt-button': '8px',
        'gpt-message': '12px',
        'gpt-input': '6px'
      },
      padding: {
        'gpt-message-x': '24px',
        'gpt-message-y': '16px'
      },
      animation: {
        'typing': 'typing 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': { opacity: '1' },
          '30%': { opacity: '0.3' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}