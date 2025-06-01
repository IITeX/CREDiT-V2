import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Green theme colors
        green: {
          50: "hsl(138, 76%, 97%)",
          100: "hsl(141, 84%, 93%)",
          200: "hsl(141, 79%, 85%)",
          300: "hsl(142, 77%, 73%)",
          400: "hsl(142, 69%, 58%)",
          500: "hsl(142, 76%, 36%)",
          600: "hsl(142, 72%, 29%)",
          700: "hsl(142, 64%, 24%)",
          800: "hsl(142, 55%, 20%)",
          900: "hsl(143, 61%, 10%)",
        },
        emerald: {
          50: "hsl(151, 81%, 96%)",
          100: "hsl(149, 80%, 90%)",
          200: "hsl(152, 76%, 80%)",
          300: "hsl(156, 72%, 67%)",
          400: "hsl(158, 64%, 52%)",
          500: "hsl(160, 84%, 39%)",
          600: "hsl(161, 94%, 30%)",
          700: "hsl(163, 94%, 24%)",
          800: "hsl(163, 88%, 20%)",
          900: "hsl(164, 86%, 16%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(34, 197, 94, 0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(34, 197, 94, 0.4)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        parallax: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-50px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "gradient-shift": "gradient-shift 3s ease infinite",
        shimmer: "shimmer 2s infinite",
        parallax: "parallax 10s ease-in-out infinite",
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(at 40% 20%, hsla(142,76%,36%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(160,84%,39%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(151,81%,96%,0.8) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(142,69%,58%,0.4) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(149,80%,90%,0.6) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(156,72%,67%,0.3) 0px, transparent 50%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
        "green-gradient": "linear-gradient(135deg, hsl(142, 76%, 36%) 0%, hsl(160, 84%, 39%) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      perspective: {
        "1000": "1000px",
        "1500": "1500px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
