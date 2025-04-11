/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/client/components/**/*.{js,jsx,ts,tsx}",
    "./app/client/screens/**/*.{js,jsx,ts,tsx}",
    "./app/client/hocs/**/*.{js,jsx,ts,tsx}",
    "./app/client/types/**/*.{js,jsx,ts,tsx}",
    "./app/client/assets/expo-icons.tsx",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#252426",
        primary: {
          100: "#F3EBFF",
          200: "#E7D7FF",
          300: "#D2B8FF",
          400: "#B288FF",
          500: "#8D4DFF",
          600: "#722EFF",
          700: "#5B1AE6",
          800: "#4612B7",
          900: "#291660",
        },
        secondary: {
          100: "#F5F9FC",
          200: "#E8F0F7",
          300: "#D2DEE9",
          400: "#A2B9CC",
          500: "#7A91A6",
          600: "#5F7387",
          700: "#465870",
          800: "#2E3C4E",
          900: "#5A47D4",
        },
      },
      fontFamily: {
        inter: {
          normal: "Inter_400Regular",
          medium: "Inter_500Medium",
          semibold: "Inter_600SemiBold",
          bold: "Inter_700Bold",
          extrabold: "Inter_800ExtraBold",
          black: "Inter_900Black",
        },
        geist: {
          normal: "Geist_400Regular",
          medium: "Geist_500Medium",
          semibold: "Geist_600SemiBold",
          bold: "Geist_700Bold",
          extrabold: "Geist_800ExtraBold",
          black: "Geist_900Black",
        },
      },
    },
  },
  plugins: [],
};
