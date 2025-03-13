import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: { max: '1104px' },
    },
    extend: {
      colors: {
        navy: '#003366',
      },
      fontFamily: {
        nanumgothic_regular: ['var(--font-nanumgothic-regular)', 'sans-serif'],
        nanumgothic_bold: ['var(--font-nanumgothic-bold)', 'sans-serif'],
        nanumgothic_extrabold: [
          'var(--font-nanumgothic-extrabold)',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
