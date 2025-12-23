#!/usr/bin/env node
import { writeFileSync } from 'fs';
import { generateIdenticon } from './index.js';

const args = process.argv.slice(2);
const input = args[0];
const outputFile = args[1] || 'identicon.svg';

if (!input) {
    console.log('Usage: structicon <input-string> [output-file.svg]');
    process.exit(1);
}

try {
    const svg = generateIdenticon(input) as string;
    writeFileSync(outputFile, svg);
    console.log(`✅ Identicon generated: ${outputFile}`);
} catch (error) {
    console.error('❌ Error generating identicon:', error);
    process.exit(1);
}
