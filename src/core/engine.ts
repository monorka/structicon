import { createPRNG } from '../utils/crypto.js';

export interface Node {
    id: number;
    x: number;
    y: number;
    radius: number;
}

export interface Bond {
    source: number;
    target: number;
}

export interface Graph {
    nodes: Node[];
    bonds: Bond[];
}

export type StructureType = 'chain' | 'ring' | 'branch' | 'ladder' | 'fused' | 'spiro';

export function generateGraph(prng: () => number): Graph {
    // Variety: 3 to 8 nodes
    const nodeCount = Math.floor(prng() * 6) + 3;
    const typeValue = prng();
    let type: StructureType;

    if (typeValue < 0.15) type = 'chain';
    else if (typeValue < 0.30) type = 'ring';
    else if (typeValue < 0.45) type = 'branch';
    else if (typeValue < 0.60) type = 'ladder';
    else if (typeValue < 0.80) type = 'fused';
    else type = 'spiro';

    const nodes: Node[] = [];
    const bonds: Bond[] = [];

    const addNode = (id: number, x: number, y: number) => {
        const radius = 3 + prng() * 4;
        nodes.push({ id, x, y, radius });
    };

    const addBond = (source: number, target: number) => {
        bonds.push({ source, target });
    };

    const centerX = 50;
    const centerY = 50;
    const baseRadius = 25 + prng() * 10;

    if (type === 'chain') {
        let currentX = centerX - baseRadius;
        let currentY = centerY;
        let currentAngle = (prng() - 0.5) * Math.PI;

        addNode(0, currentX, currentY);
        for (let i = 1; i < nodeCount; i++) {
            const stepLen = 15 + prng() * 10;
            currentAngle += (prng() - 0.5) * 1.8;
            currentX += Math.cos(currentAngle) * stepLen;
            currentY += Math.sin(currentAngle) * stepLen;
            addNode(i, currentX, currentY);
            addBond(i - 1, i);
        }
    } else if (type === 'ring') {
        const startAngle = prng() * Math.PI * 2;
        const ellipticity = 0.7 + prng() * 0.6;
        for (let i = 0; i < nodeCount; i++) {
            const angle = startAngle + (i / nodeCount) * Math.PI * 2;
            addNode(i,
                centerX + Math.cos(angle) * baseRadius * ellipticity,
                centerY + Math.sin(angle) * baseRadius
            );
            addBond(i, (i + 1) % nodeCount);
        }
    } else if (type === 'branch') {
        addNode(0, centerX, centerY);
        const startAngle = prng() * Math.PI * 2;
        for (let i = 1; i < nodeCount; i++) {
            const angle = startAngle + ((i - 1) / (nodeCount - 1)) * Math.PI * 2 + (prng() - 0.5);
            const r = baseRadius * (0.8 + prng() * 0.4);
            addNode(i, centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r);
            addBond(0, i);
        }
    } else if (type === 'ladder') {
        const mainAngle = prng() * Math.PI * 2;
        const sideCount = Math.floor(nodeCount / 2);
        const spacing = (baseRadius * 2) / Math.max(1, sideCount - 1);
        const width = 12 + prng() * 10;

        const perpAngle = mainAngle + Math.PI / 2;
        const startX = centerX - Math.cos(mainAngle) * baseRadius;
        const startY = centerY - Math.sin(mainAngle) * baseRadius;

        for (let i = 0; i < sideCount; i++) {
            const lx = startX + Math.cos(mainAngle) * (i * spacing);
            const ly = startY + Math.sin(mainAngle) * (i * spacing);

            addNode(i * 2, lx + Math.cos(perpAngle) * (width / 2), ly + Math.sin(perpAngle) * (width / 2));
            addNode(i * 2 + 1, lx - Math.cos(perpAngle) * (width / 2), ly - Math.sin(perpAngle) * (width / 2));
            addBond(i * 2, i * 2 + 1);
            if (i > 0) {
                addBond((i - 1) * 2, i * 2);
                addBond((i - 1) * 2 + 1, i * 2 + 1);
            }
        }
    } else if (type === 'fused' || type === 'spiro') {
        const ring1Size = Math.floor(prng() * 3) + 3;
        const ring2Size = Math.floor(prng() * 3) + 3;

        const r1StartAngle = prng() * Math.PI * 2;
        const r1Radius = 18 + prng() * 8;
        for (let i = 0; i < ring1Size; i++) {
            const a = r1StartAngle + (i / ring1Size) * Math.PI * 2;
            addNode(i, centerX - 15 + Math.cos(a) * r1Radius, centerY + Math.sin(a) * r1Radius);
            addBond(i, (i + 1) % ring1Size);
        }

        const offsetAngle = prng() * Math.PI * 2;
        const r2Radius = 16 + prng() * 8;

        if (type === 'spiro') {
            const shared = nodes[0]!;
            const r2Center = {
                x: shared.x + Math.cos(offsetAngle) * (r2Radius * 1.1),
                y: shared.y + Math.sin(offsetAngle) * (r2Radius * 1.1)
            };
            for (let i = 1; i < ring2Size; i++) {
                const a = offsetAngle + Math.PI + (i / ring2Size) * Math.PI * 2;
                addNode(ring1Size + i - 1,
                    r2Center.x + Math.cos(a) * r2Radius,
                    r2Center.y + Math.sin(a) * r2Radius
                );
                if (i === 1) addBond(0, ring1Size);
                else addBond(ring1Size + i - 2, ring1Size + i - 1);
                if (i === ring2Size - 1) addBond(ring1Size + i - 1, 0);
            }
        } else {
            const n0 = nodes[0]!;
            const n1 = nodes[1]!;
            const midX = (n0.x + n1.x) / 2;
            const midY = (n0.y + n1.y) / 2;
            const dx = n1.x - n0.x;
            const dy = n1.y - n0.y;
            const edgeAngle = Math.atan2(dy, dx);
            const perpAngle = edgeAngle + Math.PI / 2;

            const r2Center = {
                x: midX + Math.cos(perpAngle) * (r2Radius * 1.3),
                y: midY + Math.sin(perpAngle) * (r2Radius * 1.3)
            };

            for (let i = 2; i < ring2Size; i++) {
                const a = perpAngle + Math.PI + (i / ring2Size) * Math.PI * 2;
                const nid = ring1Size + i - 2;
                addNode(nid, r2Center.x + Math.cos(a) * r2Radius, r2Center.y + Math.sin(a) * r2Radius);
                if (i === 2) addBond(1, nid);
                else addBond(nid - 1, nid);
                if (i === ring2Size - 1) addBond(nid, 0);
            }
        }
    }

    return normalizeGraph({ nodes, bonds }, prng);
}

function normalizeGraph(graph: Graph, prng: () => number): Graph {
    if (graph.nodes.length === 0) return graph;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const node of graph.nodes) {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
    }

    const currentCenterX = (minX + maxX) / 2;
    const currentCenterY = (minY + maxY) / 2;

    for (const node of graph.nodes) {
        node.x = node.x - currentCenterX + 50;
        node.y = node.y - currentCenterY + 50;
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const maxDim = Math.max(width, height);

    // Slight random margin variation
    const targetSize = 55 + prng() * 15;

    if (maxDim > 0) {
        const scale = targetSize / maxDim;
        for (const node of graph.nodes) {
            node.x = 50 + (node.x - 50) * scale;
            node.y = 50 + (node.y - 50) * scale;
            node.radius = Math.min(8, node.radius * Math.pow(scale, 0.4));
        }
    }

    return relaxGraph(graph);
}

/**
 * Stronger force-directed relaxation to prevent overlaps.
 */
function relaxGraph(graph: Graph): Graph {
    const iterations = 60;
    const minPadding = 10; // Clear visible gap

    for (let iter = 0; iter < iterations; iter++) {
        let moved = false;
        for (let i = 0; i < graph.nodes.length; i++) {
            for (let j = i + 1; j < graph.nodes.length; j++) {
                const n1 = graph.nodes[i]!;
                const n2 = graph.nodes[j]!;

                let dx = n2.x - n1.x;
                let dy = n2.y - n1.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                const minDist = n1.radius + n2.radius + minPadding;

                if (dist < minDist) {
                    // Break perfect overlaps
                    if (dist < 0.01) {
                        dx = Math.random() - 0.5;
                        dy = Math.random() - 0.5;
                        dist = Math.sqrt(dx * dx + dy * dy);
                    }

                    const force = (minDist - dist) / dist * 0.4;
                    const ox = dx * force;
                    const oy = dy * force;

                    n1.x -= ox;
                    n1.y -= oy;
                    n2.x += ox;
                    n2.y += oy;
                    moved = true;
                }
            }
        }
        if (!moved) break;
    }

    // Final alignment
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const node of graph.nodes) {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    for (const node of graph.nodes) {
        node.x = node.x - cx + 50;
        node.y = node.y - cy + 50;
    }

    return graph;
}
