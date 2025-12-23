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
    const nodeCount = Math.floor(prng() * 4) + 3; // 3 to 6 nodes
    const typeValue = prng();
    let type: StructureType;

    if (typeValue < 0.16) type = 'chain';
    else if (typeValue < 0.32) type = 'ring';
    else if (typeValue < 0.48) type = 'branch';
    else if (typeValue < 0.64) type = 'ladder';
    else if (typeValue < 0.82) type = 'fused';
    else type = 'spiro';

    const nodes: Node[] = [];
    const bonds: Bond[] = [];

    // Helper to add nodes with random sizing (Atomic Sizing)
    const addNode = (id: number, x: number, y: number) => {
        const radius = 3 + prng() * 4; // 3 to 7
        nodes.push({ id, x, y, radius });
    };

    // Helper to add bonds
    const addBond = (source: number, target: number) => {
        bonds.push({ source, target });
    };

    // Generate coordinates based on type
    const centerX = 50;
    const centerY = 50;
    const radius = 30 + prng() * 10; // Base size

    if (type === 'chain') {
        const angle = prng() * Math.PI * 2;
        const spacing = (radius * 2) / (nodeCount - 1);
        const startX = centerX - Math.cos(angle) * radius;
        const startY = centerY - Math.sin(angle) * radius;

        for (let i = 0; i < nodeCount; i++) {
            addNode(i,
                startX + Math.cos(angle) * (i * spacing) + (prng() - 0.5) * 5,
                startY + Math.sin(angle) * (i * spacing) + (prng() - 0.5) * 5
            );
            if (i > 0) addBond(i - 1, i);
        }
    } else if (type === 'ring') {
        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2 + prng() * 0.5;
            const r = radius * (0.8 + prng() * 0.4);
            addNode(i, centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r);
            addBond(i, (i + 1) % nodeCount);
        }
    } else if (type === 'branch') {
        addNode(0, centerX + (prng() - 0.5) * 10, centerY + (prng() - 0.5) * 10);
        for (let i = 1; i < nodeCount; i++) {
            const angle = ((i - 1) / (nodeCount - 1)) * Math.PI * 2 + (prng() - 0.5) * 0.5;
            const r = radius * (0.7 + prng() * 0.5);
            addNode(i, centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r);
            addBond(0, i);
        }
    } else if (type === 'ladder') {
        const angle = prng() * Math.PI * 2;
        const sideCount = Math.floor(nodeCount / 2);
        const spacing = (radius * 2) / (sideCount > 1 ? sideCount - 1 : 1);
        const width = 15 + prng() * 10;
        const startX = centerX - Math.cos(angle) * radius;
        const startY = centerY - Math.sin(angle) * radius;
        const perpX = -Math.sin(angle) * width;
        const perpY = Math.cos(angle) * width;

        for (let i = 0; i < sideCount; i++) {
            addNode(i * 2,
                startX + Math.cos(angle) * (i * spacing) + perpX / 2 + (prng() - 0.5) * 4,
                startY + Math.sin(angle) * (i * spacing) + perpY / 2 + (prng() - 0.5) * 4
            );
            addNode(i * 2 + 1,
                startX + Math.cos(angle) * (i * spacing) - perpX / 2 + (prng() - 0.5) * 4,
                startY + Math.sin(angle) * (i * spacing) - perpY / 2 + (prng() - 0.5) * 4
            );
            addBond(i * 2, i * 2 + 1);
            if (i > 0) {
                addBond((i - 1) * 2, i * 2);
                addBond((i - 1) * 2 + 1, i * 2 + 1);
            }
        }
    } else if (type === 'fused') {
        // Fused Rings: Shared Bond
        addNode(0, centerX - 12, centerY - 15);
        addNode(1, centerX - 12, centerY + 15);
        addBond(0, 1);

        const r1 = 20;
        addNode(2, centerX - 35, centerY);
        addBond(0, 2);
        addBond(1, 2);

        if (nodeCount >= 4) {
            addNode(3, centerX + 10, centerY - 15);
            addBond(0, 3);
            if (nodeCount >= 5) {
                addNode(4, centerX + 10, centerY + 15);
                addBond(1, 4);
                addBond(3, 4);
            } else {
                addBond(1, 3);
            }
        }
    } else if (type === 'spiro') {
        // Spiro Rings: Shared Node
        const shared = 0;
        addNode(shared, centerX, centerY);

        // Ring 1
        addNode(1, centerX - 25, centerY - 15);
        addNode(2, centerX - 25, centerY + 15);
        addBond(shared, 1);
        addBond(1, 2);
        addBond(2, shared);

        // Ring 2
        if (nodeCount >= 4) {
            addNode(3, centerX + 25, centerY - 15);
            if (nodeCount >= 5) {
                addNode(4, centerX + 35, centerY);
                addNode(5, centerX + 25, centerY + 15);
                addBond(shared, 3);
                addBond(3, 4);
                addBond(4, 5);
                addBond(5, shared);
            } else {
                addNode(4, centerX + 25, centerY + 15);
                addBond(shared, 3);
                addBond(3, 4);
                addBond(4, shared);
            }
        }
    }

    return normalizeGraph({ nodes, bonds });
}

/**
 * Normalizes the graph by centering it at (50, 50) and scaling it if too small.
 */
function normalizeGraph(graph: Graph): Graph {
    if (graph.nodes.length === 0) return graph;

    // 1. Calculate bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const node of graph.nodes) {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
    }

    const currentCenterX = (minX + maxX) / 2;
    const currentCenterY = (minY + maxY) / 2;

    // 2. Center the graph at (50, 50)
    for (const node of graph.nodes) {
        node.x = node.x - currentCenterX + 50;
        node.y = node.y - currentCenterY + 50;
    }

    // 3. Scale up if it's too small to ensure visibility
    const width = maxX - minX;
    const height = maxY - minY;
    const maxDim = Math.max(width, height);

    // Target size for the structure's longest dimension (~70% of the space)
    const targetSize = 60;
    if (maxDim > 0 && maxDim < targetSize) {
        // We only scale UP to avoid tiny icons. We don't scale DOWN 
        // because the generators already respect the 100x100 bounds roughly.
        const scale = targetSize / maxDim;
        for (const node of graph.nodes) {
            node.x = 50 + (node.x - 50) * scale;
            node.y = 50 + (node.y - 50) * scale;
            // Also scale the radius slightly for visual balance, but cap it
            node.radius = Math.min(8, node.radius * Math.sqrt(scale));
        }
    }

    return graph;
}
