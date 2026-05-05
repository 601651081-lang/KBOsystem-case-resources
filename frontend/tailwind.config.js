/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Roboto', 'Segoe UI', 'Arial', 'sans-serif'],
        'display': ['Roboto', 'Segoe UI', 'Arial', 'sans-serif'],
        'body': ['Roboto', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      colors: {
        // Google Material Design 配色方案
        google: {
          gray: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121',
          },
          blue: {
            50: '#e3f2fd',
            100: '#bbdefb',
            200: '#90caf9',
            300: '#64b5f6',
            400: '#42a5f5',
            500: '#2196f3', // Google 主蓝色
            600: '#1e88e5',
            700: '#1976d2',
            800: '#1565c0',
            900: '#0d47a1',
          },
          green: {
            500: '#4caf50', // Google 绿色
          },
          red: {
            500: '#f44336', // Google 红色
          },
          yellow: {
            500: '#ffeb3b', // Google 黄色
          },
          indigo: {
            500: '#3f51b5', // Google 靛蓝色
          },
          teal: {
            500: '#009688', // Google 青色
          },
          orange: {
            500: '#ff9800', // Google 橙色
          },
        },
      },
      boxShadow: {
        'google-sm': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'google-md': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
        'google-lg': '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
        'google-xl': '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
      },
      borderRadius: {
        'google-sm': '4px',
        'google-md': '8px',
        'google-lg': '12px',
        'google-xl': '16px',
      },
    },
  },
  plugins: [],
}