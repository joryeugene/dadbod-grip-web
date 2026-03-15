import { toast } from '$lib/toast.svelte';

const COPY_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
const CHECK_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

export function copyCode(node: HTMLElement) {
	const pres = node.querySelectorAll('pre');
	const buttons: HTMLButtonElement[] = [];

	for (const pre of pres) {
		const el = pre as HTMLElement;
		el.style.position = 'relative';

		const btn = document.createElement('button');
		btn.className = 'copy-btn';
		btn.innerHTML = COPY_ICON;
		btn.setAttribute('aria-label', 'Copy code');
		btn.type = 'button';

		btn.addEventListener('click', async () => {
			const code = el.querySelector('code');
			const text = code?.textContent ?? el.textContent ?? '';
			try {
				await navigator.clipboard.writeText(text);
				btn.innerHTML = CHECK_ICON;
				toast.show('Copied to clipboard');
				setTimeout(() => {
					btn.innerHTML = COPY_ICON;
				}, 2000);
			} catch {
				toast.show('Copy failed');
			}
		});

		el.appendChild(btn);
		buttons.push(btn);
	}

	return {
		destroy() {
			for (const btn of buttons) {
				btn.remove();
			}
		}
	};
}
