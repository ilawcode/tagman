import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD100",
        "primary-foreground": "#1A1A1A",
        background: "#F5F5F5",
        surface: "#FFFFFF",
        "sidebar-bg": "#1A1A1A",
        "sidebar-text": "#FFFFFF",
        "sidebar-active": "#FFD100",
        success: "#22C55E",
        warning: "#F59E0B",
        destructive: "#EF4444",
        border: "#E5E5E5",
        muted: "#737373",
      },
    },
  },
  plugins: [],
};

export default config;
