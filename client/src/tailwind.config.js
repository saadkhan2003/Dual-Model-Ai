/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            maxWidth: 'none',
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.900'),
              fontWeight: '600',
              marginTop: '1.5em',
              marginBottom: '0.5em',
            },
            // Tables
            table: {
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              marginTop: '2em',
              marginBottom: '2em',
              borderCollapse: 'collapse',
              width: '100%',
            },
            'thead th': {
              fontWeight: '600',
              borderBottom: `2px solid ${theme('colors.gray.200')}`,
              padding: '0.75em',
              textAlign: 'left',
            },
            'tbody td': {
              padding: '0.75em',
              borderBottom: `1px solid ${theme('colors.gray.200')}`,
              verticalAlign: 'top',
            },
            // Blockquotes
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: theme('colors.gray.700'),
              borderLeftWidth: '0.25rem',
              borderLeftColor: theme('colors.gray.300'),
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
              marginTop: '1.6em',
              marginBottom: '1.6em',
              paddingLeft: '1em',
            },
            // Lists
            ul: {
              listStyleType: 'disc',
              marginTop: '1.25em',
              marginBottom: '1.25em',
              paddingLeft: '1.625em',
            },
            'ul > li': {
              position: 'relative',
              paddingLeft: '0.375em',
            },
            'ul > li::marker': {
              color: theme('colors.gray.400'),
            },
            // Checkboxes
            'input[type="checkbox"]': {
              color: theme('colors.primary.600'),
              borderRadius: '0.25rem',
              marginRight: '0.5em',
            },
            // Nested lists
            'ol > li > ol': {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
            'ul > li > ul': {
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
            // Code blocks
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.100'),
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              margin: '1.7142857em 0',
              padding: '1.1428571em',
              borderRadius: '0.375rem',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            // Inline code
            ':not(pre) > code': {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            // Horizontal rule
            hr: {
              borderColor: theme('colors.gray.200'),
              marginTop: '3em',
              marginBottom: '3em',
            },
            // Links
            a: {
              color: theme('colors.primary.600'),
              textDecoration: 'underline',
              fontWeight: '500',
            },
            'a:hover': {
              color: theme('colors.primary.700'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.gray.100'),
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.gray.700'),
            },
            hr: {
              borderColor: theme('colors.gray.700'),
            },
            'ul > li::marker': {
              color: theme('colors.gray.500'),
            },
            'tbody td': {
              borderBottomColor: theme('colors.gray.700'),
            },
            'thead th': {
              borderBottomColor: theme('colors.gray.600'),
            },
            ':not(pre) > code': {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.200'),
            },
            a: {
              color: theme('colors.primary.400'),
            },
            'a:hover': {
              color: theme('colors.primary.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};