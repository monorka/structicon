import { cyrb53, createPRNG } from './utils/crypto.js';
import { generateGraph } from './core/engine.js';
import { renderSVG } from './core/renderer.js';
import type { RenderOptions } from './core/renderer.js';

/**
 * Generates a deterministic identicon based on the input string.
 *
 * @param input - The string to hash (e.g., username, email).
 * @param options - Customization options for size, stroke width, and format.
 * @returns A self-contained SVG string or a Data URL.
 */
export type Theme = 'light' | 'dark' | 'neon' | 'organic';

/**
 * Generates a deterministic identicon based on the input string.
 *
 * @param input - The string to hash (e.g., username, email).
 * @param options - Customization options for size, stroke width, theme and format.
 * @returns A self-contained SVG string or a Data URL.
 */
export function generateIdenticon(
    input: string,
    options: {
        size?: number;
        strokeWidth?: number;
        color?: string;
        theme?: Theme;
        format?: 'svg' | 'dataurl';
    } = {}
): string {
    const seed = cyrb53(input);
    const prng = createPRNG(seed);

    const graph = generateGraph(prng);

    // Theme-based color generation
    let color = options.color;
    if (!color) {
        const theme = options.theme || 'light';
        const hue = seed % 360;

        // Use seed for slightly different saturations/lightness within theme bounds
        const sSeed = (seed / 100) % 1;
        const lSeed = (seed / 1000) % 1;

        let s: number, l: number;

        switch (theme) {
            case 'dark':
                s = 70 + sSeed * 25; // 70-95%
                l = 65 + lSeed * 15; // 65-80% (bright on dark)
                break;
            case 'neon':
                s = 90 + sSeed * 10; // 90-100%
                l = 50 + lSeed * 20; // 50-70%
                break;
            case 'organic':
                s = 20 + sSeed * 20; // 20-40%
                l = 30 + lSeed * 15; // 30-45%
                break;
            case 'light':
            default:
                s = 50 + sSeed * 20; // 50-70%
                l = 35 + lSeed * 15; // 35-50%
                break;
        }

        color = `hsl(${hue}, ${Math.floor(s)}%, ${Math.floor(l)}%)`;
    }

    const renderOptions: RenderOptions = { color };
    if (options.size !== undefined) renderOptions.size = options.size;
    if (options.strokeWidth !== undefined) renderOptions.strokeWidth = options.strokeWidth;

    const svg = renderSVG(graph, renderOptions);

    if (options.format === 'dataurl') {
        const base64 = typeof btoa !== 'undefined'
            ? btoa(svg)
            : Buffer.from(svg).toString('base64');
        return `data:image/svg+xml;base64,${base64}`;
    }

    return svg;
}

export type { RenderOptions };
