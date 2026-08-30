<script lang="ts">
	import { copyCode } from '$lib/actions/copy-code';
	import DocsNav from '$lib/components/DocsNav.svelte';

	let { children, title = '', description = '' } = $props();
</script>

<svelte:head>
	<title>{title ? `${title} - dadbod-grip.nvim` : 'dadbod-grip.nvim docs'}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
	<DocsNav />

	<!-- Content -->
	<main class="flex-1 min-w-0 prose max-w-3xl" use:copyCode>
		{@render children()}
	</main>
</div>
