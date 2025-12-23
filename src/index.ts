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
export function generateIdenticon(
    input: string,
    options: {
        size?: number;
        strokeWidth?: number;
        color?: string;
        format?: 'svg' | 'dataurl';
    } = {}
): string {
    const seed = cyrb53(input);
    const prng = createPRNG(seed);

    const graph = generateGraph(prng);

    // Derive a stable color if not provided
    let color = options.color;
    if (!color) {
        const hue = seed % 360;
        color = `hsl(${hue}, 60%, 40%)`;
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
