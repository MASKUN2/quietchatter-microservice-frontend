"use client";

import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Box, CircularProgress, Typography, IconButton, Tooltip } from '@mui/material';

export interface RecommendedTalksTimerRef {
    resetTimer: () => void;
}

interface RecommendedTalksTimerProps {
    onRefresh: () => void;
    intervalMs?: number;
    isRefreshing?: boolean;
}

const RecommendedTalksTimer = forwardRef<RecommendedTalksTimerRef, RecommendedTalksTimerProps>(({
    onRefresh,
    intervalMs = 45000,
    isRefreshing = false
}, ref) => {
    const [progress, setProgress] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const isRefreshingRef = useRef(isRefreshing);

    // Sync prop to ref so animation loop sees latest value without re-triggering useEffect
    useEffect(() => {
        isRefreshingRef.current = isRefreshing;
    }, [isRefreshing]);

    const onRefreshRef = useRef(onRefresh);
    useEffect(() => {
        onRefreshRef.current = onRefresh;
    }, [onRefresh]);

    const startAnimation = useCallback(() => {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        startTimeRef.current = performance.now();

        const animate = (time: number) => {
            if (isRefreshingRef.current) {
                // Pause animation while fetching
                startTimeRef.current = performance.now() - ((progress / 100) * intervalMs);
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            if (!startTimeRef.current) {
                startTimeRef.current = time;
            }

            const elapsed = time - startTimeRef.current;

            // Calculate elapsed time in discrete 1-second chunks for 1fps animation
            const totalSeconds = intervalMs / 1000;
            const elapsedSecondsRaw = Math.min(totalSeconds, elapsed / 1000);
            const chunkedElapsedSeconds = Math.floor(elapsedSecondsRaw);
            const chunkedProgress = (chunkedElapsedSeconds / totalSeconds) * 100;

            setProgress(chunkedProgress);

            if (chunkedElapsedSeconds >= totalSeconds) {
                onRefreshRef.current();
                startTimeRef.current = performance.now();
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
    }, [intervalMs, progress]);

    useEffect(() => {
        startAnimation();

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

    const handleReset = useCallback(() => {
        if (isRefreshingRef.current) return;
        startTimeRef.current = performance.now();
        setProgress(0);
    }, []);

    useImperativeHandle(ref, () => ({
        resetTimer: handleReset
    }));

    return (
        <Tooltip title={`클릭하여 ${intervalMs / 1000}초 연장하기`} arrow placement="top">
            <IconButton
                onClick={handleReset}
                size="small"
                disableRipple
                disabled={isRefreshing}
                sx={{
                    p: 0,
                    ml: 1,
                    '&:hover': { bgcolor: 'transparent', opacity: 0.8 },
                    '&:active': { transform: 'scale(0.95)' },
                    transition: 'transform 0.1s ease',
                    cursor: isRefreshing ? 'wait' : 'pointer'
                }}
            >
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    {isRefreshing ? (
                        <CircularProgress size={24} color="primary" />
                    ) : (
                        <>
                            <CircularProgress
                                variant="determinate"
                                value={100}
                                size={24}
                                sx={{ color: 'grey.200', position: 'absolute' }}
                            />
                            <CircularProgress
                                variant="determinate"
                                value={progress}
                                size={24}
                                color="primary"
                            />
                        </>
                    )}

                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {isRefreshing && (
                            <Typography variant="caption" component="div" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                ...
                            </Typography>
                        )}
                    </Box>
                </Box>
            </IconButton>
        </Tooltip>
    );
});

RecommendedTalksTimer.displayName = 'RecommendedTalksTimer';

export default RecommendedTalksTimer;
