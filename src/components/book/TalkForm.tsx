"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Box, Button, Typography, Stack, Tooltip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CharacterLimitedTextField from '../common/CharacterLimitedTextField';
import OnboardingTooltip from '../common/OnboardingTooltip';
import { useFirstVisit, VISIT_KEYS } from '../../hooks/useFirstVisit';

interface TalkFormProps {
  content: string;
  setContent: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  nickname?: string;
  isGuest?: boolean;
  onLoginClick?: () => void;
}

/** 북톡이 자동 숨김된다는 안내 툴팁의 표시 시간 (ms) */
const TALK_ONBOARDING_DISPLAY_MS = 10000;

const TalkForm: React.FC<TalkFormProps> = ({ content, setContent, onSubmit, nickname, isGuest = false, onLoginClick }) => {
  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // ── 온보딩 툴팁: 책 상세 페이지 최초 방문 시 1회 표시 ────────────────
  const { isFirstVisit, markVisited } = useFirstVisit(VISIT_KEYS.BOOK_DETAIL);
  const [showOnboarding, setShowOnboarding] = useState(isFirstVisit);
  // callback ref 패턴: DOM 마운트 후 anchorEl이 확정되면 Popper가 올바른 위치를 계산합니다
  const [clockAnchorEl, setClockAnchorEl] = useState<HTMLElement | null>(null);
  const clockRowRef = useCallback((node: HTMLElement | null) => {
    setClockAnchorEl(node);
  }, []);


  useEffect(() => {
    if (!isFirstVisit) return;

    const timer = setTimeout(() => {
      setShowOnboarding(false);
      markVisited();
    }, TALK_ONBOARDING_DISPLAY_MS);

    return () => clearTimeout(timer);
    // markVisited는 렌더 간 동일 함수이므로 의존성에서 제외합니다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstVisit]);
  // ──────────────────────────────────────────────────────────────────────

  return (
    <Box sx={{
      mb: 4,
      mx: 0,
      p: { xs: 2, sm: 2 },
      borderRadius: 2,
      bgcolor: 'grey.50',
      border: '1px solid',
      borderColor: 'grey.200'
    }}>
      <Stack direction="row" spacing={2} sx={{ mb: 1.5, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccountCircleIcon fontSize="small" color="action" />
          <Typography variant="body2" fontWeight="bold">
            {nickname || '익명 사용자'}
          </Typography>
        </Box>

        {/* 시계 아이콘 + 날짜 — 호버 시 MUI Tooltip, 최초 방문 시 OnboardingTooltip anchor */}
        <Tooltip title="1년후에 자동으로 숨겨집니다" placement="top" arrow>
          <Box
            ref={clockRowRef}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', cursor: 'help' }}
          >
            <AccessTimeIcon fontSize="small" />
            <Typography variant="caption">
              {today}
            </Typography>
          </Box>
        </Tooltip>
      </Stack>

      {/* 최초 방문 온보딩 플로팅 툴팁 */}
      <OnboardingTooltip
        anchorEl={clockAnchorEl}
        open={showOnboarding}
        message="⏳ 작성한 북톡은 1년 후 자동으로 숨겨져요. 시계 아이콘에 마우스를 올리면 언제든 확인할 수 있어요!"
        placement="bottom-start"
      />

      <form onSubmit={onSubmit}>
        <CharacterLimitedTextField
          fullWidth
          multiline
          rows={3}
          maxLength={250}
          placeholder={isGuest ? "톡을 남기려면 로그인이 필요합니다." : "이 책에 대한 생각을 자유롭게 남겨주세요."}
          value={content}
          onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setContent(e.target.value)}
          variant="outlined"
          disabled={isGuest}
          sx={{ mb: 1, bgcolor: isGuest ? 'grey.100' : 'white' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          {isGuest ? (
            <Button
              type="button"
              variant="outlined"
              onClick={onLoginClick}
              sx={{
                px: 4,
                color: '#5c2d91',
                borderColor: '#5c2d91',
                '&:hover': {
                  borderColor: '#4b0082',
                  backgroundColor: 'rgba(92, 45, 145, 0.04)'
                }
              }}
            >
              로그인 하기
            </Button>
          ) : (
            <Button
              type="submit"
              variant="outlined"
              disabled={!content.trim()}
              sx={{
                px: 4,
                color: '#5c2d91',
                borderColor: '#5c2d91',
                '&:hover': {
                  borderColor: '#4b0082',
                  backgroundColor: 'rgba(92, 45, 145, 0.04)'
                },
                '&.Mui-disabled': {
                  borderColor: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)'
                }
              }}
            >
              Talk 등록
            </Button>
          )}
        </Box>
      </form>
    </Box >
  );
};

export default TalkForm;
