"use client";

import React from 'react';
import { Typography, Paper, useTheme, useMediaQuery, Box, Stack } from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import { LATEST_TERMS } from '../constants/terms';

const TermsOfService: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <>
            <Paper elevation={isMobile ? 0 : 2} sx={{ borderRadius: 4, overflow: 'hidden', bgcolor: 'background.paper' }}>
                {/* Header */}
                <Box sx={{ px: { xs: 3, md: 6 }, pt: { xs: 5, md: 7 }, pb: { xs: 4, md: 5 }, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.25em', fontSize: '0.8rem' }}>
                        LEGAL
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1.5 }}>
                        <GavelIcon sx={{ color: 'primary.main', fontSize: 32, opacity: 0.8 }} />
                        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'text.primary' }}>
                            이용약관 및 개인정보처리방침
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5, opacity: 0.8 }}>
                        시행일자: {LATEST_TERMS.date} &nbsp;·&nbsp; 버전 {LATEST_TERMS.version}
                    </Typography>
                </Box>

                {/* Sections */}
                <Stack spacing={0} sx={{ px: { xs: 3, md: 6 }, py: { xs: 4, md: 5 } }}>
                    {LATEST_TERMS.sections.map((section, idx) => (
                        <Box key={idx} sx={{ py: 3, borderBottom: idx < LATEST_TERMS.sections.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    mb: 1.5,
                                    color: 'text.primary',
                                    letterSpacing: '-0.01em',
                                    fontSize: '1.05rem'
                                }}
                            >
                                {section.title}
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: section.isImportant ? 'text.primary' : 'text.secondary',
                                    lineHeight: 1.85,
                                    ...(section.isImportant && {
                                        bgcolor: 'rgba(92, 45, 145, 0.04)',
                                        border: '1px solid',
                                        borderColor: 'rgba(92, 45, 145, 0.15)',
                                        borderRadius: 3,
                                        p: 2.5,
                                    })
                                }}
                            >
                                {section.isImportant && (
                                    <Typography component="span" sx={{ fontWeight: 800, color: 'primary.main', mr: 0.5 }}>
                                        중요:&nbsp;
                                    </Typography>
                                )}
                                {section.content}
                            </Typography>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </>
    );
};

export default TermsOfService;
