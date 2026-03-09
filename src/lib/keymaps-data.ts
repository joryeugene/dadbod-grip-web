// Keymap data extracted from lua/dadbod-grip/keymaps.lua
// Surfaces: grid, grid_visual, query_pad, sidebar, cell_editor

export type Surface = 'grid' | 'grid_visual' | 'query_pad' | 'sidebar' | 'cell_editor';

export interface Keymap {
	key: string;
	action: string;
	description: string;
	surfaces: Surface[];
	category: string;
}

export const SURFACE_LABELS: Record<Surface, string> = {
	grid: 'Grid',
	grid_visual: 'Visual',
	query_pad: 'Query Pad',
	sidebar: 'Sidebar',
	cell_editor: 'Cell Editor'
};

export const SURFACE_COLORS: Record<Surface, string> = {
	grid: 'bg-grip-400/20 text-grip-400 border-grip-400/40',
	grid_visual: 'bg-cyan-400/20 text-cyan-400 border-cyan-400/40',
	query_pad: 'bg-purple-400/20 text-purple-400 border-purple-400/40',
	sidebar: 'bg-amber-400/20 text-amber-400 border-amber-400/40',
	cell_editor: 'bg-pink-400/20 text-pink-400 border-pink-400/40'
};

export const CATEGORIES = [
	'Navigation',
	'Editing',
	'Display',
	'Sort / Filter',
	'Pagination',
	'Inspection',
	'Analysis / Export',
	'FK Navigation',
	'Workflow',
	'Tabs (1-9)',
	'AI',
	'Shared'
] as const;

export const keymaps: Keymap[] = [
	// ── Shared across surfaces ──
	{ key: '?', action: 'help', description: 'Show help popup', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'C-p', action: 'palette', description: 'Command palette (searchable actions)', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'gG', action: 'er_diagram', description: 'ER diagram float', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'gC', action: 'connections', description: 'Switch database connection', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'C-g', action: 'connections_alt', description: 'Switch connection (alt)', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'gT', action: 'table_picker', description: 'Table picker (floating)', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'gt', action: 'table_picker_alt', description: 'Table picker (alt)', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'gh', action: 'query_history', description: 'Query history browser', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'gq', action: 'load_saved', description: 'Load saved query', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Shared' },
	{ key: 'Q', action: 'welcome', description: 'Welcome / home screen', surfaces: ['grid', 'query_pad'], category: 'Shared' },
	{ key: 'q', action: 'query_pad', description: 'Open query pad', surfaces: ['grid', 'sidebar'], category: 'Shared' },
	{ key: 'A', action: 'ai', description: 'AI SQL generation', surfaces: ['grid', 'sidebar'], category: 'AI' },
	{ key: 'gb', action: 'schema_browser', description: 'Schema sidebar (toggle)', surfaces: ['grid', 'query_pad'], category: 'Shared' },
	{ key: 'gw', action: 'goto_grid', description: 'Jump to grid window', surfaces: ['grid', 'query_pad'], category: 'Shared' },

	// ── Grid: Navigation ──
	{ key: 'j', action: 'grid_row_down', description: 'Move down one row', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'k', action: 'grid_row_up', description: 'Move up one row', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'h', action: 'grid_col_left', description: 'Move left', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'l', action: 'grid_col_right', description: 'Move right', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'w', action: 'grid_col_next', description: 'Next column', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'b', action: 'grid_col_prev', description: 'Previous column', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'Tab', action: 'grid_col_tab', description: 'Next column', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'S-Tab', action: 'grid_col_tab_back', description: 'Previous column', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'e', action: 'grid_col_end', description: 'End of cell / next column', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'gg', action: 'grid_row_first', description: 'First data row', surfaces: ['grid'], category: 'Navigation' },
	{ key: 'G', action: 'grid_row_last', description: 'Last data row', surfaces: ['grid'], category: 'Navigation' },
	{ key: '0', action: 'grid_col_first', description: 'First column', surfaces: ['grid'], category: 'Navigation' },
	{ key: '^', action: 'grid_col_first2', description: 'First column (alt)', surfaces: ['grid'], category: 'Navigation' },
	{ key: '$', action: 'grid_col_last', description: 'Last column', surfaces: ['grid'], category: 'Navigation' },
	{ key: '{', action: 'grid_prev_mod', description: 'Previous modified row', surfaces: ['grid'], category: 'Navigation' },
	{ key: '}', action: 'grid_next_mod', description: 'Next modified row', surfaces: ['grid'], category: 'Navigation' },

	// ── Grid: Editing ──
	{ key: 'i', action: 'grid_edit', description: 'Edit cell (open inline editor)', surfaces: ['grid'], category: 'Editing' },
	{ key: 'CR', action: 'grid_edit_enter', description: 'Edit cell (enter)', surfaces: ['grid'], category: 'Editing' },
	{ key: 'x', action: 'grid_null', description: 'Set cell to NULL', surfaces: ['grid'], category: 'Editing' },
	{ key: 'p', action: 'grid_paste', description: 'Paste clipboard into cell', surfaces: ['grid'], category: 'Editing' },
	{ key: 'P', action: 'grid_paste_rows', description: 'Paste multi-line into consecutive rows', surfaces: ['grid'], category: 'Editing' },
	{ key: 'o', action: 'grid_insert', description: 'Insert new blank row', surfaces: ['grid'], category: 'Editing' },
	{ key: 'c', action: 'grid_clone', description: 'Clone row (clear PKs)', surfaces: ['grid'], category: 'Editing' },
	{ key: 'd', action: 'grid_delete', description: 'Toggle row deletion staging', surfaces: ['grid'], category: 'Editing' },
	{ key: 'a', action: 'grid_apply', description: 'Apply all staged changes to DB', surfaces: ['grid'], category: 'Editing' },
	{ key: 'u', action: 'grid_undo', description: 'Undo last staged edit', surfaces: ['grid'], category: 'Editing' },
	{ key: 'C-r', action: 'grid_redo', description: 'Redo', surfaces: ['grid'], category: 'Editing' },
	{ key: 'U', action: 'grid_undo_all', description: 'Undo all (reset to original)', surfaces: ['grid'], category: 'Editing' },

	// ── Grid: Visual mode ──
	{ key: 'e', action: 'grid_v_edit', description: 'Set selected cells to same value', surfaces: ['grid_visual'], category: 'Editing' },
	{ key: 'd', action: 'grid_v_delete', description: 'Toggle delete on selected rows', surfaces: ['grid_visual'], category: 'Editing' },
	{ key: 'x', action: 'grid_v_null', description: 'Set selected cells to NULL', surfaces: ['grid_visual'], category: 'Editing' },
	{ key: 'y', action: 'grid_v_yank', description: 'Yank selected cells in column', surfaces: ['grid_visual'], category: 'Editing' },
	{ key: 'gd', action: 'grid_v_compare', description: 'Diff exactly 2 selected rows', surfaces: ['grid_visual'], category: 'Inspection' },

	// ── Grid: Display ──
	{ key: '-', action: 'grid_hide_col', description: 'Hide column under cursor', surfaces: ['grid'], category: 'Display' },
	{ key: 'g-', action: 'grid_restore_cols', description: 'Restore all hidden columns', surfaces: ['grid'], category: 'Display' },
	{ key: 'gH', action: 'grid_col_vis', description: 'Column visibility picker', surfaces: ['grid'], category: 'Display' },
	{ key: '=', action: 'grid_col_width', description: 'Cycle column width', surfaces: ['grid'], category: 'Display' },
	{ key: 'T', action: 'grid_type_row', description: 'Toggle column type row', surfaces: ['grid'], category: 'Display' },
	{ key: 'K', action: 'grid_row_view', description: 'Row view (vertical transpose)', surfaces: ['grid'], category: 'Display' },
	{ key: 'gl', action: 'grid_live_sql', description: 'Toggle live SQL preview float', surfaces: ['grid'], category: 'Display' },

	// ── Grid: Sort / Filter ──
	{ key: 's', action: 'grid_sort', description: 'Sort column (ASC / DESC / off)', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'S', action: 'grid_sort_stack', description: 'Stacked sort (up to 3 levels)', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'f', action: 'grid_filter_cell', description: 'Quick filter by cell value', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'gn', action: 'grid_filter_null', description: 'Filter: column IS NULL', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'gF', action: 'grid_filter_build', description: 'Interactive filter builder', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'C-f', action: 'grid_filter_where', description: 'Freeform WHERE expression', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'F', action: 'grid_filter_clear', description: 'Clear all active filters', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'gp', action: 'grid_preset_load', description: 'Load saved filter preset', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'gP', action: 'grid_preset_save', description: 'Save current filters as preset', surfaces: ['grid'], category: 'Sort / Filter' },
	{ key: 'X', action: 'grid_reset_view', description: 'Reset view (clear sort + filter)', surfaces: ['grid'], category: 'Sort / Filter' },

	// ── Grid: Pagination ──
	{ key: 'L', action: 'grid_next_page', description: 'Next page', surfaces: ['grid'], category: 'Pagination' },
	{ key: 'H', action: 'grid_prev_page', description: 'Previous page', surfaces: ['grid'], category: 'Pagination' },
	{ key: ']p', action: 'grid_next_page2', description: 'Next page (bracket alias)', surfaces: ['grid'], category: 'Pagination' },
	{ key: '[p', action: 'grid_prev_page2', description: 'Previous page (bracket alias)', surfaces: ['grid'], category: 'Pagination' },
	{ key: ']P', action: 'grid_last_page', description: 'Last page', surfaces: ['grid'], category: 'Pagination' },
	{ key: '[P', action: 'grid_first_page', description: 'First page', surfaces: ['grid'], category: 'Pagination' },

	// ── Grid: Inspection ──
	{ key: 'ge', action: 'grid_explain_cell', description: 'Explain cell (type, value, status)', surfaces: ['grid'], category: 'Inspection' },
	{ key: 'gs', action: 'grid_preview_sql', description: 'Preview staged SQL', surfaces: ['grid'], category: 'Inspection' },
	{ key: 'gc', action: 'grid_copy_sql', description: 'Copy staged SQL to clipboard', surfaces: ['grid'], category: 'Inspection' },
	{ key: 'gi', action: 'grid_table_info', description: 'Table info (columns, types, PKs)', surfaces: ['grid'], category: 'Inspection' },
	{ key: 'gI', action: 'grid_table_props', description: 'Table properties float', surfaces: ['grid'], category: 'Inspection' },
	{ key: 'gN', action: 'grid_rename_col', description: 'Rename column display header', surfaces: ['grid'], category: 'Inspection' },

	// ── Grid: Analysis / Export ──
	{ key: 'ga', action: 'grid_aggregate', description: 'Aggregate column (count/sum/avg)', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gS', action: 'grid_col_stats', description: 'Column statistics popup', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gR', action: 'grid_profile', description: 'Table profile (sparklines)', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gV', action: 'grid_show_ddl', description: 'Show CREATE TABLE DDL', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gQ', action: 'grid_explain', description: 'Explain query plan', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gx', action: 'grid_url_open', description: 'Open URL in current cell', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gD', action: 'grid_diff', description: 'Diff against another table', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gE', action: 'grid_export_clip', description: 'Export to clipboard (CSV/JSON/SQL/MD)', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gX', action: 'grid_export_file', description: 'Export to file', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'y', action: 'grid_yank_cell', description: 'Yank cell value to clipboard', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'Y', action: 'grid_yank_row', description: 'Yank row as CSV', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gY', action: 'grid_yank_table', description: 'Yank entire table as CSV', surfaces: ['grid'], category: 'Analysis / Export' },
	{ key: 'gy', action: 'grid_yank_md', description: 'Yank table as Markdown', surfaces: ['grid'], category: 'Analysis / Export' },

	// ── Grid: FK Navigation ──
	{ key: 'gf', action: 'grid_fk_follow', description: 'Follow foreign key', surfaces: ['grid'], category: 'FK Navigation' },
	{ key: 'C-o', action: 'grid_fk_back', description: 'Back in FK stack', surfaces: ['grid'], category: 'FK Navigation' },

	// ── Grid: Workflow ──
	{ key: 'r', action: 'grid_refresh', description: 'Refresh (re-run query)', surfaces: ['grid'], category: 'Workflow' },
	{ key: 'gW', action: 'grid_watch', description: 'Toggle watch mode (auto-refresh)', surfaces: ['grid'], category: 'Workflow' },
	{ key: 'g!', action: 'grid_write_mode', description: 'Toggle write mode (file persist)', surfaces: ['grid'], category: 'Workflow' },
	{ key: 'gO', action: 'grid_open_edit', description: 'Open as editable table', surfaces: ['grid'], category: 'Workflow' },
	{ key: 'gA', action: 'grid_fill', description: 'AI-generated staged rows (GripFill)', surfaces: ['grid'], category: 'AI' },

	// ── Tabs 1-9 ──
	{ key: '1', action: 'tab_1', description: 'Grid: sidebar | QP: sidebar | Sidebar: connections', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '2', action: 'tab_2', description: 'Grid: query pad | QP: history | Sidebar: query pad', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '3', action: 'tab_3', description: 'Grid: table picker | QP: grid | Sidebar: open table', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '4', action: 'tab_4', description: 'ER diagram float', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '5', action: 'tab_5', description: 'Column stats', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '6', action: 'tab_6', description: 'Columns view', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '7', action: 'tab_7', description: 'Foreign keys view', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '8', action: 'tab_8', description: 'Indexes view', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },
	{ key: '9', action: 'tab_9', description: 'Constraints view', surfaces: ['grid', 'query_pad', 'sidebar'], category: 'Tabs (1-9)' },

	// ── Query Pad ──
	{ key: 'C-CR', action: 'qpad_execute', description: 'Execute query', surfaces: ['query_pad'], category: 'Workflow' },
	{ key: 'C-s', action: 'qpad_save', description: 'Save current query', surfaces: ['query_pad'], category: 'Workflow' },
	{ key: 'gA', action: 'qpad_ai', description: 'AI SQL generation', surfaces: ['query_pad'], category: 'AI' },
	{ key: 'gF', action: 'qpad_format', description: 'Format SQL', surfaces: ['query_pad'], category: 'Workflow' },
	{ key: 'q', action: 'qpad_close', description: 'Close query pad', surfaces: ['query_pad'], category: 'Workflow' },
	{ key: 'gn', action: 'open_notebook', description: 'Open notebook file', surfaces: ['query_pad'], category: 'Workflow' },

	// ── Sidebar ──
	{ key: 'CR', action: 'sidebar_open', description: 'Open table under cursor', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'l', action: 'sidebar_expand', description: 'Expand node', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'h', action: 'sidebar_collapse', description: 'Collapse node', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'zo', action: 'sidebar_expand_z', description: 'Expand (vim fold style)', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'zc', action: 'sidebar_collap_z', description: 'Collapse (vim fold style)', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'L', action: 'sidebar_expand_all', description: 'Expand all tables', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'H', action: 'sidebar_collap_all', description: 'Collapse all tables', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: '/', action: 'sidebar_filter', description: 'Filter by table name', surfaces: ['sidebar'], category: 'Sort / Filter' },
	{ key: 'F', action: 'sidebar_filter_c', description: 'Clear filter', surfaces: ['sidebar'], category: 'Sort / Filter' },
	{ key: 'n', action: 'sidebar_next', description: 'Next table node', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'N', action: 'sidebar_prev', description: 'Previous table node', surfaces: ['sidebar'], category: 'Navigation' },
	{ key: 'r', action: 'sidebar_refresh', description: 'Refresh schema', surfaces: ['sidebar'], category: 'Workflow' },
	{ key: 'R', action: 'sidebar_refresh2', description: 'Force-refresh schema', surfaces: ['sidebar'], category: 'Workflow' },
	{ key: 'y', action: 'sidebar_yank', description: 'Yank table/column name', surfaces: ['sidebar'], category: 'Analysis / Export' },
	{ key: 'go', action: 'sidebar_open_s', description: 'Open table (smart ORDER BY)', surfaces: ['sidebar'], category: 'Workflow' },
	{ key: 'Esc', action: 'sidebar_close', description: 'Close sidebar', surfaces: ['sidebar'], category: 'Workflow' },
	{ key: 'D', action: 'sidebar_drop', description: 'Drop table (with confirm)', surfaces: ['sidebar'], category: 'Editing' },
	{ key: '+', action: 'sidebar_create', description: 'Create new table', surfaces: ['sidebar'], category: 'Editing' },
	{ key: 'ga', action: 'sidebar_attach', description: 'Attach external DB (DuckDB)', surfaces: ['sidebar'], category: 'Workflow' },
	{ key: 'gd', action: 'sidebar_detach', description: 'Detach attached database', surfaces: ['sidebar'], category: 'Workflow' },
	{ key: 'gc', action: 'sidebar_conns', description: 'Switch connection', surfaces: ['sidebar'], category: 'Workflow' },

	// ── Cell Editor ──
	{ key: 'CR', action: 'editor_save', description: 'Save and close (insert + normal)', surfaces: ['cell_editor'], category: 'Editing' },
	{ key: 'C-s', action: 'editor_save_alt', description: 'Save and close (alt)', surfaces: ['cell_editor'], category: 'Editing' },
	{ key: 'Esc', action: 'editor_cancel', description: 'Cancel (normal mode)', surfaces: ['cell_editor'], category: 'Editing' },
	{ key: 'q', action: 'editor_cancel_q', description: 'Cancel (normal mode)', surfaces: ['cell_editor'], category: 'Editing' },
	{ key: 'C-c', action: 'editor_cancel_ins', description: 'Cancel (insert mode)', surfaces: ['cell_editor'], category: 'Editing' },
	{ key: 'gx', action: 'editor_url', description: 'Open cell value as URL in browser', surfaces: ['cell_editor'], category: 'Workflow' },
];

// Build a lookup: which keys are active on which surface
export function getKeysForSurface(surface: Surface): Keymap[] {
	return keymaps.filter(k => k.surfaces.includes(surface));
}

// Get unique key strings mapped on a surface (for keyboard highlighting)
export function getMappedKeys(surface: Surface): Set<string> {
	return new Set(keymaps.filter(k => k.surfaces.includes(surface)).map(k => k.key));
}
