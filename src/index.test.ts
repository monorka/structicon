import { describe, it, expect } from 'vitest';
import { generateIdenticon } from './index.js';

describe('Structicon', () => {
    it('should generate a consistent SVG for the same input', () => {
        const input = 'test-user';
        const svg1 = generateIdenticon(input);
        const svg2 = generateIdenticon(input);
        expect(svg1).toBe(svg2);
    });

    it('should generate different SVGs for different inputs', () => {
        const svg1 = generateIdenticon('user-a');
        const svg2 = generateIdenticon('user-b');
        expect(svg1).not.toBe(svg2);
    });

    it('should respect the size option', () => {
        const svg = generateIdenticon('test', { size: 128 });
        expect(svg).toContain('width="128"');
        expect(svg).toContain('height="128"');
    });

    it('should contain valid SVG structure', () => {
        const svg = generateIdenticon('test');
        expect(svg).toContain('<svg');
        expect(svg).toContain('viewBox="0 0 100 100"');
        expect(svg).toContain('</svg>');
        // Should have nodes (circles) and bonds (lines)
        expect(svg).toContain('<circle');
        expect(svg).toContain('<line');
    });
});
