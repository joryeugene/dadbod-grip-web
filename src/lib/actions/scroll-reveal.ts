interface ScrollRevealOptions {
	threshold?: number;
	delay?: number;
}

export function scrollReveal(node: HTMLElement, options: ScrollRevealOptions = {}) {
	const { threshold = 0.15, delay = 0 } = options;

	// Respect reduced motion
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('sr-visible');
		return {};
	}

	node.classList.add('sr-hidden');

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					if (delay > 0) {
						setTimeout(() => {
							node.classList.remove('sr-hidden');
							node.classList.add('sr-visible');
						}, delay);
					} else {
						node.classList.remove('sr-hidden');
						node.classList.add('sr-visible');
					}
					observer.unobserve(node);
				}
			}
		},
		{ threshold }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
