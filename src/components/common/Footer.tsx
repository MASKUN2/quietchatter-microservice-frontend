"use client";

import Link from 'next/link';
import { Typography, Container, Link as MuiLink, Paper, useTheme, useMediaQuery, Box } from '@mui/material';

const Footer: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="md" disableGutters={isMobile} sx={{ pb: isMobile ? 0 : 2 }}>
            <Paper
                component="footer"
                elevation={isMobile ? 0 : 1}
                sx={{
                    py: 2,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: isMobile ? 0 : 2,
                    backgroundColor: 'background.paper',
                    borderTop: isMobile ? '1px solid #eee' : 'none',
                    minHeight: '56px'
                }}
            >
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 0.5 }}>
                    {'© '}
                    {new Date().getFullYear()}
                    {' Quiet Chatter. All rights reserved.'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <MuiLink component={Link} href="/about" color="primary" variant="caption" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        서비스 소개
                    </MuiLink>
                    <MuiLink component={Link} href="/terms" color="primary" variant="caption" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        이용약관 및 개인정보처리방침
                    </MuiLink>
                </Box>
            </Paper>
        </Container>
    );
};

export default Footer;
