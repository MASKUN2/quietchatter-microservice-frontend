"use client";

import React from 'react';
import { Paper, useTheme, useMediaQuery } from '@mui/material';
import type { PaperProps } from '@mui/material';

interface PagePaperProps extends PaperProps {
    children: React.ReactNode;
}

const PagePaper: React.FC<PagePaperProps> = ({ children, sx, ...props }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper
            elevation={isMobile ? 0 : 1}
            sx={{
                p: isMobile ? 2 : 4,
                borderRadius: isMobile ? 0 : 2,
                borderBottom: isMobile ? '1px solid #eee' : 'none',
                mb: 4,
                ...sx
            }}
            {...props}
        >
            {children}
        </Paper>
    );
};

export default PagePaper;
