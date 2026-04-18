"use client";

import React from 'react';
import { Popper, Paper, Fade, Typography, Box } from '@mui/material';

export type TooltipPlacement =
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'left'
    | 'right';

interface OnboardingTooltipProps {
    /** 툴팁을 붙일 대상 DOM 요소 */
    anchorEl: HTMLElement | null;
    /** 툴팁 표시 여부 */
    open: boolean;
    /** 툴팁에 표시할 메시지 (한국어) */
    message: string;
    /** 툴팁이 anchor 요소 기준 어느 방향에 나타날지 */
    placement?: TooltipPlacement;
}

/**
 * OnboardingTooltip
 *
 * MUI Popper + Fade + Paper 조합으로 구현한 커스텀 플로팅 말풍선 컴포넌트입니다.
 * pointer-events: none 이므로 사용자 인터랙션을 방해하지 않습니다.
 */
const OnboardingTooltip: React.FC<OnboardingTooltipProps> = ({
    anchorEl,
    open,
    message,
    placement = 'bottom',
}) => {
    // 화살표 방향을 placement에 따라 결정
    const arrowStyle = getArrowStyle(placement);

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement={placement}
            transition
            style={{ zIndex: 1500, pointerEvents: 'none' }}
            modifiers={[
                {
                    name: 'offset',
                    options: { offset: [0, 10] },
                },
                {
                    name: 'preventOverflow',
                    options: { boundary: 'viewport', padding: 8 },
                },
            ]}
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={300}>
                    <Box sx={{ position: 'relative' }}>
                        {/* 화살표 */}
                        <Box
                            sx={{
                                position: 'absolute',
                                ...arrowStyle,
                                width: 0,
                                height: 0,
                                borderStyle: 'solid',
                            }}
                        />
                        <Paper
                            elevation={4}
                            sx={{
                                px: 1.5,
                                py: 1,
                                maxWidth: 240,
                                backgroundColor: 'primary.main',
                                borderRadius: 1.5,
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: '#fff',
                                    fontWeight: 600,
                                    lineHeight: 1.5,
                                    display: 'block',
                                    wordBreak: 'keep-all',
                                }}
                            >
                                {message}
                            </Typography>
                        </Paper>
                    </Box>
                </Fade>
            )}
        </Popper>
    );
};

/** placement에 맞는 CSS 화살표 스타일을 반환합니다 */
function getArrowStyle(placement: TooltipPlacement): React.CSSProperties {
    if (placement.startsWith('bottom')) {
        return {
            top: -6,
            left: placement === 'bottom-end' ? 'auto' : placement === 'bottom-start' ? 12 : '50%',
            right: placement === 'bottom-end' ? 12 : 'auto',
            transform: placement === 'bottom' ? 'translateX(-50%)' : 'none',
            borderWidth: '0 6px 6px 6px',
            borderColor: 'transparent transparent #5c2d91 transparent',
        };
    }
    if (placement.startsWith('top')) {
        return {
            bottom: -6,
            left: placement === 'top-end' ? 'auto' : placement === 'top-start' ? 12 : '50%',
            right: placement === 'top-end' ? 12 : 'auto',
            transform: placement === 'top' ? 'translateX(-50%)' : 'none',
            borderWidth: '6px 6px 0 6px',
            borderColor: '#5c2d91 transparent transparent transparent',
        };
    }
    if (placement === 'left') {
        return {
            right: -6,
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: '6px 0 6px 6px',
            borderColor: 'transparent transparent transparent #5c2d91',
        };
    }
    // right
    return {
        left: -6,
        top: '50%',
        transform: 'translateY(-50%)',
        borderWidth: '6px 6px 6px 0',
        borderColor: 'transparent #5c2d91 transparent transparent',
    };
}

export default OnboardingTooltip;
