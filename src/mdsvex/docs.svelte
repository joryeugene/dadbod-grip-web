<script lang="ts">
	import { base } from '$app/paths';

	let { children, title = '', description = '' } = $props();

	const sidebar = [
		{
			label: 'Getting Started',
			items: [
				{ label: 'Installation', href: `${base}/docs/getting-started` },
				{ label: 'Keymaps Reference', href: `${base}/docs/keymaps` },
				{ label: 'Demo Walkthrough', href: `${base}/docs/demo` }
			]
		},
		{
			label: 'Databases',
			items: [
				{ label: 'PostgreSQL', href: `${base}/docs/databases/postgres` },
				{ label: 'DuckDB', href: `${base}/docs/databases/duckdb` },
				{ label: 'SQLite', href: `${base}/docs/databases/sqlite` },
				{ label: 'MySQL', href: `${base}/docs/databases/mysql` }
			]
		},
		{
			label: 'Features',
			items: [
				{ label: 'Editing & Mutations', href: `${base}/docs/features/editing` },
				{ label: 'Analysis', href: `${base}/docs/features/analysis` },
				{ label: 'AI Integration', href: `${base}/docs/features/ai` },
				{ label: 'Federation', href: `${base}/docs/features/federation` }
			]
		}
	];
</script>

<svelte:head>
	<title>{title ? `${title} - dadbod-grip.nvim` : 'dadbod-grip.nvim docs'}</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>

<div class="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex gap-10">
	<!-- Sidebar -->
	<aside class="hidden lg:block w-56 shrink-0">
		<nav class="sticky top-20 space-y-6">
			{#each sidebar as group}
				<div>
					<p class="text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">{group.label}</p>
					<ul class="space-y-1">
						{#each group.items as item}
							<li>
								<a
									href={item.href}
									class="block text-sm text-dark-muted hover:text-grip-400 py-0.5 transition-colors"
								>
									{item.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</nav>
	</aside>

	<!-- Content -->
	<main class="flex-1 min-w-0 prose max-w-3xl">
		{@render children()}
	</main>
</div>
