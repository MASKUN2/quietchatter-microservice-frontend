"use client";

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import type { FallbackProps } from 'react-error-boundary';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const GlobalErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
                p: 3,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, sm: 5 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: 500,
                    width: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                }}
            >
                <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />

                <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
                    앗, 문제가 발생했습니다!
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    페이지를 불러오는 중 예상치 못한 오류가 발생했습니다.<br />
                    잠시 후 다시 시도해 주시거나 홈으로 돌아가 주세요.
                </Typography>

                <Box
                    sx={{
                        width: '100%',
                        p: 2,
                        mb: 3,
                        bgcolor: 'grey.100',
                        borderRadius: 1,
                        overflowX: 'auto',
                        textAlign: 'left',
                    }}
                >
                    <Typography variant="caption" color="error.dark" fontFamily="monospace" sx={{ whiteSpace: 'pre-wrap' }}>
                        {error instanceof Error ? error.message : String(error)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        홈으로 가기
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={resetErrorBoundary}
                    >
                        다시 시도
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default GlobalErrorFallback;
