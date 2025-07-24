import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        modern: ['SF Mono', 'monospace'],
      },
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        primary: "rgb(var(--primary))",
        secondary: "rgb(var(--secondary))",
        muted: "rgb(var(--muted))",
        accent: "rgb(var(--accent))",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        'touch-min': 'var(--touch-target-minimum)',
        'touch-large': 'var(--touch-target-large)',
        'touch-compact': 'var(--touch-target-compact)',
        'nav': 'var(--nav-bar-height)',
        'status': 'var(--status-bar-height)',
        'tab': 'var(--tab-bar-height)',
      },
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "var(--line-height-tight)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--line-height-base)" }],
        base: ["var(--text-base)", { lineHeight: "var(--line-height-base)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--line-height-relaxed)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--line-height-relaxed)" }],
      },
      // Updated to match our motion.css
      transitionDuration: {
        instant: "var(--motion-instant)",
        natural: "var(--motion-natural)",
        smooth: "var(--motion-smooth)"
      },
      // Updated to match our iOS physics
      transitionTimingFunction: {
        "ios-bounce": "var(--spring-ios-bounce)",
        "ios-snap": "var(--spring-ios-snap)",
        standard: "var(--ease-standard)"
      },
      zIndex: {
        negative: "var(--z-negative)",
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
      },
      // Complete keyframes matching our animations.css
      keyframes: {
        "drag-lift": {
          "0%": { 
            transform: "scale(1)",
            boxShadow: "var(--shadow-sm)"
          },
          "100%": { 
            transform: "scale(var(--touch-scale-lift))",
            boxShadow: "var(--shadow-lg)"
          }
        },
        "drag-over": {
          "0%": {
            transform: "translateY(0)",
            borderTopColor: "transparent"
          },
          "100%": {
            transform: "translateY(4px)",
            borderTopColor: "currentColor"
          }
        },
        "drag-drop": {
          "0%": { 
            transform: "scale(var(--touch-scale-lift))",
            boxShadow: "var(--shadow-lg)"
          },
          "50%": {
            transform: "scale(var(--touch-scale-drop))",
            boxShadow: "var(--shadow-sm)"
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "var(--shadow-sm)"
          }
        },
        "spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "save-complete": {
          "0%": { 
            transform: "translateY(4px)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          }
        },
        "save-error": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "75%": { transform: "translateX(2px)" }
        }
      },
      animation: {
        "drag-lift": "drag-lift var(--motion-natural) var(--spring-ios-bounce)",
        "drag-over": "drag-over var(--motion-instant) var(--ease-standard)",
        "drag-drop": "drag-drop var(--motion-smooth) var(--spring-ios-snap)",
        "spin": "spin var(--spinner-speed) linear infinite",
        "save-complete": "save-complete var(--feedback-duration) var(--ease-standard)",
        "save-error": "save-error var(--feedback-duration) var(--spring-ios-bounce)"
      }
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        ".ios-momentum-scroll": {
          "-webkit-overflow-scrolling": "touch",
        },
        ".ios-tap-transparent": {
          "-webkit-tap-highlight-color": "transparent",
        },
        ".text-adjust-off": {
          "-webkit-text-size-adjust": "none",
          "text-size-adjust": "none",
        },
      });
    }),
    // Added reduced motion support
    plugin(({ addBase }) => {
      addBase({
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
            'scroll-behavior': 'auto !important'
          }
        }
      })
    })
  ],
} satisfies Config;
