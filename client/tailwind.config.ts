/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        "interactive-normal": "rgb(181, 186, 193)",
        "text-normal": "rgb(219, 222, 225)",
        "green-360": "rgb(35, 165, 89)",
        "background-tertiary": "#1E1F22",
        "background-primary": "rgb(49, 51, 56)",
        "background-secondary": "rgb(43, 45, 49)",
        "brand-560": "rgb(71, 82, 196)",
        "brand-600": "rgb(60, 69, 165)",
        "channel-icon": "rgb(128, 132, 142)",
        "dark-700": "#313338",
        "background-modifier-accent": "#4e50587a",
        "background-modifier-selected": "rgba(78, 80, 88, 0.6)",
        "background-modifier-hover": "rgba(78, 80, 88, 0.298)",
        foreground: "hsl(var(--foreground))",
        "status-positive-background": "rgb(36, 128, 70)",
        positive: "rgb(45, 199, 112)",
        "header-primary": "#f2f3f5",
        "header-secondary": "rgb(181, 186, 193)",
        "background-interactive-hover": "rgba(78, 80, 88, 0.3)",
        "background-secondary-alt": "rgb(35, 36, 40)",
        "interactive-hover": "rgb(219, 222, 225)",
        "channels-default": "rgb(148, 155, 164)",
        "text-muted": "rgb(148, 155, 164)",
        "info-danger-foreground": "rgb(242, 63, 66)",
        "info-positive-foreground": "rgb(35, 165, 89)",
        "status-danger": "rgb(242, 63, 66)",
        "button-danger-background": "rgb(218, 55, 60)",
        "red-500": "rgb(164, 40, 40)",
        "background-floating": "rgb(17, 18, 20)",
        "text-input-border": "rgba(0, 0, 0, 0.298)",
        "text-link": "rgb(0, 168, 252)",
        "text-danger": "rgb(250, 119, 124)",
        "text-positive": "rgb(45, 199, 112)",
        primary: {
          DEFAULT: "rgb(var(--primary))",
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
          DEFAULT: "rgb(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },

      boxShadow: {
        "elevation-low":
          "rgba(2, 2, 2, 0.2) 0px 1px 0px 0px, rgba(6, 6, 7, 0.05) 0px 1.5px 0px 0px, rgba(2, 2, 2, 0.05) 0px 2px 0px 0px",

        "elevation-high": "0 8px 16px #000 / 0.24)",
      },
    },
    backgroundImage: {
      "auth-background": "url('/images/auth-background.svg')",
      "wumpus-waiting-friends":
        "url('/images/background/wumpus-waiting-friends.svg')",
      "wumpus-pending-request":
        "url('/images/background/wumpus-pending-request.svg')",
    },

    screens: {
      "max-940": { max: "940px" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
