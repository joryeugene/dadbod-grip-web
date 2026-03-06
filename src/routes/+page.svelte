<script lang="ts">
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>dadbod-grip.nvim: Editable Database Grids for Neovim</title>
</svelte:head>

<!-- Hero -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col items-center text-center">
	<img src="{base}/mascot.gif" alt="Chonk, the dadbod-grip mascot" class="w-32 h-auto mb-8" />

	<h1 class="text-4xl sm:text-5xl font-bold text-dark-text mb-4 leading-tight">
		Editable database grids<br class="hidden sm:block" />
		<span class="text-grip-400">for Neovim.</span>
	</h1>

	<p class="text-lg text-dark-muted max-w-2xl mb-10 leading-relaxed">
		Connect to Postgres, MySQL, SQLite, DuckDB, or MotherDuck and edit tables like Vim buffers.
		Stage changes, preview SQL, apply in one transaction. Every Vim motion works.
		Nothing installs outside Neovim.
	</p>

	<div class="flex flex-wrap gap-3 justify-center mb-16">
		<a
			href="{base}/docs/getting-started"
			class="px-6 py-2.5 bg-grip-600 hover:bg-grip-500 text-white font-medium rounded-lg transition-colors text-sm"
		>
			Get Started
		</a>
		<a
			href="https://github.com/joryeugene/dadbod-grip.nvim"
			target="_blank"
			rel="noopener noreferrer"
			class="px-6 py-2.5 border border-dark-border hover:border-grip-600 text-dark-muted hover:text-dark-text font-medium rounded-lg transition-colors text-sm"
		>
			GitHub
		</a>
		<a
			href="{base}/docs/demo"
			class="px-6 py-2.5 border border-dark-border hover:border-grip-600 text-dark-muted hover:text-dark-text font-medium rounded-lg transition-colors text-sm"
		>
			See the Demo
		</a>
	</div>

	<!-- Install snippet -->
	<div class="w-full max-w-xl bg-dark-surface border border-dark-border rounded-xl overflow-hidden mb-16">
		<div class="px-4 py-2 border-b border-dark-border text-xs text-dark-muted font-mono flex items-center gap-2">
			<span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
			<span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
			<span class="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
			<span class="ml-2">lazy.nvim</span>
		</div>
		<pre class="px-5 py-4 text-sm font-mono text-dark-text overflow-x-auto"><code><span class="text-dark-muted">-- always latest stable release</span>
<span class="text-grip-400">{"{"} "joryeugene/dadbod-grip.nvim", version = "*" {"}"}</span>

<span class="text-dark-muted">-- then connect</span>
<span class="text-grip-400">:GripConnect</span></code></pre>
	</div>

	<!-- Screenshot -->
	<div class="w-full rounded-xl overflow-hidden border border-dark-border shadow-2xl">
		<img
			src="{base}/live.png"
			alt="dadbod-grip: schema sidebar, query pad, and editable grid with color-coded mutations"
			class="w-full h-auto"
			loading="lazy"
		/>
	</div>
</section>

<!-- DB badges -->
<section class="border-y border-dark-border bg-dark-surface/50 py-10">
	<div class="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-4">
		{#each ['PostgreSQL', 'MySQL', 'SQLite', 'DuckDB', 'MotherDuck', 'Parquet / CSV / S3'] as db}
			<span class="px-4 py-1.5 rounded-full border border-dark-border text-dark-muted text-sm font-mono">
				{db}
			</span>
		{/each}
	</div>
</section>

<!-- Feature grid -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 py-20">
	<h2 class="text-2xl font-bold text-dark-text text-center mb-12">What it does</h2>

	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<!-- Editing -->
		<div class="bg-dark-surface border border-dark-border rounded-xl p-6">
			<h3 class="text-grip-400 font-semibold text-sm uppercase tracking-wider mb-4">Editing</h3>
			<ul class="space-y-2.5 text-sm text-dark-muted">
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Edit cells inline with a popup editor</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Batch-edit multiple rows in visual mode</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Preview the full SQL before any change touches the DB</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Undo committed transactions and reverse changes</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Save queries locally to <code>.grip/queries/</code></li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Write edits back to disk with <code>--write</code></li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Auto-refresh the grid on a timer with <code>--watch</code></li>
			</ul>
		</div>

		<!-- Analysis -->
		<div class="bg-dark-surface border border-dark-border rounded-xl p-6">
			<h3 class="text-grip-400 font-semibold text-sm uppercase tracking-wider mb-4">Analysis</h3>
			<ul class="space-y-2.5 text-sm text-dark-muted">
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Profile column distributions with sparklines</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Explain query plans in plain English</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Watch rows color as you stage: teal, red, green</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> See a live SQL float generate DML as you work</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Diff tables against each other by primary key</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Build column filters with operators and wildcards</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Export results to CSV, JSON, SQL, or Markdown</li>
			</ul>
		</div>

		<!-- Schema & AI -->
		<div class="bg-dark-surface border border-dark-border rounded-xl p-6">
			<h3 class="text-grip-400 font-semibold text-sm uppercase tracking-wider mb-4">Schema & AI</h3>
			<ul class="space-y-2.5 text-sm text-dark-muted">
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Navigate foreign keys through a breadcrumb trail</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Issue DDL through the UI: create, rename, drop</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Browse schema in a sidebar with PK/FK markers</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Explore ER diagrams and follow FK relationships</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Attach multiple databases and JOIN across them</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Generate SQL from natural language via any LLM</li>
				<li class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Open Parquet, CSV, HTTPS, or S3 as live tables</li>
			</ul>
		</div>
	</div>
</section>

<!-- Cross-DB federation callout -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
	<div class="bg-dark-surface border border-grip-600/30 rounded-xl p-8">
		<h2 class="text-xl font-bold text-dark-text mb-3">Cross-database federation</h2>
		<p class="text-dark-muted text-sm mb-6 max-w-2xl">
			Use DuckDB as a hub. Attach Postgres, MySQL, SQLite, or MotherDuck with <code>:GripAttach</code>
			and JOIN across all of them in one query. Parquet files and remote URLs work too.
		</p>
		<pre class="bg-dark-bg rounded-lg p-4 text-sm font-mono text-dark-text overflow-x-auto border border-dark-border"><code><span class="text-dark-muted">:GripAttach postgres:dbname=sales host=localhost user=me  pg</span>
<span class="text-dark-muted">:GripAttach sqlite:legacy.db  legacy</span>

<span class="text-grip-400">SELECT</span> pg.customers.name, legacy.orders.total
<span class="text-grip-400">FROM</span> pg.customers
<span class="text-grip-400">JOIN</span> legacy.orders <span class="text-grip-400">ON</span> pg.customers.id = legacy.orders.customer_id</code></pre>
	</div>
</section>

<!-- CTA strip -->
<section class="border-t border-dark-border py-16 text-center">
	<h2 class="text-2xl font-bold text-dark-text mb-4">Ready to start?</h2>
	<p class="text-dark-muted mb-8">One line in your Neovim config. No external tooling.</p>
	<a
		href="{base}/docs/getting-started"
		class="inline-block px-8 py-3 bg-grip-600 hover:bg-grip-500 text-white font-medium rounded-lg transition-colors"
	>
		Read the docs
	</a>
</section>
