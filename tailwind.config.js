/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#222222',
      },
      fontFamily: {
        'proxima-nova': ['Proxima Nova', 'sans-serif'],
        'red-hat': ['Red Hat Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

