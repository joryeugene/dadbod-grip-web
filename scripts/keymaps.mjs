import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const pinFile = new URL('keymaps-source.json', root);
const snapshotFile = new URL('src/lib/keymaps.json', root);

function validate(catalog) {
	assert.equal(catalog.version, 1, 'unsupported keymap catalog version');
	assert.ok(Array.isArray(catalog.keymaps), 'catalog.keymaps must be an array');
	const actions = new Set();
	const surfaces = new Set(['grid', 'query_pad', 'sidebar', 'cell_editor']);
	const modes = new Set(['n', 'i', 'x']);
	for (const record of catalog.keymaps) {
		for (const field of ['action', 'default', 'description', 'category']) {
			assert.equal(typeof record[field], 'string', `keymap ${field} must be a string`);
		}
		assert.ok(record.action, 'every keymap needs an action');
		assert.ok(record.default, `${record.action} needs a default key`);
		assert.match(record.description, /[.!?]$/, `${record.action} needs a complete description`);
		assert.ok(record.category, `${record.action} needs a category`);
		if (record.requires !== undefined) assert.equal(typeof record.requires, 'string', `${record.action} has an invalid requirement`);
		assert.ok(Array.isArray(record.surfaces) && record.surfaces.length > 0);
		assert.ok(Array.isArray(record.modes) && record.modes.length > 0);
		assert.ok(record.surfaces.every((surface) => surfaces.has(surface)), `${record.action} has an invalid surface`);
		assert.ok(record.modes.every((mode) => modes.has(mode)), `${record.action} has an invalid mode`);
		assert.ok(!actions.has(record.action), `duplicate keymap action: ${record.action}`);
		actions.add(record.action);
	}
	return catalog;
}

async function download(repository, commit, path) {
	const response = await fetch(`https://raw.githubusercontent.com/${repository}/${commit}/${path}`);
	assert.ok(response.ok, `catalog download failed: ${response.status}`);
	const text = await response.text();
	return { catalog: validate(JSON.parse(text)), text };
}

async function readJson(file) {
	return JSON.parse(await readFile(file, 'utf8'));
}

async function check() {
	const pin = await readJson(pinFile);
	assert.match(pin.commit, /^[0-9a-f]{40}$/, 'the keymap source must use a full commit SHA');
	const snapshot = await readFile(snapshotFile, 'utf8');
	validate(JSON.parse(snapshot));
	assert.equal(snapshot, (await download(pin.repository, pin.commit, pin.path)).text, 'the vendored keymap catalog is stale');
	console.log(`keymaps.json matches ${pin.repository}@${pin.commit}`);
}

async function sync(commit) {
	assert.match(commit ?? '', /^[0-9a-f]{40}$/, 'usage: npm run keymaps:sync -- <full-commit-sha>');
	const pin = {
		repository: 'joryeugene/dadbod-grip.nvim',
		commit,
		path: 'keymaps.json'
	};
	const { catalog, text } = await download(pin.repository, pin.commit, pin.path);
	await writeFile(pinFile, `${JSON.stringify(pin, null, 2)}\n`);
	await writeFile(snapshotFile, text);
	console.log(`synced ${catalog.keymaps.length} keymaps from ${pin.repository}@${commit}`);
}

try {
	const [command, argument] = process.argv.slice(2);
	if (command === 'check') await check();
	else if (command === 'sync') await sync(argument);
	else throw new Error('usage: node scripts/keymaps.mjs check | sync <full-commit-sha>');
} catch (error) {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
}
