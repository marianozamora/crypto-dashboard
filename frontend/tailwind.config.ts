import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#111318',
          deep: '#0a0b0f',
          elevated: '#1a1d27',
          card: '#21253a',
        },
        accent: {
          green: '#00d4aa',
          red: '#ff4d6d',
          yellow: '#ffd166',
          blue: '#4da6ff',
          purple: '#a78bfa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash': 'flash 0.3s ease-out',
      },
      keyframes: {
        flash: {
          '0%': { backgroundColor: 'rgba(255,255,255,0.08)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config
