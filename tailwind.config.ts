import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)']
      },
      keyframes: {
        'animate-grain': {
          '0%, 100%': {
            transform: 'translate(0, 0)'
          },
          '10%, 30%, 50%, 70%, 90%': {
            transform: 'translate(-5%, -10%)'
          },
          '20%, 40%, 60%, 80%, 100%': {
            transform: 'translate(-15%, -20%)'
          }
        },
        'animate-wave-shadow': {
          '0%, 100%': {
            boxShadow:
              '0px 0px 0px 1px rgba(165, 165, 165, 0.04), -9px 9px 9px -0.5px rgba(0, 0, 0, 0.04), -18px 18px 18px -1.5px rgba(0, 0, 0, 0.08), -37px 37px 37px -3px rgba(0, 0, 0, 0.16), -75px 75px 75px -6px rgba(0, 0, 0, 0.24), -150px 150px 150px -12px rgba(0, 0, 0, 0.48)'
          },
          '25%': {
            boxShadow:
              '0px 0px 0px 1px rgba(165, 165, 165, 0.04), -7px 11px 9px -0.5px rgba(0, 0, 0, 0.04), -14px 22px 18px -1.5px rgba(0, 0, 0, 0.08), -29px 45px 37px -3px rgba(0, 0, 0, 0.16), -59px 91px 75px -6px rgba(0, 0, 0, 0.24), -118px 182px 150px -12px rgba(0, 0, 0, 0.48)'
          },
          '50%': {
            boxShadow:
              '0px 0px 0px 1px rgba(165, 165, 165, 0.04), -9px 9px 9px -0.5px rgba(0, 0, 0, 0.04), -18px 18px 18px -1.5px rgba(0, 0, 0, 0.08), -37px 37px 37px -3px rgba(0, 0, 0, 0.16), -75px 75px 75px -6px rgba(0, 0, 0, 0.24), -150px 150px 150px -12px rgba(0, 0, 0, 0.48)'
          },
          '75%': {
            boxShadow:
              '0px 0px 0px 1px rgba(165, 165, 165, 0.04), -11px 7px 9px -0.5px rgba(0, 0, 0, 0.04), -22px 14px 18px -1.5px rgba(0, 0, 0, 0.08), -45px 29px 37px -3px rgba(0, 0, 0, 0.16), -91px 59px 75px -6px rgba(0, 0, 0, 0.24), -182px 118px 150px -12px rgba(0, 0, 0, 0.48)'
          }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        scanline: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' }
        },
        'wave-shadow': {
          '0%, 100%': { boxShadow: '0 0 25px rgba(32, 245, 32, 0.1)' },
          '50%': { boxShadow: '0 0 35px rgba(32, 245, 32, 0.3)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        glitch: {
          '0%, 100%': { transform: 'translateX(0)' },
          '5%, 25%': { transform: 'translateX(-2px)' },
          '10%, 30%': { transform: 'translateX(2px)' },
          '15%': { transform: 'translateX(-1px)' },
          '20%': { transform: 'translateX(1px)' }
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' }
        }
      },
      animation: {
        grain: 'animate-grain 8s steps(10) infinite',
        'wave-shadow': 'animate-wave-shadow 8s ease-in-out infinite',
        blink: 'blink 1s step-end infinite',
        scanline: 'scanline 6s linear infinite',
        fadeIn: 'fadeIn 0.3s ease-in',
        glitch: 'glitch 3s infinite',
        typing: 'typing 1s steps(30) infinite alternate'
      },
      backgroundImage: {
        'grain-noise': "url('/grain.webp')",
        'grid-pattern': 'linear-gradient(to right, #444444 2px, transparent 2px), linear-gradient(to bottom, #444444 2px, transparent 2px)'
      },
      backgroundSize: {
        'grid-pattern': '5vh 5vh'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')]
}
export default config
