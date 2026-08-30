<script lang="ts">
	import {
		keymaps,
		MODE_COLORS,
		MODE_LABELS,
		SURFACE_LABELS,
		type Surface
	} from '$lib/keymaps-data';

	const surfaces = Object.keys(SURFACE_LABELS) as Surface[];
</script>

<p>{keymaps.length} primary mappings are cataloged across four surfaces.</p>

{#each surfaces as surface}
	{@const mappings = keymaps.filter((keymap) => keymap.surfaces.includes(surface))}
	<section class="mt-10">
		<h2>{SURFACE_LABELS[surface]} <span class="text-base font-normal text-dark-muted">({mappings.length})</span></h2>
		<div class="not-prose overflow-x-auto rounded-xl border border-dark-border">
			<table class="w-full min-w-[640px] text-sm">
				<thead>
					<tr class="border-b border-dark-border bg-dark-surface">
						<th class="w-24 px-4 py-2.5 text-left font-semibold text-dark-text">Key</th>
						<th class="px-4 py-2.5 text-left font-semibold text-dark-text">Action</th>
						<th class="px-4 py-2.5 text-left font-semibold text-dark-text">Description</th>
						<th class="px-4 py-2.5 text-left font-semibold text-dark-text">Mode</th>
					</tr>
				</thead>
				<tbody>
					{#each mappings as mapping}
						<tr class="border-b border-dark-border/50 last:border-0">
							<td class="px-4 py-2"><code class="rounded bg-dark-surface px-1.5 py-0.5 font-mono text-xs text-grip-400">{mapping.key}</code></td>
							<td class="px-4 py-2"><code class="text-xs text-dark-muted">{mapping.action}</code></td>
							<td class="px-4 py-2 text-dark-muted">{mapping.description}</td>
							<td class="px-4 py-2">
								<div class="flex flex-wrap gap-1">
									{#each mapping.modes as mode}
										<span class="rounded border px-1.5 py-0.5 text-[10px] {MODE_COLORS[mode]}">{MODE_LABELS[mode]}</span>
									{/each}
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>
{/each}
