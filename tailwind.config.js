/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        shadow: 'var(--color-shadow)',
        selection: 'var(--color-selection)',
        text: 'var(--color-text)',
        background: 'var(--color-background)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      backgroundImage: {
        folder: "url('/folder.svg')",
        folderOpen: "url('/folder-open.svg')",
      },
    },
  },
  plugins: [],
}
