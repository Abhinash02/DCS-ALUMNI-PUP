/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
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
          '0%': {
            opacity: '0',
            transform: 'translateY(-50px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
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
          fadeInTop: 'fadeInTop 1s ease-out forwards',
          typedLetter: 'typedLetter 0.1s forwards',
          typewriter: 'typewriter 4s steps(40) 1s 1 normal both, blink 0.75s step-end infinite',
          pulse: 'pulse 1.5s ease-in-out infinite',
          slideIn: 'slideIn 0.5s ease-out forwards',
          scaleUp: 'scaleUp 0.2s ease-in-out forwards',
        },
        typedLetter: {
          '0%': {
            opacity: '0', // Invisible at the start
            transform: 'translateY(-10px)', // Slightly above
          },
          '99%': {
            opacity: '0', // Still invisible at 99%
          },
          '100%': {
            opacity: '1', // Fully visible at the end
            transform: 'translateY(0)', // Move to normal position
          },
        },
      },
      animation: {
        fadeInTop: 'fadeInTop 1.5s ease-out forwards',
        typedLetter: 'typedLetter 0.1s forwards',
        typewriter: 'typewriter 4s steps(40) 1s 1 normal both, blink 0.75s step-end infinite',
      },
      colors: {
        "blue": '#005b96',
        "darkBlue": "#2E5090",
        "lightBlue": "#aec8e2",
        "hoverBlue": "#eaf1fe",
        "LightSteelBlue":   "#B0C4DE",
          "kajal":"a2d2ff",
           "DeepSkyBlue":                 "#00BFFF",
        "gray": "#757575",
     "darkBlueAlt": '#1E3A8A',   // New
        "lightBlueAlt": '#60A5FA',  // New
        "grayAlt": '#4B5563',       // New
      },
      fontFamily: {
        "mons": "'Montserrat', sans-serif",
        "playfair": "'Playfair Display', serif",
        "poppins": "'Poppins', sans-serif",
      },
      backgroundImage: {
        'hero-pattern': "url('images/banner.jpg')",
      },
    },
  },
  plugins: [],
};
