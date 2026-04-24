import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      sm: '768px',
    },
    extend: {
      colors: {
        // Brand palette (preserved for reference)
        navy: '#003366',
        navy2: '#4169E1',
        navy3: '#6495ED',
        lightnavy: '#99CCFF',
        red: '#FF6347',
        // Semantic design tokens
        primary: '#003366', // brand / nav active / headings
        secondary: '#4169E1', // buttons / interactive elements
        accent: '#6495ED', // modal highlights
        surface: '#99CCFF', // zone chip backgrounds
        danger: '#FF6347', // important flag / destructive actions
      },
      fontFamily: {
        nanumgothic_regular: ['var(--font-nanumgothic-regular)', 'sans-serif'],
        nanumgothic_bold: ['var(--font-nanumgothic-bold)', 'sans-serif'],
        nanumgothic_extrabold: [
          'var(--font-nanumgothic-extrabold)',
          'sans-serif',
        ],
      },
      fontSize: {
        'ui-caption': ['1rem', { lineHeight: '1.5rem' }], // fine print, footer text
        'ui-sm': ['1.5rem', { lineHeight: '2rem' }], // labels, captions
        'ui-md': ['2rem', { lineHeight: '2.5rem' }], // section headings, nav text
        'ui-lg': ['2.3rem', { lineHeight: '3rem' }], // feature / landing body
        'ui-xl': ['3.2rem', { lineHeight: '4rem' }], // hero / landing headings
        'ui-mega': ['10rem', { lineHeight: '1' }], // loading spinner glyph
      },
      textUnderlineOffset: {
        title: '1rem', // greeting underline in Main
      },
      width: {
        content: '100rem', // main page container
        'logo-title': '14.4rem', // header title SVG
        'logo-hero': '27.3rem', // landing hero logo
        'form-sm': '30rem', // small inputs / buttons
        'form-md': '35rem', // medium inputs / buttons
        'form-lg': '47rem', // Naver calendar button
        'form-xl': '49rem', // wide modal input
        'form-2xl': '64rem', // full-width modal input
        calendar: '50rem', // FullCalendar container
        soon: '40rem', // coming-soon image width
      },
      height: {
        header: '8.6rem', // top header bar
        'header-sm': '35rem', // header bar on mobile
        'logo-title': '3.2rem', // header title SVG
        'nav-item': '3.4rem', // nav pill height
        'logo-hero': '27.3rem', // landing hero logo
        landing: '120rem', // landing page full height
        'landing-sm': '140rem', // landing page mobile height
        'coming-soon': '50rem', // placeholder page height
        'not-found': '40rem', // 404 page height
        'page-loading': '20rem', // loading spinner area
        calendar: '50rem', // FullCalendar container
        soon: '30rem', // coming-soon image height
      },
      minHeight: {
        zone: '16rem', // memo drag-and-drop zone
        'memo-panel': '59rem', // recent memos side panel
      },
      maxWidth: {
        content: '100rem', // main page container cap
      },
    },
  },
  plugins: [],
} satisfies Config
