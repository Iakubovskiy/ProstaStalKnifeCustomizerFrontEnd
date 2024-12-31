import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.css",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        text: "#ff0000",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            text: "#000000",
            foreground: "#000000",
          },
        },
        dark: {
          colors: {
            text: "#000000",
            foreground: "#000000",
          },
        },
      },
    }),
  ],
} satisfies Config;
