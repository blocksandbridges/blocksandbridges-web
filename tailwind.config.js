/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './components/**/*.{js,ts,jsx,tsx,mdx,scss}',
  ],
  theme: {
    extend: {
      colors: {
        'bnb-dark-blue': 'var(--bnb-dark-blue)',
        'bnb-orange': 'var(--bnb-orange)',
        'bnb-light-blue': 'var(--bnb-light-blue)',
        'bnb-cyan': 'var(--bnb-cyan)',
      },
      fontFamily: {
        merriweather: ['var(--font-merriweather)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
