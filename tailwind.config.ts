import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "200": "100"
      },
      colors: {
        primary: {
          90: "#EADDFF",
          80: "#D0BCFF",
          70: "#B69DF8",
          60: "#9A82DB",
          50: "#7F67BE",
          40: "#6750A4",
          30: "#4F378B",
          20: "#381E72",
          10: "#21005D",
        },
        secondary: {
          99: "#FFFFFF",
          95: "#F5EFF7",
          90: "#DDDEE8",
          80: "#CAC5CD",
          70: "#AEA9B1",
          60: "#938F96",
          50: "#79767D",
          40: "#605D64",
          30: "#48464C",
          20: "#322F35",
          10: "#1D1B20",
        },
      },
    },
  },
  plugins: [],
};
export default config;
