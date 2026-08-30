<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/state';

	const groups = [
		{
			label: 'Getting Started',
			items: [
				{ label: 'Installation', href: `${base}/docs/getting-started` },
				{ label: 'Version 3.10.0', href: `${base}/docs/releases/v3.10.0` },
				{ label: 'Demo Walkthrough', href: `${base}/docs/demo` },
				{ label: 'Connections', href: `${base}/docs/features/connections` },
				{ label: 'Commands', href: `${base}/docs/commands` },
				{ label: 'Keymaps Explorer', href: `${base}/keymaps` },
				{ label: 'Keymaps Reference', href: `${base}/docs/keymaps` },
				{ label: 'Troubleshooting', href: `${base}/docs/troubleshooting` },
				{ label: 'Power Moves', href: `${base}/docs/features/power-moves` }
			]
		},
		{
			label: 'Features',
			items: [
				{ label: 'SQL Notebooks', href: `${base}/docs/features/notebooks` },
				{ label: 'AI Integration', href: `${base}/docs/features/ai` },
				{ label: 'Editing & Mutations', href: `${base}/docs/features/editing` },
				{ label: 'Analysis', href: `${base}/docs/features/analysis` },
				{ label: 'Federation', href: `${base}/docs/features/federation` },
				{ label: 'Files & Remote Sources', href: `${base}/docs/features/files` },
				{ label: 'Watch Mode', href: `${base}/docs/features/watch` },
				{ label: 'Picker Integration', href: `${base}/docs/features/picker` },
				{ label: 'Completion', href: `${base}/docs/features/completion` },
				{ label: 'Schema Operations', href: `${base}/docs/features/schema` }
			]
		},
		{
			label: 'Databases',
			items: [
				{ label: 'PostgreSQL', href: `${base}/docs/databases/postgres` },
				{ label: 'DuckDB', href: `${base}/docs/databases/duckdb` },
				{ label: 'SQLite', href: `${base}/docs/databases/sqlite` },
				{ label: 'MySQL / MariaDB', href: `${base}/docs/databases/mysql` },
				{ label: 'SQL Server', href: `${base}/docs/databases/sqlserver` }
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
							class="block text-sm py-0.5 transition-colors {page.url.pathname === item.href ? 'text-grip-400 font-medium border-l-2 border-grip-400 pl-2 -ml-2' : 'text-dark-muted hover:text-grip-400'}"
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
{/snippet}

<details class="lg:hidden w-full rounded-lg border border-dark-border bg-dark-surface px-4 py-3">
	<summary class="cursor-pointer select-none text-sm font-semibold text-dark-text">Browse documentation</summary>
	<nav aria-label="Documentation" class="mt-4 grid gap-6 border-t border-dark-border pt-4 sm:grid-cols-3">
		{@render links()}
	</nav>
</details>

<aside class="hidden lg:block w-56 shrink-0">
	<nav aria-label="Documentation" class="sticky top-20 space-y-6">
		{@render links()}
	</nav>
</aside>
