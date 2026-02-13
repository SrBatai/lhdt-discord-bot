/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'discord-blurple': '#5865F2',
        'discord-green': '#57F287',
        'discord-yellow': '#FEE75C',
        'discord-fuchsia': '#EB459E',
        'discord-red': '#ED4245',
        'discord-white': '#FFFFFF',
        'discord-black': '#000000',
        'discord-dark': '#23272A',
        'discord-notquiteblack': '#2C2F33',
        'discord-greyple': '#99AAB5',
      },
    },
  },
  plugins: [],
}
