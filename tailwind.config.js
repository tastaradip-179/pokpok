/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
      },
      colors: {
        heading: "#11175D",
        form: "#11175D",
        main: "#5F35F5",
        link: "#EA6C00",
        para1: "#03014C",
        para2: "#C3C5D7",
        active: "#00FF75",
        chatBg: "#F1F1F1",
        mainTransparent: "rgba(95, 53, 245, 0.8)"
      },
      maxWidth: {
        xxlContainer: "1500px",
        xlContainer: "1250px",
        lgContainer: "1000px",
        mdContainer: "740px",
        smContainer: "620px",
        container: "370px",
      },
      boxShadow: {
        'dark': '0px 4px 4px rgba(0, 0, 0, 0.25)',
        'light': '0px 3px 3px rgba(0, 0, 0, 0.2)',
      },
      screens: {
        'xs': '375px',
        'xsm': '415px',
      },
    },
  },
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}
