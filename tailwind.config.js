/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: '#F4A6CD', // Light Pink
        secondary: '#A8C8EC', // Soft Blue  
        accent: '#8FA68E', // Muted Green
        surface: '#FFFFFF', // White
        background: '#F5F1EB', // Warm Beige
        success: '#8FA68E', // Muted Green
        warning: '#F4C89B', // Soft Orange
        error: '#E88B8B', // Soft Red
        info: '#A8C8EC', // Soft Blue
      },
      fontFamily: {
        'display': ['Poppins', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'gentle': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}