/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        code: {
          bg: '#2d2d2d',
          text: '#f8f8f2'
        },
        chat: {
          bg: '#1e1e1e',
          text: '#e1e1e1',
          user: '#444654',
          ai: '#3e3f4b'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'Segoe UI',
          'Roboto',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif'
        ],
        mono: [
          'Fira Code',
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace'
        ]
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out forwards',
        slideIn: 'slideIn 0.3s ease-out forwards',
        bounce: 'bounce 0.6s infinite'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.chat.text'),
            maxWidth: 'none',
            code: {
              color: theme('colors.code.text'),
              backgroundColor: theme('colors.code.bg'),
              fontWeight: '400',
              borderRadius: '0.5rem',
              padding: '0.2em 0.4em',
              '&::before': {
                content: 'none !important',
              },
              '&::after': {
                content: 'none !important',
              },
            },
            pre: {
              backgroundColor: 'transparent',
              borderRadius: '0.75rem',
              padding: '0',
              margin: '1.5rem 0',
              code: {
                backgroundColor: 'transparent',
                borderRadius: '0',
                padding: '0',
                fontWeight: '400',
                color: 'inherit',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: theme('fontFamily.mono').join(', '),
                '&::before': {
                  content: 'none !important',
                },
                '&::after': {
                  content: 'none !important',
                },
              },
            },
            'h1, h2, h3, h4': {
              color: theme('colors.chat.text'),
              fontWeight: '600',
            },
            p: {
              color: theme('colors.chat.text'),
              lineHeight: '1.75',
            },
            a: {
              color: theme('colors.blue.400'),
              textDecoration: 'none',
              '&:hover': {
                color: theme('colors.blue.300'),
              },
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.chat.text'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}