<script lang="ts">
	import { base } from '$app/paths';
	import {
		keymaps,
		SURFACE_LABELS,
		SURFACE_COLORS,
		CATEGORIES,
		type Surface,
		type Keymap
	} from '$lib/keymaps-data';

	// ── State ──
	let search = $state('');
	let activeSurface = $state<Surface | 'all'>('all');
	let activeCategory = $state<string | 'all'>('all');
	let selectedKeymap = $state<Keymap | null>(null);
	let activeKeyFilter = $state<string | null>(null); // exact key filter from keyboard clicks

	// ── Vim sequence simulator ──
	let typeModeActive = $state(false);
	let sequenceBuffer = $state<string[]>([]);
	let sequenceDisplay = $state('');
	let sequenceState = $state<'idle' | 'waiting' | 'matched' | 'nomatch'>('idle');
	let sequenceTimeout: ReturnType<typeof setTimeout> | undefined;
	let matchedKeys = $state<Set<string>>(new Set());

	function mapBrowserKey(e: KeyboardEvent): string | null {
		if (e.key === 'Escape') return null; // handled separately
		if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return null;
		if (e.ctrlKey && e.key === 'Enter') return 'C-CR';
		if (e.ctrlKey) return `C-${e.key.toLowerCase()}`;
		if (e.key === 'Enter') return 'CR';
		if (e.key === 'Tab') return 'Tab';
		if (e.key === 'Backspace') return null;
		return e.key;
	}

	function getKeymapsForSurface(): Keymap[] {
		return activeSurface === 'all'
			? keymaps
			: keymaps.filter(k => k.surfaces.includes(activeSurface as Surface));
	}

	function findExactMatch(seq: string): Keymap | undefined {
		return getKeymapsForSurface().find(k => k.key === seq);
	}

	function isPrefix(seq: string): boolean {
		return getKeymapsForSurface().some(k => k.key.startsWith(seq) && k.key !== seq);
	}

	function keysInSequence(seq: string): Set<string> {
		const result = new Set<string>();
		for (const ch of seq) {
			result.add(ch);
		}
		if (seq.startsWith('C-')) result.add('Ctrl');
		if (seq === 'CR' || seq.endsWith('-CR')) result.add('CR');
		if (seq === 'Tab') result.add('Tab');
		if (seq === 'S-Tab') { result.add('Tab'); result.add('Shift'); }
		return result;
	}

	function clearSequence() {
		if (sequenceTimeout) clearTimeout(sequenceTimeout);
		sequenceBuffer = [];
		sequenceDisplay = '';
		sequenceState = 'idle';
		matchedKeys = new Set();
	}

	function handleSequenceKey(e: KeyboardEvent) {
		if (!typeModeActive) return;

		// Escape: clear buffer or deactivate type mode
		if (e.key === 'Escape') {
			e.preventDefault();
			if (sequenceBuffer.length > 0) {
				clearSequence();
			} else {
				typeModeActive = false;
				clearSequence();
			}
			return;
		}

		const mapped = mapBrowserKey(e);
		if (!mapped) return;

		// Prevent browser defaults for mapped keys
		e.preventDefault();

		if (sequenceTimeout) clearTimeout(sequenceTimeout);

		sequenceBuffer = [...sequenceBuffer, mapped];
		const candidate = sequenceBuffer.join('');
		sequenceDisplay = sequenceBuffer.join(' ');

		const exact = findExactMatch(candidate);
		if (exact) {
			sequenceState = 'matched';
			matchedKeys = keysInSequence(candidate);
			selectedKeymap = exact;
			activeKeyFilter = null;

			setTimeout(() => {
				clearSequence();
			}, 1200);
			return;
		}

		if (isPrefix(candidate)) {
			sequenceState = 'waiting';
			matchedKeys = keysInSequence(candidate);
			// Filter the table to show prefix matches
			activeKeyFilter = sequenceBuffer[0];
			search = '';

			sequenceTimeout = setTimeout(() => {
				clearSequence();
			}, 1500);
			return;
		}

		// No match, no prefix
		sequenceState = 'nomatch';
		matchedKeys = keysInSequence(candidate);
		setTimeout(() => {
			clearSequence();
		}, 600);
	}

	function getSequenceKeyState(keyChar: string): 'none' | 'waiting' | 'matched' | 'nomatch' {
		if (!typeModeActive || sequenceState === 'idle') return 'none';
		if (!matchedKeys.has(keyChar)) return 'none';
		return sequenceState;
	}

	// ── Keyboard layout ──
	// Standard QWERTY rows with display labels and logical key names
	const keyboardRows = [
		[
			{ display: 'Esc', key: 'Esc', w: 1.5 },
			{ display: '1', key: '1', w: 1 }, { display: '2', key: '2', w: 1 },
			{ display: '3', key: '3', w: 1 }, { display: '4', key: '4', w: 1 },
			{ display: '5', key: '5', w: 1 }, { display: '6', key: '6', w: 1 },
			{ display: '7', key: '7', w: 1 }, { display: '8', key: '8', w: 1 },
			{ display: '9', key: '9', w: 1 }, { display: '0', key: '0', w: 1 },
			{ display: '-', key: '-', w: 1 }, { display: '=', key: '=', w: 1 },
		],
		[
			{ display: 'Tab', key: 'Tab', w: 1.5 },
			{ display: 'q', key: 'q', w: 1 }, { display: 'w', key: 'w', w: 1 },
			{ display: 'e', key: 'e', w: 1 }, { display: 'r', key: 'r', w: 1 },
			{ display: 't', key: 't', w: 1 }, { display: 'y', key: 'y', w: 1 },
			{ display: 'u', key: 'u', w: 1 }, { display: 'i', key: 'i', w: 1 },
			{ display: 'o', key: 'o', w: 1 }, { display: 'p', key: 'p', w: 1 },
			{ display: '[', key: '[', w: 1 }, { display: ']', key: ']', w: 1 },
		],
		[
			{ display: 'Ctrl', key: 'Ctrl', w: 1.75 },
			{ display: 'a', key: 'a', w: 1 }, { display: 's', key: 's', w: 1 },
			{ display: 'd', key: 'd', w: 1 }, { display: 'f', key: 'f', w: 1 },
			{ display: 'g', key: 'g', w: 1 }, { display: 'h', key: 'h', w: 1 },
			{ display: 'j', key: 'j', w: 1 }, { display: 'k', key: 'k', w: 1 },
			{ display: 'l', key: 'l', w: 1 }, { display: ';', key: ';', w: 1 },
			{ display: "'", key: "'", w: 1 }, { display: 'CR', key: 'CR', w: 1.5 },
		],
		[
			{ display: 'Shift', key: 'Shift', w: 2.25 },
			{ display: 'z', key: 'z', w: 1 }, { display: 'x', key: 'x', w: 1 },
			{ display: 'c', key: 'c', w: 1 }, { display: 'v', key: 'v', w: 1 },
			{ display: 'b', key: 'b', w: 1 }, { display: 'n', key: 'n', w: 1 },
			{ display: 'm', key: 'm', w: 1 }, { display: ',', key: ',', w: 1 },
			{ display: '.', key: '.', w: 1 }, { display: '/', key: '/', w: 1 },
		],
	];

	// Build set of single-char keys that are mapped (for keyboard highlighting)
	function getMappedKeysForSurface(surface: Surface | 'all'): Set<string> {
		const relevant = surface === 'all'
			? keymaps
			: keymaps.filter(k => k.surfaces.includes(surface as Surface));
		const keys = new Set<string>();
		for (const km of relevant) {
			// Only highlight single-char keys and special keys on the keyboard
			const k = km.key;
			if (k.length === 1) keys.add(k);
			// Also add lowercase for uppercase keys (Shift+key)
			if (k.length === 1 && k === k.toUpperCase() && k !== k.toLowerCase()) {
				keys.add(k.toLowerCase());
			}
			// Special keys
			if (k === 'Tab') keys.add('Tab');
			if (k === 'S-Tab') keys.add('Tab');
			if (k === 'CR') keys.add('CR');
			if (k === 'Esc') keys.add('Esc');
			if (k.startsWith('C-')) keys.add('Ctrl');
			if (k.startsWith('[') || k.startsWith(']')) { keys.add('['); keys.add(']'); }
		}
		return keys;
	}

	// Find keymaps for a given keyboard key
	function getKeymapsForKey(keyChar: string, surface: Surface | 'all'): Keymap[] {
		const relevant = surface === 'all'
			? keymaps
			: keymaps.filter(k => k.surfaces.includes(surface as Surface));

		return relevant.filter(km => {
			const k = km.key;
			if (k === keyChar) return true;
			if (k.toLowerCase() === keyChar) return true;
			// Special: Tab maps to Tab key
			if (keyChar === 'Tab' && (k === 'Tab' || k === 'S-Tab')) return true;
			if (keyChar === 'CR' && (k === 'CR' || k === 'C-CR')) return true;
			if (keyChar === 'Esc' && k === 'Esc') return true;
			// g-prefixed keys: highlight g
			if (keyChar === 'g' && k.startsWith('g') && k.length > 1) return true;
			// Ctrl combos
			if (keyChar === 'Ctrl' && k.startsWith('C-')) return true;
			// bracket keys
			if ((keyChar === '[' || keyChar === ']') && (k.startsWith('[') || k.startsWith(']'))) return true;
			// / key
			if (keyChar === '/' && k === '/') return true;
			return false;
		});
	}

	// ── Filtered keymaps ──
	let filtered = $derived.by(() => {
		let result = keymaps;
		if (activeSurface !== 'all') {
			result = result.filter(k => k.surfaces.includes(activeSurface as Surface));
		}
		if (activeCategory !== 'all') {
			result = result.filter(k => k.category === activeCategory);
		}
		if (activeKeyFilter) {
			// Exact key match from keyboard click
			result = getKeymapsForKey(activeKeyFilter, activeSurface);
		} else if (search) {
			const q = search.toLowerCase();
			result = result.filter(k =>
				k.key.toLowerCase().includes(q) ||
				k.description.toLowerCase().includes(q) ||
				k.action.toLowerCase().includes(q)
			);
		}
		return result;
	});

	let mappedKeys = $derived(getMappedKeysForSurface(activeSurface));

	// Surface counts
	let surfaceCounts = $derived.by(() => {
		const counts: Record<string, number> = { all: keymaps.length };
		for (const s of Object.keys(SURFACE_LABELS)) {
			counts[s] = keymaps.filter(k => k.surfaces.includes(s as Surface)).length;
		}
		return counts;
	});

	function handleKeyClick(keyChar: string) {
		const matches = getKeymapsForKey(keyChar, activeSurface);
		if (matches.length === 1) {
			selectedKeymap = matches[0];
			activeKeyFilter = null;
		} else if (matches.length > 1) {
			// Use exact key filter (not search) to avoid substring false positives
			activeKeyFilter = activeKeyFilter === keyChar ? null : keyChar;
			search = '';
			selectedKeymap = null;
		}
	}
</script>

<svelte:head>
	<title>Interactive Keymaps - dadbod-grip.nvim</title>
	<meta name="description" content="Interactive keymap explorer for dadbod-grip.nvim. Visual keyboard layout, searchable reference, filterable by surface." />
</svelte:head>

<svelte:window onkeydown={handleSequenceKey} />

<div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">

	<!-- Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-dark-text mb-2">Keymaps Explorer</h1>
		<p class="text-dark-muted text-sm">
			Click any key on the keyboard to see what it does.
			Filter by surface to see which keys are active in each context.
			Press <code class="text-grip-400">?</code> inside the plugin to see the full help popup.
		</p>
	</div>

	<!-- Surface filter pills -->
	<div class="flex flex-wrap gap-2 mb-6">
		<button
			class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors {activeSurface === 'all' ? 'bg-dark-surface border-grip-400/60 text-grip-400' : 'border-dark-border text-dark-muted hover:text-dark-text hover:border-dark-text/40'}"
			onclick={() => { activeSurface = 'all'; search = ''; activeKeyFilter = null; }}
		>
			All ({surfaceCounts['all']})
		</button>
		{#each Object.entries(SURFACE_LABELS) as [surface, label]}
			<button
				class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors {activeSurface === surface ? SURFACE_COLORS[surface as Surface] : 'border-dark-border text-dark-muted hover:text-dark-text hover:border-dark-text/40'}"
				onclick={() => { activeSurface = surface as Surface; search = ''; activeKeyFilter = null; }}
			>
				{label} ({surfaceCounts[surface]})
			</button>
		{/each}
	</div>

	<!-- Visual Keyboard -->
	<div class="bg-dark-surface border border-dark-border rounded-xl p-4 sm:p-6 mb-8 overflow-x-auto">
		<div class="min-w-[640px]">
			{#each keyboardRows as row}
				<div class="flex gap-1 mb-1">
					{#each row as key}
						{@const isActive = mappedKeys.has(key.key)}
						{@const keyMaps = getKeymapsForKey(key.key, activeSurface)}
						{@const count = keyMaps.length}
						{@const seqState = getSequenceKeyState(key.key)}
						<button
							class="h-10 rounded-md text-xs font-mono flex items-center justify-center border transition-all relative
								{seqState === 'matched'
									? 'bg-grip-400/30 border-grip-400/60 text-grip-400 ring-1 ring-grip-400/40'
									: seqState === 'waiting'
										? 'bg-amber-400/25 border-amber-400/50 text-amber-400'
										: seqState === 'nomatch'
											? 'bg-red-400/20 border-red-400/40 text-red-400'
											: isActive
												? 'bg-grip-400/15 border-grip-400/50 text-grip-400 hover:bg-grip-400/25 cursor-pointer'
												: 'bg-dark-bg/50 border-dark-border/50 text-dark-muted/40 cursor-default'
								}"
							style="width: {key.w * 2.75}rem; min-width: {key.w * 2.75}rem;"
							onclick={() => isActive && handleKeyClick(key.key)}
							disabled={!isActive}
						>
							{key.display}
							{#if count > 1}
								<span class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-grip-600 text-[9px] text-white flex items-center justify-center font-bold">
									{count}
								</span>
							{/if}
						</button>
					{/each}
				</div>
			{/each}
		</div>
		<div class="flex items-center justify-between mt-3">
			<p class="text-xs text-dark-muted/60">
				{#if activeSurface === 'all'}
					Showing all mapped keys across all surfaces
				{:else}
					Showing keys mapped on the <span class="{SURFACE_COLORS[activeSurface as Surface].split(' ')[1]}">{SURFACE_LABELS[activeSurface as Surface]}</span> surface
				{/if}
			</p>
			<button
				class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
					{typeModeActive
						? 'bg-grip-400/15 border-grip-400/50 text-grip-400'
						: 'border-dark-border text-dark-muted hover:text-dark-text hover:border-dark-text/40'
					}"
				onclick={() => { typeModeActive = !typeModeActive; clearSequence(); }}
			>
				<span class="w-1.5 h-1.5 rounded-full {typeModeActive ? 'bg-grip-400 animate-pulse' : 'bg-dark-muted/40'}"></span>
				{typeModeActive ? 'Type mode on' : 'Type Vim keys'}
			</button>
		</div>
		{#if typeModeActive}
			<div class="mt-2 flex items-center justify-center gap-2 h-7 text-xs font-mono">
				{#if sequenceState === 'idle'}
					<span class="text-dark-muted/60">Type a key sequence...</span>
				{:else if sequenceState === 'waiting'}
					<span class="text-amber-400">Sequence: {sequenceDisplay} <span class="animate-pulse">_</span></span>
				{:else if sequenceState === 'matched'}
					<span class="text-grip-400">Matched: {sequenceDisplay} = {selectedKeymap?.description}</span>
				{:else if sequenceState === 'nomatch'}
					<span class="text-red-400">No match: {sequenceDisplay}</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Selected keymap detail -->
	{#if selectedKeymap}
		<div class="bg-dark-surface border border-grip-400/40 rounded-xl p-5 mb-8 flex items-start justify-between">
			<div>
				<div class="flex items-center gap-3 mb-2">
					<code class="text-lg font-mono text-grip-400 bg-dark-bg px-2 py-0.5 rounded">{selectedKeymap.key}</code>
					<span class="text-dark-text font-semibold">{selectedKeymap.description}</span>
				</div>
				<div class="flex items-center gap-2 text-xs">
					<span class="text-dark-muted">Action:</span>
					<code class="text-dark-muted">{selectedKeymap.action}</code>
					<span class="text-dark-muted ml-2">Surfaces:</span>
					{#each selectedKeymap.surfaces as s}
						<span class="px-1.5 py-0.5 rounded text-[10px] border {SURFACE_COLORS[s]}">{SURFACE_LABELS[s]}</span>
					{/each}
				</div>
			</div>
			<button
				class="text-dark-muted hover:text-dark-text text-sm"
				onclick={() => selectedKeymap = null}
			>
				&times;
			</button>
		</div>
	{/if}

	<!-- Search + Category filter -->
	<div class="flex flex-col sm:flex-row gap-3 mb-4">
		<div class="relative flex-1">
			<input
				type="text"
				placeholder="Search keys, actions, or descriptions..."
				bind:value={search}
				oninput={() => activeKeyFilter = null}
				class="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-2 text-sm text-dark-text placeholder:text-dark-muted/50 focus:outline-none focus:border-grip-400/60"
			/>
			{#if search}
				<button
					class="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text text-xs"
					onclick={() => search = ''}
				>
					clear
				</button>
			{/if}
		</div>
		<select
			bind:value={activeCategory}
			class="bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-muted focus:outline-none focus:border-grip-400/60"
		>
			<option value="all">All categories</option>
			{#each CATEGORIES as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
	</div>

	<!-- Results count -->
	<p class="text-xs text-dark-muted mb-3">
		{filtered.length} keymap{filtered.length !== 1 ? 's' : ''}
		{#if search || activeCategory !== 'all' || activeSurface !== 'all'}
			(filtered)
		{/if}
	</p>

	<!-- Keymaps table -->
	<div class="border border-dark-border rounded-xl overflow-hidden">
		<table class="w-full text-sm">
			<thead>
				<tr class="bg-dark-surface border-b border-dark-border">
					<th class="text-left px-4 py-2.5 text-dark-text font-semibold w-20">Key</th>
					<th class="text-left px-4 py-2.5 text-dark-text font-semibold">Description</th>
					<th class="text-left px-4 py-2.5 text-dark-text font-semibold hidden sm:table-cell">Category</th>
					<th class="text-left px-4 py-2.5 text-dark-text font-semibold hidden md:table-cell">Surfaces</th>
				</tr>
			</thead>
			<tbody>
				{#each filtered as km, i}
					<tr
						class="border-b border-dark-border/50 hover:bg-dark-surface/50 cursor-pointer transition-colors {selectedKeymap === km ? 'bg-grip-400/10' : ''}"
						onclick={() => selectedKeymap = km}
					>
						<td class="px-4 py-2">
							<code class="font-mono text-grip-400 bg-dark-surface px-1.5 py-0.5 rounded text-xs">{km.key}</code>
						</td>
						<td class="px-4 py-2 text-dark-muted">{km.description}</td>
						<td class="px-4 py-2 text-dark-muted/70 text-xs hidden sm:table-cell">{km.category}</td>
						<td class="px-4 py-2 hidden md:table-cell">
							<div class="flex gap-1 flex-wrap">
								{#each km.surfaces as s}
									<span class="px-1.5 py-0.5 rounded text-[10px] border {SURFACE_COLORS[s]}">{SURFACE_LABELS[s]}</span>
								{/each}
							</div>
						</td>
					</tr>
				{/each}
				{#if filtered.length === 0}
					<tr>
						<td colspan="4" class="px-4 py-8 text-center text-dark-muted/60">
							No keymaps match your search.
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>

	<!-- Footer link to markdown reference -->
	<div class="mt-8 text-center">
		<a href="{base}/docs/keymaps" class="text-xs text-dark-muted hover:text-grip-400 transition-colors">
			Prefer a flat reference? View the markdown keymaps table &rarr;
		</a>
	</div>
</div>
