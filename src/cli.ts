#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { generateIdenticon } from './index.js';
import type { Theme } from './index.js';

const args = process.argv.slice(2);

function getArgValue(name: string): string | undefined {
    const idx = args.indexOf(name);
    return idx > -1 ? args[idx + 1] : undefined;
}

const input = args.find(a => !a.startsWith('-'));
const outputFile = args.find(a => a.endsWith('.svg')) || 'identicon.svg';
const theme = getArgValue('--theme') as Theme | undefined;

if (!input) {
    console.log('Usage: structicon <input-string> [output-file.svg] [--theme light|dark|neon|organic]');
    process.exit(1);
}

try {
    const options: any = {};
    if (theme) options.theme = theme;
    const svg = generateIdenticon(input, options) as string;
    writeFileSync(outputFile, svg);
    console.log(`✅ Identicon generated: ${outputFile} (Theme: ${theme || 'default'})`);
} catch (error) {
    console.error('❌ Error generating identicon:', error);
    process.exit(1);
}
