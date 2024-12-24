/** @type {import('tailwindcss').Config} */
module.exports = {
	mode: 'jit',
  content: [
		"./src/**/*.{html,ts}",
  	"./src/styles.scss"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
