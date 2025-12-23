import React from 'react';
import { generateIdenticon } from './index.js';

export interface StructiconProps {
    input: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
    theme?: 'light' | 'dark' | 'neon' | 'organic';
    className?: string;
    style?: React.CSSProperties;
}

/**
 * A React component for rendering a deterministic identicon.
 */
export const Structicon: React.FC<StructiconProps> = ({
    input,
    size = 64,
    strokeWidth,
    color,
    theme,
    className,
    style
}) => {
    const options: any = { size, format: 'svg' };
    if (strokeWidth !== undefined) options.strokeWidth = strokeWidth;
    if (color !== undefined) options.color = color;
    if (theme !== undefined) options.theme = theme;

    const svg = generateIdenticon(input, options) as string;

    return (
        <div
            className={className}
            style={{
                display: 'inline-block',
                lineHeight: 0,
                ...style
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
};
