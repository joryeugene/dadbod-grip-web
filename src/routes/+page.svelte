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
		Edit database tables<br class="hidden sm:block" />
		<span class="text-grip-400">like Vim buffers.</span>
	</h1>

	<p class="text-lg text-dark-muted max-w-2xl mb-10 leading-relaxed">
		Stage changes. Preview the exact SQL. Apply in one transaction.
		Postgres, MySQL, SQLite, DuckDB, MotherDuck, Parquet, S3.
		Every Vim motion works. Nothing installs outside Neovim.
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
		{#each ['PostgreSQL', 'MySQL', 'SQLite', 'DuckDB', 'MotherDuck', 'Parquet / CSV / S3 / HTTPS'] as db}
			<span class="px-4 py-1.5 rounded-full border border-dark-border text-dark-muted text-sm font-mono">
				{db}
			</span>
		{/each}
	</div>
</section>

<!-- Staging cycle — the core differentiator -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 py-20">
	<div class="text-center mb-12">
		<h2 class="text-2xl font-bold text-dark-text mb-3">Not just a viewer. A full edit cycle.</h2>
		<p class="text-dark-muted max-w-xl mx-auto text-sm">
			Every change stages before it touches the database. Review the SQL. Commit or cancel.
			This is what makes dadbod-grip different from every other database plugin.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center">
			<div class="text-2xl font-mono font-bold text-grip-400 mb-2">i</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Edit</div>
			<div class="text-xs text-dark-muted">Popup editor opens. Change the value, press Enter to stage.</div>
		</div>
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center">
			<div class="text-lg font-mono font-bold mb-2">
				<span class="text-cyan-400">■</span>
				<span class="text-red-400 ml-1">■</span>
				<span class="text-green-400 ml-1">■</span>
			</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Color-coded</div>
			<div class="text-xs text-dark-muted"><span class="text-cyan-400">Teal = update.</span> <span class="text-red-400">Red = delete.</span> <span class="text-green-400">Green = insert.</span> Nothing has run yet.</div>
		</div>
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center">
			<div class="text-2xl font-mono font-bold text-grip-400 mb-2">gl</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Preview SQL</div>
			<div class="text-xs text-dark-muted">Live float shows the exact DML as you work. No surprises.</div>
		</div>
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center">
			<div class="text-2xl font-mono font-bold text-grip-400 mb-2">a</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Apply</div>
			<div class="text-xs text-dark-muted">All changes run in one BEGIN/COMMIT. Any failure rolls back the batch.</div>
		</div>
	</div>

	<div class="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
		<div class="px-4 py-2 border-b border-dark-border text-xs text-dark-muted font-mono flex items-center gap-2">
			<span class="w-2 h-2 rounded-full bg-cyan-400/70"></span>
			<span>live SQL float  (gl)</span>
		</div>
		<pre class="px-5 py-4 text-sm font-mono overflow-x-auto"><code><span class="text-dark-muted">-- 3 staged changes, waiting for `a` to apply</span>

<span class="text-grip-400">BEGIN</span><span class="text-dark-text">;</span>
<span class="text-cyan-400">UPDATE</span><span class="text-dark-text"> orders </span><span class="text-cyan-400">SET</span><span class="text-dark-text"> status = </span><span class="text-green-400">'shipped'</span><span class="text-dark-text"> WHERE id = </span><span class="text-grip-400">42</span><span class="text-dark-text">;</span>
<span class="text-red-400">DELETE FROM</span><span class="text-dark-text"> orders WHERE id = </span><span class="text-grip-400">17</span><span class="text-dark-text">;</span>
<span class="text-green-400">INSERT INTO</span><span class="text-dark-text"> orders (customer_id, total) </span><span class="text-green-400">VALUES</span><span class="text-dark-text"> (</span><span class="text-grip-400">88</span><span class="text-dark-text">, </span><span class="text-grip-400">149.99</span><span class="text-dark-text">);</span>
<span class="text-grip-400">COMMIT</span><span class="text-dark-text">;</span></code></pre>
	</div>
</section>

<!-- Three game-changer cards -->
<section class="border-t border-dark-border bg-dark-surface/30 py-20">
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<h2 class="text-2xl font-bold text-dark-text text-center mb-12">Three things that change how you work</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- 1: Staging -->
			<div class="bg-dark-bg border border-grip-600/40 rounded-xl p-6">
				<div class="text-grip-400 font-mono text-xs uppercase tracking-widest mb-3">01</div>
				<h3 class="text-dark-text font-bold text-base mb-3">Staging transactions</h3>
				<p class="text-dark-muted text-sm leading-relaxed mb-4">
					Stage one change or fifty. The entire batch applies in a single
					transaction. Any failure rolls it all back. Press <code class="text-grip-400">u</code> after
					applying to generate a compensating statement and reverse the commit.
				</p>
				<a href="{base}/docs/features/editing" class="text-grip-400 text-xs hover:underline">Editing docs &rarr;</a>
			</div>

			<!-- 2: Federation -->
			<div class="bg-dark-bg border border-grip-600/40 rounded-xl p-6">
				<div class="text-grip-400 font-mono text-xs uppercase tracking-widest mb-3">02</div>
				<h3 class="text-dark-text font-bold text-base mb-3">Cross-database federation</h3>
				<p class="text-dark-muted text-sm leading-relaxed mb-4">
					Use DuckDB as a hub. Attach Postgres, MySQL, SQLite, MotherDuck, S3
					Parquet, or remote HTTPS files. JOIN across all of them in one SQL
					statement. The results open as a live editable grid.
				</p>
				<a href="{base}/docs/features/federation" class="text-grip-400 text-xs hover:underline">Federation docs &rarr;</a>
			</div>

			<!-- 3: AI -->
			<div class="bg-dark-bg border border-grip-600/40 rounded-xl p-6">
				<div class="text-grip-400 font-mono text-xs uppercase tracking-widest mb-3">03</div>
				<h3 class="text-dark-text font-bold text-base mb-3">AI with full schema context</h3>
				<p class="text-dark-muted text-sm leading-relaxed mb-4">
					Press <code class="text-grip-400">A</code> from the grid or <code class="text-grip-400">gA</code> from
					the query pad. Describe what you want. The AI receives your full schema
					including table names, column types, and FK relationships. Works with
					Anthropic, OpenAI, Gemini, or any local Ollama model.
				</p>
				<a href="{base}/docs/features/ai" class="text-grip-400 text-xs hover:underline">AI docs &rarr;</a>
			</div>
		</div>
	</div>
</section>

<!-- Everything else: compact feature strip -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 py-20">
	<h2 class="text-xl font-bold text-dark-text mb-8">Everything else</h2>

	<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 text-sm text-dark-muted">
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Batch-edit selected rows in visual mode</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Navigate FK relationships with <code>gf</code> / <code>&lt;C-o&gt;</code> back</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Profile column distributions with sparklines (<code>gR</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> ER diagram float for all tables and FK relationships (<code>gG</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Explain query plans with cost and index suggestions (<code>gx</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Filter builder: =, !=, &gt;, &lt;, LIKE, IN, BETWEEN, NULL (<code>gF</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Diff two tables by primary key (<code>gD</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Export to CSV, TSV, JSON, SQL, Markdown, or Grip Table (<code>gE</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Sort stacking with visual indicators (<code>s</code> / <code>S</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Open Parquet, CSV, HTTPS, S3 as live tables (<code>:GripOpen</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Watch mode: auto-refresh on a timer (<code>gW</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Write mode: edits persist back to file on disk (<code>g!</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Schema sidebar with PK/FK markers and 1-9 tab views</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> SQL completion in query pad: tables, columns, aliases, federation schemas</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Save and load named queries (<code>:GripSave</code> / <code>gq</code>)</div>
		<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span> Multi-level undo inside staging, undo of applied transactions</div>
	</div>
</section>

<!-- Cross-DB federation code demo -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
	<div class="bg-dark-surface border border-grip-600/30 rounded-xl p-8">
		<h2 class="text-xl font-bold text-dark-text mb-2">Query three databases in one statement</h2>
		<p class="text-dark-muted text-sm mb-6 max-w-2xl">
			Attach any combination of databases to a DuckDB session. Every attachment
			gets a schema prefix. JOIN across them like they are local tables.
		</p>
		<pre class="bg-dark-bg rounded-lg p-4 text-sm font-mono text-dark-text overflow-x-auto border border-dark-border"><code><span class="text-dark-muted">-- attach your sources</span>
<span class="text-grip-400">:GripAttach</span> <span class="text-dark-text">postgres:dbname=production host=db.internal user=app  prod</span>
<span class="text-grip-400">:GripAttach</span> <span class="text-dark-text">sqlite:archive.db  legacy</span>
<span class="text-grip-400">:GripAttach</span> <span class="text-dark-text">s3://my-bucket/enrichment.parquet  enrichment</span>

<span class="text-dark-muted">-- then JOIN in the query pad (C-CR to run)</span>
<span class="text-grip-400">SELECT</span>
<span class="text-dark-text">  prod.customers.email,</span>
<span class="text-dark-text">  legacy.orders.total,</span>
<span class="text-dark-text">  enrichment.data.segment</span>
<span class="text-grip-400">FROM</span> <span class="text-dark-text">prod.customers</span>
<span class="text-grip-400">JOIN</span> <span class="text-dark-text">legacy.orders </span><span class="text-grip-400">ON</span><span class="text-dark-text"> legacy.orders.customer_id = prod.customers.id</span>
<span class="text-grip-400">JOIN</span> <span class="text-dark-text">enrichment.data </span><span class="text-grip-400">ON</span><span class="text-dark-text"> enrichment.data.email = prod.customers.email</span></code></pre>
	</div>
</section>

<!-- Install snippet -->
<section class="border-t border-dark-border py-20">
	<div class="max-w-xl mx-auto px-4 sm:px-6">
		<h2 class="text-2xl font-bold text-dark-text text-center mb-8">One line to install</h2>
		<div class="bg-dark-surface border border-dark-border rounded-xl overflow-hidden mb-8">
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
		<div class="text-center">
			<a
				href="{base}/docs/getting-started"
				class="inline-block px-8 py-3 bg-grip-600 hover:bg-grip-500 text-white font-medium rounded-lg transition-colors"
			>
				Read the docs
			</a>
		</div>
	</div>
</section>
