const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      borderWidth: {
        '1.5': '1.5px', // Custom border width of 1.5px
      },
      keyframes: {
        fadeInTop: {
          '0%': { opacity: '0', transform: 'translateY(-50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        typedLetter: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '99%': { opacity: '0' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        fadeInTop: 'fadeInTop 1.5s ease-out forwards',
        typedLetter: 'typedLetter 0.1s forwards',
        typewriter: 'typewriter 4s steps(40) 1s 1 normal both, blink 0.75s step-end infinite',
        pulse: 'pulse 1.5s ease-in-out infinite',
        slideIn: 'slideIn 0.5s ease-out forwards',
        scaleUp: 'scaleUp 0.2s ease-in-out forwards',
      },
      colors: {
        white: '#ffffff',
        black: '#000000',
        pureWhite: '#ffffff',
        pureBlack: '#000000',
        gray: {
          ...colors.gray,
          DEFAULT: '#757575',
        },
        blue: {
          ...colors.blue,
          DEFAULT: 'var(--portal-primary, #005b96)',
        },
        darkBlue: 'var(--portal-dark-blue, #2E5090)',
        lightBlue: 'var(--portal-light-blue, #aec8e2)',
        hoverBlue: 'var(--portal-hover-blue, #eaf1fe)',
        LightSteelBlue: 'var(--portal-steel-blue, #B0C4DE)',
        kajal: 'var(--portal-accent, #a2d2ff)',
        DeepSkyBlue: 'var(--portal-accent, #00BFFF)',
        darkBlueAlt: 'var(--portal-dark-blue-alt, #1E3A8A)',
        lightBlueAlt: 'var(--portal-light-blue-alt, #60A5FA)',
        grayAlt: '#4B5563',
      },
      fontFamily: {
        "mons": ["'Montserrat'", 'sans-serif'],
        "montserrat": ["'Montserrat'", 'sans-serif'],
        "playfair": ["'Playfair Display'", 'serif'],
        "poppins": ["'Poppins'", 'sans-serif'],
        "sans": ["'Poppins'", "'Montserrat'", 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('images/banner.jpg')",
      },
    },
  },
  plugins: [],
};
