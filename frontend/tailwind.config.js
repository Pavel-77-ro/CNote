/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
      },
      gridColumnStart: {
        13: "13",
        14: "14",
        15: "15",
      },
      gridColumnEnd: {
        13: "13",
        14: "14",
        15: "15",
      },
      colors: {
        'bookmark-purple': '#E9623B',
        'bookmark-red': '#F04848',
        'bookmark-blue': '#242A45',
        'bookmark-grey': '#9194A2',
        'bookmark-white': '#f7f7f7',
        'hover-colour': '#FF7373'
      },
      scale: {
        175: '1.75',
        98: '0.98'
      }
    },
    fontFamily: {
      Poppins: ['Poppins, sans-serif'],
      Lucky: ['Luckiest Guy, Poppins, sans-serif']
    },
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        lg: '1124px',
        xl: '1124px',
        '2xl': '1124px'
      }
    }
  },
  plugins: [],
}

