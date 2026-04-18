"use client";

import React from 'react';
import { Typography, Paper, Box, Stack, useTheme, useMediaQuery, Grid, Divider } from '@mui/material';
import { ABOUT_INTRO, ABOUT_FEATURES, HISTORY_TIMELINE, SERVICE_PHILOSOPHY } from '../constants/about';
import SecurityIcon from '@mui/icons-material/Security';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TimerIcon from '@mui/icons-material/Timer';
import FavoriteIcon from '@mui/icons-material/Favorite';

const iconMap: { [key: string]: React.ElementType } = {
    Security: SecurityIcon,
    ChatBubbleOutline: ChatBubbleOutlineIcon,
    AutoAwesome: AutoAwesomeIcon,
    MenuBook: MenuBookIcon,
    Timer: TimerIcon,
};

const AboutService: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const Highlight = ({ children, color = 'rgba(92, 45, 145, 0.12)' }: { children: React.ReactNode; color?: string }) => (
        <Box component="span" sx={{
            bgcolor: color,
            px: 0.6,
            borderRadius: '4px',
            fontWeight: 700,
        }}>
            {children}
        </Box>
    );

    return (
        <Box>
            {/* 전체를 감싸는 흰색 카드 */}
            <Paper
                elevation={isMobile ? 0 : 2}
                sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                }}
            >
                <Stack spacing={0}>
                    {/* ── Hero Section ── */}
                    <Box sx={{ textAlign: 'center', px: { xs: 3, md: 8 }, pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                mb: 2,
                                background: 'linear-gradient(135deg, #5c2d91 0%, #a29bfe 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: { xs: '2.5rem', md: '4.5rem' },
                                letterSpacing: '-0.04em',
                                lineHeight: 1.1
                            }}
                        >
                            &quot;You Belong Here&quot;
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'text.secondary',
                                mb: 5,
                                fontWeight: 400,
                                fontSize: { xs: '1.1rem', md: '1.5rem' },
                                lineHeight: 1.5,
                                opacity: 0.75,
                                letterSpacing: '-0.01em'
                            }}
                        >
                            수줍음이 많은 사람들을 위한 <Highlight color="rgba(92, 45, 145, 0.07)">다정한 독서 공간</Highlight>
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: 2.2,
                                color: 'text.primary',
                                fontSize: { xs: '1rem', md: '1.15rem' },
                                whiteSpace: 'pre-line',
                                textAlign: 'left',
                                maxWidth: '800px',
                                mx: 'auto',
                            }}
                        >
                            {ABOUT_INTRO}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* ── Philosophy Section ── */}
                    <Box sx={{ px: { xs: 3, md: 8 }, py: { xs: 6, md: 8 }, bgcolor: 'rgba(92, 45, 145, 0.02)' }}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.3em', fontSize: '0.85rem' }}>
                                OUR PHILOSOPHY
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, letterSpacing: '-0.03em', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                우리가 지키고자 하는 가치
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            {SERVICE_PHILOSOPHY.map((phil, index) => (
                                <Grid item xs={12} md={4} key={index}>
                                    <Box sx={{
                                        p: 4,
                                        height: '100%',
                                        bgcolor: 'background.paper',
                                        borderRadius: 4,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 16px 32px rgba(92, 45, 145, 0.08)'
                                        }
                                    }}>
                                        <FavoriteIcon color="primary" sx={{ fontSize: 32, mb: 2, opacity: 0.75 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.01em' }}>
                                            {phil.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                                            {phil.content}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider />

                    {/* ── Features Section ── */}
                    <Box sx={{ px: { xs: 3, md: 8 }, py: { xs: 6, md: 8 } }}>
                        <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.3em', fontSize: '0.85rem' }}>
                                KEY FEATURES
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 900, mt: 1, letterSpacing: '-0.03em', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                주요 기능
                            </Typography>
                        </Box>
                        <Grid container spacing={3}>
                            {ABOUT_FEATURES.map((feature, index) => {
                                const IconComponent = iconMap[feature.icon];
                                return (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Box sx={{
                                            p: 4,
                                            height: '100%',
                                            borderRadius: 4,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            bgcolor: 'rgba(92, 45, 145, 0.01)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 20px 40px rgba(92, 45, 145, 0.1)',
                                                borderColor: 'primary.main',
                                                bgcolor: 'background.paper',
                                            }
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 56,
                                                height: 56,
                                                borderRadius: 3,
                                                bgcolor: 'rgba(92, 45, 145, 0.08)',
                                                color: 'primary.main',
                                                mb: 3
                                            }}>
                                                {IconComponent && <IconComponent sx={{ fontSize: 28 }} />}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.01em' }}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                                                {feature.description}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>

                    <Divider />

                    {/* ── Journey / Timeline Section ── */}
                    <Box sx={{ px: { xs: 3, md: 8 }, py: { xs: 6, md: 8 }, bgcolor: 'rgba(92, 45, 145, 0.02)' }}>
                        <Box sx={{ textAlign: 'center', mb: 7 }}>
                            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                                Quiet Chatter의 여정
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1.5, opacity: 0.7 }}>
                                우리가 함께 만들어온 소중한 기록들
                            </Typography>
                        </Box>
                        <Stack spacing={6} sx={{ maxWidth: '720px', mx: 'auto' }}>
                            {HISTORY_TIMELINE.map((event, index) => (
                                <Box key={index} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 6 } }}>
                                    <Box sx={{ minWidth: 140 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', letterSpacing: '-0.01em' }}>
                                            {event.date}
                                        </Typography>
                                    </Box>
                                    <Box sx={{
                                        position: 'relative',
                                        flex: 1,
                                        pl: { xs: 3, sm: 4 },
                                        borderLeft: '3px solid',
                                        borderColor: 'rgba(92, 45, 145, 0.15)'
                                    }}>
                                        <Box sx={{
                                            position: 'absolute',
                                            left: -10,
                                            top: 5,
                                            width: 18,
                                            height: 18,
                                            borderRadius: '50%',
                                            border: '3px solid',
                                            borderColor: 'primary.main',
                                            bgcolor: 'background.paper',
                                            boxShadow: '0 0 0 4px rgba(92, 45, 145, 0.1)'
                                        }} />
                                        <Stack spacing={2.5}>
                                            {event.items.map((item, itemIdx) => (
                                                <Box key={itemIdx} sx={{
                                                    p: 2.5,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 3,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                                    border: '1px solid transparent',
                                                    transition: 'all 0.25s ease',
                                                    '&:hover': {
                                                        borderColor: 'primary.light',
                                                        transform: 'translateX(8px)',
                                                    }
                                                }}>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.6 }}>
                                                        {item}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default AboutService;
