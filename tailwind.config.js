/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Keep the existing accent colors during the v4 migration.
				gray: {"200": "#e5e7eb", "400": "#9ca3af"},
				purple: {"400": "#c084fc"},
				amber: {"400": "#fbbf24"},
				sky: {"400": "#38bdf8"},
				pink: {"400": "#f472b6"},
				slate: {"300": "#cbd5e1", "400": "#94a3b8"},
				emerald: {"300": "#6ee7b7", "400": "#34d399"},
				cyan: {"300": "#67e8f9", "400": "#22d3ee"},
				red: {"400": "#f87171", "500": "#ef4444"},
				green: {"300": "#86efac", "400": "#4ade80", "500": "#22c55e"},
				yellow: {"500": "#eab308"},
				grip: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
					950: '#052e16'
				},
				dark: {
					bg: '#0d1117',
					surface: '#161b22',
					elevated: '#1c2129',
					subtle: '#21262d',
					border: '#30363d',
					text: '#e6edf3',
					muted: '#8b949e'
				}
			},
			fontFamily: {
				sans: ['Outfit', 'system-ui', '-apple-system', 'sans-serif'],
				mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace']
			}
		}
	},
	plugins: []
};
