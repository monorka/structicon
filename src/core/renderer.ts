import type { Graph } from './engine.js';

export interface RenderOptions {
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export function renderSVG(graph: Graph, options: RenderOptions = {}): string {
    const {
        size = 64,
        strokeWidth = 2,
        color = '#333'
    } = options;

    const viewBox = '0 0 100 100';
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${size}" height="${size}">`;

    // Draw bonds
    for (const bond of graph.bonds) {
        const s = graph.nodes.find(n => n.id === bond.source);
        const t = graph.nodes.find(n => n.id === bond.target);
        if (!s || !t) continue;

        svg += `<line x1="${s.x.toFixed(2)}" y1="${s.y.toFixed(2)}" x2="${t.x.toFixed(2)}" y2="${t.y.toFixed(2)}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" />`;
    }

    // Draw nodes
    for (const node of graph.nodes) {
        svg += `<circle cx="${node.x.toFixed(2)}" cy="${node.y.toFixed(2)}" r="${node.radius.toFixed(2)}" fill="${color}" />`;
    }

    svg += '</svg>';
    return svg;
}
