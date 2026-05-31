import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

    width:{
      'w-benefit-register': 'calc(100%-332px)'
    },
      
      fontFamily: {
        
        // -apple-system, BlinkMacSystemFont, Helvetica Neue, Segoe UI, Arial, Helvetica, Roboto, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
      },
      screens: {
        'sm-custom': '550px',
        'lg-custom': '810px'
      },
      gridTemplateColumns: {
        'xl-mozaic': '150px 150px 150px 150px',
        'mini-mozaic': '80px 80px 80px 80px',
        'lg-mozaic': '150px 150px 150px',
        'md-mozaic': '150px 150px',
        'sm-mozaic': '80px 80px',
        'xl-card-curse': '300px 300px 300px 300px',
        'lg-card-curse': '300px 300px 300px',
        'md-card-curse': '300px 300px',
        'sm-card-curse': '200px 200px 200px',
        'card-curse': '300px',
      },
      gridTemplateRows: {
        'xl-mozaic': '150px 150px',
        'sm-mozaic': '80px 80px',
        'min-mozaic': '80px',
        'xl-card-curse': '450px 450px',
        'sm-card-curse': '350px 350px',
      }
    },
  },
  plugins: [
    
  ],
};
export default config;