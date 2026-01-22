/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Stripe-inspired system
        stripe: {
          50: '#f6f9fc', // Main app background
          100: '#e3e8ee',
          200: '#cdd5df',
          300: '#9aa5b1',
          400: '#697386',
          500: '#4f566b',
          600: '#3c4257', // Secondary text
          700: '#2a2f45',
          800: '#1a1f36',
          900: '#0a2540', // Primary text
        },
        // Brand primary - Gold color system (for official capital, brand identity)
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B', // Main gold
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Accent color - Professional blue (for emphasis, CTA)
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6', // Main blue
          600: '#2563EB',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Dark background system
        dark: {
          950: '#0d1117', // Main background
          900: '#161b22', // Card background
          850: '#1c2128', // Secondary background
          800: '#21262d', // Border
          700: '#30363d', // Divider
        },
        // Keep legacy primary for backwards compatibility (mapped to accent)
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1d4ed8',
        },
        // Standard grays
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Semantic colors
        success: '#10B981',
        danger: '#EF4444',
      },
      boxShadow: {
        'stripe-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        stripe:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'stripe-lg':
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'stripe-xl':
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        lifted:
          '0 50px 100px -20px rgba(50, 50, 93, 0.25), 0 30px 60px -30px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
