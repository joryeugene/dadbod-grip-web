import catalog from './keymaps.json';

export type Surface = 'grid' | 'query_pad' | 'sidebar' | 'cell_editor';
export type Mode = 'normal' | 'insert' | 'visual';

type CatalogMode = 'n' | 'i' | 'x';

interface CatalogKeymap {
	action: string;
	default: string;
	description: string;
	category: string;
	surfaces: Surface[];
	modes: CatalogMode[];
	requires?: string;
}

export interface Keymap {
	key: string;
	action: string;
	description: string;
	surfaces: Surface[];
	modes: Mode[];
	category: string;
	requires?: string;
}

export const SURFACE_LABELS: Record<Surface, string> = {
	grid: 'Grid',
	query_pad: 'Query Pad',
	sidebar: 'Sidebar',
	cell_editor: 'Cell Editor'
};

export const SURFACE_COLORS: Record<Surface, string> = {
	grid: 'bg-grip-400/20 text-grip-400 border-grip-400/40',
	query_pad: 'bg-purple-400/20 text-purple-400 border-purple-400/40',
	sidebar: 'bg-amber-400/20 text-amber-400 border-amber-400/40',
	cell_editor: 'bg-pink-400/20 text-pink-400 border-pink-400/40'
};

export const MODE_LABELS: Record<Mode, string> = {
	normal: 'Normal',
	insert: 'Insert',
	visual: 'Visual'
};

export const MODE_COLORS: Record<Mode, string> = {
	normal: 'bg-slate-400/15 text-slate-300 border-slate-400/30',
	insert: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
	visual: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30'
};

const modes: Record<CatalogMode, Mode> = { n: 'normal', i: 'insert', x: 'visual' };
const label = (value: string) => value === 'ai'
	? 'AI'
	: value.replace(/\b\w/g, (letter) => letter.toUpperCase());
const normalizeKey = (key: string) => key.replace(/^<([^<>]+)>$/, '$1');

export const keymaps: Keymap[] = (catalog.keymaps as CatalogKeymap[]).map((record) => ({
	key: normalizeKey(record.default),
	action: record.action,
	description: record.description,
	category: label(record.category),
	surfaces: record.surfaces,
	modes: record.modes.map((mode) => modes[mode]),
	...(record.requires ? { requires: record.requires } : {})
}));

export const CATEGORIES = [...new Set(keymaps.map((keymap) => keymap.category))];

export function filterKeymaps(surface: Surface | 'all', mode: Mode | 'all'): Keymap[] {
	return keymaps.filter((keymap) =>
		(surface === 'all' || keymap.surfaces.includes(surface))
		&& (mode === 'all' || keymap.modes.includes(mode))
	);
}
