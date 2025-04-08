/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/client/components/**/*.{js,jsx,ts,tsx}", "./app/client/screens/**/*.{js,jsx,ts,tsx}", "./app/client/assets/expo-icons.tsx"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],  
};
