/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        GilroyRegular: ["GilroyRegular"],
        GilroySemiBold: ["GilroySemiBold"],
        JosefinSansRegular: ["JosefinSansRegular"],
        JosefinSansMedium: ["JosefinSansMedium"],
        JosefinSansSemiBold: ["JosefinSansSemiBold"],
        JosefinSansBold: ["JosefinSansBold"],
        JosefinSansItalic: ["JosefinSansItalic"],
        JosefinSansMediumItalic: ["JosefinSansMediumItalic"],
        JosefinSansSemiBoldItalic: ["JosefinSansSemiBoldItalic"],
        PoppinsMedium: ["PoppinsMedium"],
        PoppinsRegular: ["PoppinsRegular"],
        PoppinsSemiBold: [" PoppinsSemiBold"],
      },
    },
  },
  plugins: [],
};
