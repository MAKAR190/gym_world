/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/client/components/**/*.{js,jsx,ts,tsx}",
    "./app/client/screens/**/*.{js,jsx,ts,tsx}",
    "./app/client/assets/expo-icons.tsx",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "oklch(97.9% 0.021 166.113)",
        foreground: "oklch(14.1% 0.005 285.823)",
        "primary-100": "oklch(96.2% 0.018 272.314)",
        "secondary-100": "oklch(96.8% 0.007 247.896)",
        "primary-200": "oklch(93% 0.034 272.788)",
        "secondary-200": "oklch(92.9% 0.013 255.508)",
        "primary-300": "oklch(87% 0.065 274.039)",
        "secondary-300": "oklch(86.9% 0.022 252.894)",
        "primary-400": "oklch(78.5% 0.115 274.713)",
        "secondary-400": "oklch(70.4% 0.04 256.788)",
        "primary-500": "oklch(67.3% 0.182 276.935)",
        "secondary-500": "oklch(55.4% 0.046 257.417)",
        "primary-600": "oklch(58.5% 0.233 277.117)",
        "secondary-600": "oklch(44.6% 0.043 257.281)",
        "primary-700": "oklch(51.1% 0.262 276.966)",
        "secondary-700": "oklch(37.2% 0.044 257.287)",
        "primary-800": "oklch(45.7% 0.24 277.023)",
        "secondary-800": "oklch(27.9% 0.041 260.031)",
        "primary-900": "oklch(20.8% 0.042 265.755)",
        "secondary-900": "oklch(39.8% 0.195 277.366)",
      },
    },
  },
  plugins: [],
};
