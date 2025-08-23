import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'inter': ['Inter', 'sans-serif'],
				'merriweather': ['Merriweather', 'serif'],
				'sans': ['Inter', 'sans-serif'],
				'serif': ['Merriweather', 'serif'],
				'orbitron': ['Orbitron', 'monospace'],
				'creepster': ['Creepster', 'cursive'],
			},
			fontSize: {
				'xs': ['16px', { lineHeight: '24px', fontWeight: '700' }],
				'sm': ['18px', { lineHeight: '28px', fontWeight: '700' }],
				'base': ['20px', { lineHeight: '32px', fontWeight: '700' }],
				'lg': ['24px', { lineHeight: '36px', fontWeight: '700' }],
				'xl': ['28px', { lineHeight: '40px', fontWeight: '700' }],
				'2xl': ['32px', { lineHeight: '44px', fontWeight: '700' }],
				'3xl': ['40px', { lineHeight: '52px', fontWeight: '700' }],
				'4xl': ['48px', { lineHeight: '60px', fontWeight: '700' }],
				'5xl': ['56px', { lineHeight: '68px', fontWeight: '700' }],
				'6xl': ['64px', { lineHeight: '76px', fontWeight: '700' }],
				'7xl': ['72px', { lineHeight: '84px', fontWeight: '700' }],
				'8xl': ['80px', { lineHeight: '92px', fontWeight: '700' }],
				'9xl': ['88px', { lineHeight: '100px', fontWeight: '700' }],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				healio: {
					orange: 'hsl(var(--healio-orange))',
					'orange-foreground': 'hsl(var(--healio-orange-foreground))',
					turquoise: 'hsl(var(--healio-turquoise))',
					'turquoise-foreground': 'hsl(var(--healio-turquoise-foreground))',
					mint: 'hsl(var(--healio-mint))',
					'mint-foreground': 'hsl(var(--healio-mint-foreground))',
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'float-reverse': {
					'0%, 100%': { transform: 'translateY(-10px)' },
					'50%': { transform: 'translateY(10px)' }
				},
				'float-slow': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-30px) rotate(180deg)' }
				},
				'pulse-glow': {
					'0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
					'50%': { transform: 'scale(1.1)', opacity: '1' }
				},
				'logo-bounce': {
					'0%, 100%': { 
						transform: 'translateY(0px) scale(1) rotate(0deg)',
						textShadow: '0 0 20px rgba(132, 204, 191, 0.8), 0 0 40px rgba(132, 204, 191, 0.4)',
						filter: 'hue-rotate(0deg) brightness(1.2)'
					},
					'25%': { 
						transform: 'translateY(-15px) scale(1.15) rotate(3deg)',
						textShadow: '0 0 30px rgba(255, 179, 132, 1), 0 0 60px rgba(255, 179, 132, 0.6)',
						filter: 'hue-rotate(90deg) brightness(1.5)'
					},
					'50%': { 
						transform: 'translateY(-10px) scale(1.1) rotate(-2deg)',
						textShadow: '0 0 25px rgba(179, 255, 204, 0.9), 0 0 50px rgba(179, 255, 204, 0.5)',
						filter: 'hue-rotate(180deg) brightness(1.3)'
					},
					'75%': { 
						transform: 'translateY(-8px) scale(1.08) rotate(1deg)',
						textShadow: '0 0 35px rgba(255, 179, 132, 0.8), 0 0 70px rgba(255, 179, 132, 0.4)',
						filter: 'hue-rotate(270deg) brightness(1.4)'
					}
				},
				'logo-glow': {
					'0%, 100%': { 
						filter: 'hue-rotate(0deg) brightness(1.5) saturate(1.5)',
						textShadow: '0 0 30px rgba(132, 204, 191, 1), 0 0 60px rgba(132, 204, 191, 0.7), 0 0 90px rgba(132, 204, 191, 0.3)'
					},
					'33%': { 
						filter: 'hue-rotate(120deg) brightness(2) saturate(2)',
						textShadow: '0 0 40px rgba(255, 179, 132, 1), 0 0 80px rgba(255, 179, 132, 0.8), 0 0 120px rgba(255, 179, 132, 0.4)'
					},
					'66%': { 
						filter: 'hue-rotate(240deg) brightness(1.8) saturate(1.8)',
						textShadow: '0 0 35px rgba(179, 255, 204, 1), 0 0 70px rgba(179, 255, 204, 0.8), 0 0 105px rgba(179, 255, 204, 0.4)'
					}
				},
				'letter-dance': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
					'20%': { transform: 'translateY(-8px) rotate(5deg) scale(1.1)' },
					'40%': { transform: 'translateY(4px) rotate(-3deg) scale(0.95)' },
					'60%': { transform: 'translateY(-6px) rotate(4deg) scale(1.05)' },
					'80%': { transform: 'translateY(2px) rotate(-2deg) scale(1.02)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'float-reverse': 'float-reverse 8s ease-in-out infinite',
				'float-slow': 'float-slow 12s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
				'logo-bounce': 'logo-bounce 3s ease-in-out infinite',
				'logo-glow': 'logo-glow 4s ease-in-out infinite',
				'letter-dance': 'letter-dance 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
