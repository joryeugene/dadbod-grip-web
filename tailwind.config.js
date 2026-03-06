/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				grip: {
					50: '#f0fdf4',
					100: '#dcfce7',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					900: '#14532d',
					950: '#052e16'
				},
				dark: {
					bg: '#0d1117',
					surface: '#161b22',
					border: '#30363d',
					text: '#e6edf3',
					muted: '#8b949e'
				}
			},
			fontFamily: {
				mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace']
			}
		}
	},
	plugins: []
};
