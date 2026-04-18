"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A component that scrolls the window to the top whenever the route changes.
 * This ensures that navigating to a new page doesn't keep the previous scroll position.
 */
const ScrollToTop = () => {
    const pathname = usePathname();

    useEffect(() => {
        // Scroll to the very top (0, 0) instantly when the pathname changes.
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, [pathname]);

    // This component doesn't render anything itself.
    return null;
};

export default ScrollToTop;
