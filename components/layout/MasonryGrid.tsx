'use client';

import Masonry from 'react-masonry-css';
import { ReactNode } from 'react';


interface MasonryGridProps {
    children: ReactNode;
    breakpointCols?: Record<string, number> | number;
    className?: string;
    columnClassName?: string;
}

const defaultBreakpointCols = {
    default: 4,
    1536: 4, // 2xl
    1280: 3, // xl
    1024: 3, // lg
    768: 2,  // md
    640: 1   // sm
};

export function MasonryGrid({
    children,
    breakpointCols = defaultBreakpointCols,
    className = "",
    columnClassName = ""
}: MasonryGridProps) {
    return (
        <Masonry
            breakpointCols={breakpointCols}
            className={`flex w-auto -ml-4 ${className}`} // Negative margin to offset padding
            columnClassName={`pl-4 bg-clip-padding ${columnClassName}`} // Padding left for gap
        >
            {children}
        </Masonry>
    );
}
