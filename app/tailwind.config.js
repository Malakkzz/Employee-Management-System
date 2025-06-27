/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    backgroundImage: {
      radial: "radial-gradient(circle, var(--tw-gradient-stops))",
      "custom-linear-gradient":
        "linear-gradient(90deg, #167EE6 0%, #167EE6 100%)",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "police-blue": "blueSweep 1.5s ease infinite alternate",
        "police-red": "redSweep 1.5s ease infinite alternate",
      },
      keyframes: {
        blueSweep: {
          "0%": {
            background: "rgba(0, 0, 255, 0.8)",
            transform: "translateX(-100%)",
          },
          "100%": {
            background: "rgba(255, 0, 0, 0.8)",
            transform: "translateX(150%)",
          },
        },
        redSweep: {
          "0%": {
            background: "rgba(255, 0, 0, 0.8)",
            transform: "translateX(100%)",
          },
          "100%": {
            background: "rgba(0, 0, 255, 0.8)",
            transform: "translateX(-150%)",
          },
        },
      },
      backgroundColor: ["even", "odd"],
      gridTemplateColumns: {
        25: "repeat(25, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-16": "span 16 / span 16",
      },
      colors: {
        primary: "#167EE6",
        secondary: "#0A0A40",
        darkSecondary: "#0C1325",
        background: "#00040f",
        tertiary: "#3A475E",
        link: "#167EE6",
        "bg-primary": "#151837",
        "custom-green": "#E0ED34",
        nav: "#adaeb0",
        bgNav: "#2D2F33",
        greenMatte: "#3a7837",
        redMatte: "#780c0c",
        yellow: "#fbc02d",
        grey: "#6b7280",
        dropdown: "#34363F",
      },
      boxShadow: {
        grey: "0px 0px 11px 0px #D9D9D959",
        inputShadow: "0px 0px 4px 0px #D8D8D8",
        filterShadow: "0px 0px 14px 0px #DDD",
      },
      fontFamily: {
        nova: ["ProximaNova", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
      },
      height: {
        fh: "calc(100% - 8rem)",
        table: "calc(100vh - 170px)",
      },
    },
  },
  experimental: {
    optimizeUniversalDefaults: true,
  },
  plugins: [],
};
