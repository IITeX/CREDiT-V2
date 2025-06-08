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
        green: {
          50: "hsl(210, 100%, 97%)",  // sky tint
          100: "hsl(210, 95%, 92%)",
          200: "hsl(210, 90%, 85%)",
          300: "hsl(211, 85%, 74%)",
          400: "hsl(212, 78%, 60%)",  // bright accent
          500: "hsl(213, 80%, 45%)",  // strong blue
          600: "hsl(215, 75%, 35%)",  // near #182B38
          700: "hsl(217, 72%, 29%)",
          800: "hsl(219, 68%, 24%)",
          900: "hsl(221, 70%, 16%)",  // very dark blue
        },

        emerald: {
          50: "hsl(200, 100%, 96%)",  // pale aqua
          100: "hsl(199, 90%, 90%)",
          200: "hsl(198, 85%, 80%)",
          300: "hsl(197, 80%, 68%)",
          400: "hsl(196, 74%, 55%)",  // vibrant aqua
          500: "hsl(195, 85%, 40%)",  // deep teal blue
          600: "hsl(194, 90%, 32%)",
          700: "hsl(193, 92%, 26%)",
          800: "hsl(192, 85%, 22%)",
          900: "hsl(190, 80%, 17%)",  // near #182B38 base
        }


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
          "radial-gradient(at 40% 20%, rgba(24, 43, 56, 0.3) 0px, transparent 50%), " +
          "radial-gradient(at 80% 0%, rgba(42, 59, 80, 0.3) 0px, transparent 50%), " +
          "radial-gradient(at 0% 50%, rgba(255, 255, 255, 0.8) 0px, transparent 50%), " +
          "radial-gradient(at 80% 50%, rgba(65, 87, 106, 0.4) 0px, transparent 50%), " +
          "radial-gradient(at 0% 100%, rgba(255, 255, 255, 0.6) 0px, transparent 50%), " +
          "radial-gradient(at 80% 100%, rgba(65, 87, 106, 0.3) 0px, transparent 50%)",
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
