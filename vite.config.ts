import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: path.resolve(__dirname, 'src/mdsvex/docs.svelte')
	},
	rehypePlugins: [rehypeSlug]
};

export default defineConfig({
	plugins: [tailwindcss(), sveltekit({
		extensions: ['.svelte', '.md'],
		preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
		adapter: adapter({ fallback: '404.html' }),
		paths: { base: process.env.NODE_ENV === 'production' ? '/dadbod-grip-web' : '' }
	})]
});
