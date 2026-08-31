<script lang="ts">
	import { base } from '$app/paths';
	import { copyCode } from '$lib/actions/copy-code';
	import { scrollReveal } from '$lib/actions/scroll-reveal';

	// ── Interactive staging demo state ──────────────────────────
	interface DemoRow {
		id: number;
		name: string;
		status: string;
		total: string;
	}

	interface Mutation {
		type: 'update' | 'delete' | 'insert';
		rowId: number;
		column?: string;
		oldValue?: string;
		newValue?: string;
		row?: DemoRow;
	}

	const INITIAL_ROWS: DemoRow[] = [
		{ id: 42, name: 'Alice Chen', status: 'pending', total: '149.99' },
		{ id: 43, name: 'Bob Park', status: 'shipped', total: '89.50' },
		{ id: 44, name: 'Carol Diaz', status: 'pending', total: '234.00' },
		{ id: 45, name: 'Dan Kim', status: 'returned', total: '67.25' },
		{ id: 46, name: 'Eve Lu', status: 'shipped', total: '412.80' }
	];

	const COLUMNS: (keyof DemoRow)[] = ['id', 'name', 'status', 'total'];

	let rows = $state<DemoRow[]>(structuredClone(INITIAL_ROWS));
	let mutations = $state<Mutation[]>([]);
	let editingCell = $state<{ rowId: number; column: string } | null>(null);
	let editValue = $state('');
	let nextId = $state(47);
	let applied = $state(false);

	function isDeleted(rowId: number): boolean {
		return mutations.some((m) => m.type === 'delete' && m.rowId === rowId);
	}

	function isInserted(rowId: number): boolean {
		return mutations.some((m) => m.type === 'insert' && m.rowId === rowId);
	}

	function isUpdated(rowId: number, column: string): boolean {
		return mutations.some((m) => m.type === 'update' && m.rowId === rowId && m.column === column);
	}

	function startEdit(rowId: number, column: string, currentValue: string) {
		if (column === 'id' || isDeleted(rowId)) return;
		editingCell = { rowId, column };
		editValue = currentValue;
	}

	function commitEdit() {
		if (!editingCell) return;
		const row = rows.find((r) => r.id === editingCell!.rowId);
		if (!row) return;
		const col = editingCell.column as keyof DemoRow;
		const oldValue = row[col];
		if (editValue !== oldValue) {
			// Remove any previous update for same cell
			mutations = mutations.filter(
				(m) => !(m.type === 'update' && m.rowId === editingCell!.rowId && m.column === col)
			);
			mutations = [
				...mutations,
				{
					type: 'update',
					rowId: editingCell.rowId,
					column: col,
					oldValue: String(oldValue),
					newValue: editValue
				}
			];
			(row as any)[col] = editValue;
		}
		editingCell = null;
	}

	function cancelEdit() {
		editingCell = null;
	}

	function toggleDelete(rowId: number) {
		const existing = mutations.findIndex((m) => m.type === 'delete' && m.rowId === rowId);
		if (existing >= 0) {
			mutations = mutations.filter((_, i) => i !== existing);
		} else {
			mutations = [...mutations, { type: 'delete', rowId }];
		}
	}

	function insertRow() {
		const newRow: DemoRow = {
			id: nextId,
			name: 'New Customer',
			status: 'pending',
			total: '0.00'
		};
		rows = [...rows, newRow];
		mutations = [...mutations, { type: 'insert', rowId: nextId, row: newRow }];
		nextId++;
	}

	function resetDemo() {
		rows = structuredClone(INITIAL_ROWS);
		mutations = [];
		editingCell = null;
		editValue = '';
		nextId = 47;
		applied = false;
	}

	function applyDemo() {
		applied = true;
		setTimeout(() => {
			resetDemo();
		}, 1800);
	}

	let stagedSql = $derived.by(() => {
		if (mutations.length === 0) return [];
		const lines: { text: string; color: string }[] = [];
		lines.push({ text: 'BEGIN;', color: 'text-grip-400' });
		for (const m of mutations) {
			if (m.type === 'update') {
				lines.push({
					text: `UPDATE orders SET ${m.column} = '${m.newValue}' WHERE id = ${m.rowId};`,
					color: 'text-cyan-400'
				});
			} else if (m.type === 'delete') {
				lines.push({
					text: `DELETE FROM orders WHERE id = ${m.rowId};`,
					color: 'text-red-400'
				});
			} else if (m.type === 'insert' && m.row) {
				lines.push({
					text: `INSERT INTO orders (name, status, total) VALUES ('${m.row.name}', '${m.row.status}', '${m.row.total}');`,
					color: 'text-green-400'
				});
			}
		}
		lines.push({ text: 'COMMIT;', color: 'text-grip-400' });
		return lines;
	});
</script>

<svelte:head>
	<title>dadbod-grip.nvim: Editable Database Grids for Neovim</title>
</svelte:head>

<div use:copyCode>
<!-- Hero -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col items-center text-center">
	<img src="{base}/mascot.gif" alt="Chonk, the dadbod-grip mascot" class="w-32 h-auto mb-8 shrink-0" />

	<img
		src="{base}/brand/dadbod-grip-wordmark.png"
		alt="Dadbod Grip"
		width="908"
		height="345"
		class="block w-full max-w-[520px] h-auto mb-10"
	/>

	<h1 class="font-sans text-4xl sm:text-5xl font-bold text-dark-text mb-4 leading-tight">
		Edit database tables<br class="hidden sm:block" />
		<span class="text-grip-400">like Vim buffers.</span>
	</h1>

	<p class="text-lg text-dark-muted max-w-2xl mb-10 leading-relaxed">
		Dadbod Grip turns database tables into editable Vim buffers, with schema browsing,
		staged mutations, generated SQL, relationship navigation, and cross-database
		federation inside Neovim.
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
<section class="border-y border-dark-border bg-dark-surface/50 py-10" use:scrollReveal>
	<div class="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-4">
		{#each ['PostgreSQL', 'MySQL / MariaDB', 'SQL Server', 'SQLite', 'DuckDB / MotherDuck', 'Files / S3 / HTTPS'] as db}
			<span class="px-4 py-1.5 rounded-full border border-dark-border text-dark-muted text-sm font-mono">
				{db}
			</span>
		{/each}
	</div>
</section>

<!-- Staging cycle -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 py-20">
	<div class="text-center mb-12" use:scrollReveal>
		<h2 class="font-sans text-2xl font-bold text-dark-text mb-3">Review the write before it runs.</h2>
		<p class="text-dark-muted max-w-xl mx-auto text-sm">
			Every change stages before it touches the database. Review the SQL. Commit or cancel.
			The grid keeps investigation fast and makes the write visible before it runs.
		</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center" use:scrollReveal>
			<div class="text-2xl font-mono font-bold text-grip-400 mb-2">i</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Edit</div>
			<div class="text-xs text-dark-muted">The popup editor opens on the cell. Change the value and press Enter to stage it.</div>
		</div>
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center" use:scrollReveal={{ delay: 100 }}>
			<div class="text-lg font-mono font-bold mb-2">
				<span class="text-cyan-400">■</span>
				<span class="text-red-400 ml-1">■</span>
				<span class="text-green-400 ml-1">■</span>
			</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Color-coded</div>
			<div class="text-xs text-dark-muted"><span class="text-cyan-400">Teal marks an update.</span> <span class="text-red-400">Red marks a deletion.</span> <span class="text-green-400">Green marks an insertion.</span> Nothing has run yet.</div>
		</div>
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center" use:scrollReveal={{ delay: 200 }}>
			<div class="text-2xl font-mono font-bold text-grip-400 mb-2">gl</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Preview SQL</div>
			<div class="text-xs text-dark-muted">The live float shows the exact DML as you work. It does not execute the SQL.</div>
		</div>
		<div class="bg-dark-surface border border-dark-border rounded-xl p-5 text-center" use:scrollReveal={{ delay: 300 }}>
			<div class="text-2xl font-mono font-bold text-grip-400 mb-2">a</div>
			<div class="text-sm font-semibold text-dark-text mb-1">Apply</div>
			<div class="text-xs text-dark-muted">Dadbod Grip sends one BEGIN/COMMIT batch. If the client reports an error, inspect the database before retrying.</div>
		</div>
	</div>

	<div class="bg-dark-surface border border-dark-border rounded-xl overflow-hidden" use:scrollReveal={{ delay: 400 }}>
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

<!-- Interactive staging demo -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 pb-20" use:scrollReveal>
	<div class="text-center mb-8">
		<p class="text-dark-muted text-sm">Click any cell. Delete a row. Insert one. Watch the SQL update live.</p>
	</div>

	<div class="bg-dark-surface border border-dark-border rounded-xl overflow-hidden {applied ? 'ring-2 ring-grip-400/60 transition-all duration-300' : ''}">
		<!-- Grid table -->
		<div class="overflow-x-auto">
			<table class="w-full text-sm font-mono">
				<thead>
					<tr class="border-b border-dark-border">
						{#each COLUMNS as col}
							<th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-dark-muted">
								{col}
							</th>
						{/each}
						<th class="px-4 py-2.5 w-10"></th>
					</tr>
				</thead>
				<tbody>
					{#each rows as row (row.id)}
						{@const deleted = isDeleted(row.id)}
						{@const inserted = isInserted(row.id)}
						<tr class="border-b border-dark-border/50 {deleted ? 'bg-red-400/5' : inserted ? 'bg-green-400/5' : 'hover:bg-dark-border/20'} transition-colors">
							{#each COLUMNS as col}
								{@const updated = isUpdated(row.id, col)}
								<td
									class="px-4 py-2 {deleted ? 'text-red-400 line-through opacity-60' : inserted ? 'text-green-400' : updated ? 'text-cyan-400' : 'text-dark-text'} {col !== 'id' && !deleted ? 'cursor-pointer' : ''}"
									onclick={() => startEdit(row.id, col, String(row[col]))}
								>
									{#if editingCell && editingCell.rowId === row.id && editingCell.column === col}
										<!-- svelte-ignore a11y_autofocus -->
										<input
											type="text"
											bind:value={editValue}
											autofocus
											class="bg-dark-bg border border-grip-400/50 rounded px-1.5 py-0.5 text-cyan-400 outline-none w-full max-w-[140px]"
											onkeydown={(e) => {
												if (e.key === 'Enter') commitEdit();
												if (e.key === 'Escape') cancelEdit();
											}}
											onblur={() => commitEdit()}
										/>
									{:else}
										{row[col]}
									{/if}
								</td>
							{/each}
							<td class="px-4 py-2 text-center">
								{#if !inserted}
									<button
										class="text-dark-muted hover:text-red-400 transition-colors text-xs"
										onclick={() => toggleDelete(row.id)}
										title={deleted ? 'Undo delete' : 'Stage delete'}
									>
										{deleted ? '↩' : '✕'}
									</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Action bar -->
		<div class="flex items-center gap-3 px-4 py-3 border-t border-dark-border bg-dark-bg/50">
			<button
				class="text-xs text-green-400 hover:text-green-300 font-mono transition-colors"
				onclick={insertRow}
			>
				+ INSERT
			</button>
			<div class="flex-1"></div>
			{#if mutations.length > 0}
				<span class="text-xs text-dark-muted">{mutations.length} staged</span>
			{/if}
			<button
				class="text-xs text-dark-muted hover:text-dark-text font-mono transition-colors"
				onclick={resetDemo}
			>
				Reset
			</button>
			<button
				class="text-xs px-3 py-1 rounded font-mono transition-colors {mutations.length > 0 ? 'bg-grip-600 hover:bg-grip-500 text-white' : 'bg-dark-border text-dark-muted cursor-not-allowed'}"
				onclick={applyDemo}
				disabled={mutations.length === 0 || applied}
			>
				{applied ? 'Committed.' : 'Apply'}
			</button>
		</div>

		<!-- SQL panel -->
		{#if stagedSql.length > 0}
			<div class="border-t border-dark-border">
				<div class="px-4 py-1.5 border-b border-dark-border/50 text-xs text-dark-muted font-mono flex items-center gap-2">
					<span class="w-1.5 h-1.5 rounded-full bg-cyan-400/70"></span>
					staged SQL
				</div>
				<pre class="px-4 py-3 text-xs font-mono overflow-x-auto">{#each stagedSql as line}<span class={line.color}>{line.text}</span>{'\n'}{/each}</pre>
			</div>
		{/if}
	</div>
</section>

<!-- Primary workflows -->
<section class="border-t border-dark-border bg-dark-surface/30 py-20">
	<div class="max-w-6xl mx-auto px-4 sm:px-6">
		<h2 class="font-sans text-2xl font-bold text-dark-text text-center mb-12">The database work stays in one workspace.</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<!-- 1: Staging -->
			<div class="bg-dark-bg border border-grip-600/40 rounded-xl p-6" use:scrollReveal>
				<div class="text-grip-400 font-mono text-xs uppercase tracking-widest mb-3">01</div>
				<h3 class="text-dark-text font-bold text-base mb-3">Staged mutations stay visible.</h3>
				<p class="text-dark-muted text-sm leading-relaxed mb-4">
					Stage one change or fifty, then inspect the generated SQL. Dadbod Grip
					sends one BEGIN/COMMIT batch and keeps the staging state when the client
					reports an error, so you can inspect the database before retrying.
				</p>
				<a href="{base}/docs/features/editing" class="text-grip-400 text-xs hover:underline">Editing docs &rarr;</a>
			</div>

			<!-- 2: Federation -->
			<div class="bg-dark-bg border border-grip-600/40 rounded-xl p-6" use:scrollReveal={{ delay: 120 }}>
				<div class="text-grip-400 font-mono text-xs uppercase tracking-widest mb-3">02</div>
				<h3 class="text-dark-text font-bold text-base mb-3">DuckDB joins the sources.</h3>
				<p class="text-dark-muted text-sm leading-relaxed mb-4">
					Use DuckDB as a hub for PostgreSQL, MySQL, SQLite, MotherDuck, local
					files, S3 objects, and HTTPS sources. SQL and attachment credentials
					travel through standard input instead of process arguments.
				</p>
				<a href="{base}/docs/features/federation" class="text-grip-400 text-xs hover:underline">Federation docs &rarr;</a>
			</div>

			<!-- 3: AI -->
			<div class="bg-dark-bg border border-grip-600/40 rounded-xl p-6" use:scrollReveal={{ delay: 240 }}>
				<div class="text-grip-400 font-mono text-xs uppercase tracking-widest mb-3">03</div>
				<h3 class="text-dark-text font-bold text-base mb-3">AI generates SQL, not approval.</h3>
				<p class="text-dark-muted text-sm leading-relaxed mb-4">
					<code class="text-grip-400">A</code>, or <code class="text-grip-400">gA</code> in the query pad,
					sends the request, current SQL, and cached schema metadata to the configured provider.
					The request travels through curl config on standard input. Generated SQL
					returns for review and does not run automatically. Grid
					<code class="text-grip-400">gA</code> stages generated rows instead.
				</p>
				<a href="{base}/docs/features/ai" class="text-grip-400 text-xs hover:underline">AI docs &rarr;</a>
			</div>
		</div>
	</div>
</section>

<!-- Additional workflows -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 py-20">
	<h2 class="font-sans text-xl font-bold text-dark-text mb-10">The rest of the workflow stays keyboard-native.</h2>

	<div class="space-y-8">
		<!-- Editing -->
		<div use:scrollReveal>
			<p class="text-xs font-semibold uppercase tracking-wider text-dark-muted mb-3">Editing</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-sm text-dark-muted">
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">Visual mode stages one edit across selected rows.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">The staging buffer supports multi-level undo, and applied batches produce best-effort compensating SQL.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">DDL actions rename, add, and drop columns and tables after showing the statement.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gA</code> or <code>:GripFill</code> sends the active schema to the configured provider and stages its returned rows for review.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>:GripToggle</code> closes or restores the Dadbod Grip windows.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">Conditional formatting marks negative numbers, booleans, dates, and URLs without changing their values.</span></div>
			</div>
		</div>

		<!-- Navigation -->
		<div use:scrollReveal={{ delay: 80 }}>
			<p class="text-xs font-semibold uppercase tracking-wider text-dark-muted mb-3">Navigation</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-sm text-dark-muted">
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gf</code> follows an outgoing foreign key, <code>gm</code> follows incoming references, and <code>&lt;C-o&gt;</code> returns.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">The schema sidebar marks primary and foreign keys and opens table-depth views with keys <code>1</code> through <code>9</code>.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>&lt;C-p&gt;</code> searches the actions available on the current surface.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>K</code> turns the current row into a vertical key-value record.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gG</code> opens an ER map of the tables and their foreign-key relationships.</span></div>
			</div>
		</div>

		<!-- Analysis -->
		<div use:scrollReveal={{ delay: 160 }}>
			<p class="text-xs font-semibold uppercase tracking-wider text-dark-muted mb-3">Analysis</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-sm text-dark-muted">
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gR</code> profiles distributions, completeness, and cardinality across the table.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gQ</code> turns an <code>EXPLAIN</code> plan into cost bars and heuristic index suggestions.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gD</code> compares two tables by primary key.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>s</code> changes the primary sort, while <code>S</code> adds another sort tier.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gF</code> builds filters for equality, ranges, patterns, sets, and null values.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gP</code> saves the active filters, and <code>gp</code> restores a preset.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gx</code> opens an HTTP, HTTPS, or FTP URL from the current cell.</span></div>
			</div>
		</div>

		<!-- Integration -->
		<div use:scrollReveal={{ delay: 240 }}>
			<p class="text-xs font-semibold uppercase tracking-wider text-dark-muted mb-3">Integration</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-sm text-dark-muted">
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">Built-in SQL completion includes tables, columns, aliases, and attached schemas.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">The <code>picker</code> option delegates supported lists to Telescope or snacks.nvim.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">blink.cmp and nvim-cmp can consume Dadbod Grip's completion source.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gn</code> opens a SQL notebook, and <code>&lt;C-CR&gt;</code> runs the block under the cursor.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0">Saved queries bind to opaque connection IDs instead of copied database URLs.</span></div>
			</div>
		</div>

		<!-- I/O -->
		<div use:scrollReveal={{ delay: 320 }}>
			<p class="text-xs font-semibold uppercase tracking-wider text-dark-muted mb-3">I/O</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-2 text-sm text-dark-muted">
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gE</code> and <code>gX</code> export the current page or every filtered and sorted row.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>:GripOpen</code> reads Parquet, CSV, JSON, Excel, ORC, Arrow, IPC, HTTPS, and S3 sources through DuckDB.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>gW</code> reruns a file query on a timer while no edits are staged.</span></div>
				<div class="flex gap-2"><span class="text-grip-400 shrink-0">+</span><span class="min-w-0"><code>g!</code> enables write mode for supported local files.</span></div>
			</div>
		</div>
	</div>
</section>

<!-- Cross-DB federation code demo -->
<section class="max-w-6xl mx-auto px-4 sm:px-6 pb-20" use:scrollReveal>
	<div class="bg-dark-surface border border-grip-600/30 rounded-xl p-8">
		<h2 class="font-sans text-xl font-bold text-dark-text mb-2">Query three databases in one statement</h2>
		<p class="text-dark-muted text-sm mb-6 max-w-2xl">
			Attach any combination of databases to a DuckDB session. Every attachment
			gets a schema prefix. JOIN across them like they are local tables.
		</p>
		<pre class="bg-dark-bg rounded-lg p-4 text-sm font-mono text-dark-text overflow-x-auto border border-dark-border"><code><span class="text-dark-muted">-- attach your sources</span>
<span class="text-grip-400">:GripAttach</span> <span class="text-dark-text">postgres:dbname=production host=db.internal user=app  prod</span>
<span class="text-grip-400">:GripAttach</span> <span class="text-dark-text">sqlite:archive.db  legacy</span>
<span class="text-grip-400">:GripAttach</span> <span class="text-dark-text">s3://my-bucket/enrichment.parquet  enrichment</span>

<span class="text-dark-muted">-- then JOIN in the query pad (&lt;C-CR&gt; to run)</span>
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
<section class="border-t border-dark-border py-20" use:scrollReveal>
	<div class="max-w-xl mx-auto px-4 sm:px-6">
		<h2 class="font-sans text-2xl font-bold text-dark-text text-center mb-8">Load the plugin with Lazy.</h2>
		<div class="bg-dark-surface border border-dark-border rounded-xl overflow-hidden mb-8">
			<div class="px-4 py-2 border-b border-dark-border text-xs text-dark-muted font-mono flex items-center gap-2">
				<span class="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
				<span class="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
				<span class="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
				<span class="ml-2">lazy.nvim</span>
			</div>
			<pre class="px-5 py-4 text-sm font-mono text-dark-text overflow-x-auto"><code><span class="text-dark-muted">-- lazy.nvim</span>
<span class="text-grip-400">{"{"} "joryeugene/dadbod-grip.nvim" {"}"}</span>

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
</div>
