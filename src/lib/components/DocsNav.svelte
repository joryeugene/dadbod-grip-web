<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const groups = [
		{
			label: 'Getting Started',
			items: [
				{ label: 'Installation', href: resolve('docs/getting-started') },
				{ label: 'Demo Walkthrough', href: resolve('docs/demo') },
				{ label: 'Connections', href: resolve('docs/features/connections') }
			]
		},
		{
			label: 'Features',
			items: [
				{ label: 'SQL Notebooks', href: resolve('docs/features/notebooks') },
				{ label: 'AI Integration', href: resolve('docs/features/ai') },
				{ label: 'Editing & Mutations', href: resolve('docs/features/editing') },
				{ label: 'Analysis', href: resolve('docs/features/analysis') },
				{ label: 'Federation', href: resolve('docs/features/federation') },
				{ label: 'Files & Remote Sources', href: resolve('docs/features/files') },
				{ label: 'Watch Mode', href: resolve('docs/features/watch') },
				{ label: 'Picker Integration', href: resolve('docs/features/picker') },
				{ label: 'Completion', href: resolve('docs/features/completion') },
				{ label: 'Schema Operations', href: resolve('docs/features/schema') },
				{ label: 'Power Moves', href: resolve('docs/features/power-moves') }
			]
		},
		{
			label: 'Databases',
			items: [
				{ label: 'PostgreSQL', href: resolve('docs/databases/postgres') },
				{ label: 'DuckDB', href: resolve('docs/databases/duckdb') },
				{ label: 'SQLite', href: resolve('docs/databases/sqlite') },
				{ label: 'MySQL / MariaDB', href: resolve('docs/databases/mysql') },
				{ label: 'SQL Server', href: resolve('docs/databases/sqlserver') }
			]
		},
		{
			label: 'Reference',
			items: [
				{ label: 'Commands', href: resolve('docs/commands') },
				{ label: 'Keymaps Explorer', href: resolve('/keymaps') },
				{ label: 'Keymaps Reference', href: resolve('docs/keymaps') },
				{ label: 'Troubleshooting', href: resolve('docs/troubleshooting') }
			]
		}
	];
</script>

{#snippet links()}
	{#each groups as group}
		<div>
			<p class="text-xs font-semibold uppercase tracking-wider text-dark-muted mb-2">{group.label}</p>
			<ul class="space-y-1">
				{#each group.items as item}
					<li>
						<a
							href={item.href}
							class="block text-sm py-0.5 transition-colors {page.url.pathname === new URL(item.href, page.url.href).pathname ? 'text-grip-400 font-medium border-l-2 border-grip-400 pl-2 -ml-2' : 'text-dark-muted hover:text-grip-400'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
{/snippet}

<details class="sticky top-16 z-40 lg:hidden w-full rounded-lg border border-dark-border bg-dark-surface px-4 py-3">
	<summary class="cursor-pointer select-none text-sm font-semibold text-dark-text">Browse documentation</summary>
	<nav aria-label="Documentation" class="mt-4 grid max-h-[calc(100vh-8rem)] gap-6 overflow-y-auto overscroll-contain border-t border-dark-border pt-4 pr-1 sm:grid-cols-2">
		{@render links()}
	</nav>
</details>

<aside class="hidden lg:block w-56 shrink-0">
	<nav aria-label="Documentation" class="sticky top-20 space-y-6">
		{@render links()}
	</nav>
</aside>
