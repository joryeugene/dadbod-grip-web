import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => [
	{ topic: 'getting-started', page: undefined },
	{ topic: 'keymaps', page: undefined },
	{ topic: 'demo', page: undefined },
	{ topic: 'databases', page: 'postgres' },
	{ topic: 'databases', page: 'duckdb' },
	{ topic: 'databases', page: 'sqlite' },
	{ topic: 'databases', page: 'mysql' },
	{ topic: 'features', page: 'editing' },
	{ topic: 'features', page: 'analysis' },
	{ topic: 'features', page: 'ai' },
	{ topic: 'features', page: 'federation' },
	{ topic: 'features', page: 'files' },
	{ topic: 'features', page: 'watch' },
	{ topic: 'features', page: 'notebooks' },
	{ topic: 'features', page: 'picker' },
	{ topic: 'features', page: 'completion' },
	{ topic: 'features', page: 'schema' }
];

// Glob all docs at build time so Vite can bundle them statically
const docs = import.meta.glob('../../../../docs/**/*.md');

export const load: PageLoad = async ({ params }) => {
	const { topic, page } = params;
	const path = page ? `${topic}/${page}` : topic;
	const key = `../../../../docs/${path}.md`;

	const importer = docs[key];
	if (!importer) {
		error(404, `Doc not found: ${path}`);
	}

	const post = (await importer()) as { default: unknown; metadata?: Record<string, unknown> };
	return {
		content: post.default,
		meta: post.metadata ?? {}
	};
};
