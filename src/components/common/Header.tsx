"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VoiceOfCustomerModal from './VoiceOfCustomerModal';
import NaverLogin from './NaverLogin';
import {
  Box, TextField, Button, InputAdornment, Paper,
  IconButton, Typography, Menu, MenuItem, useMediaQuery, useTheme,
  Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import HomeOnboarding from '../home/HomeOnboarding';
import { useOnboardingRefs } from '../../context/OnboardingContext';

const Header: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const { member, loading, logout } = useAuth();
  const { showToast } = useToast();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // ── 온보딩 툴팁용 refs (OnboardingContext에서 읽음) ───────────────────
  const { logoRef, searchRef, vocRef, loginRef } = useOnboardingRefs();
  // ──────────────────────────────────────────────────────────────────────

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/books/search?keyword=${encodeURIComponent(keyword)}&page=1`);
    }
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    showToast('로그아웃 되었습니다.', 'success');
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  const renderMemberInfo = () => {
    // If loading and no cached user, show skeleton
    if (loading && !member) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={60} height={20} />
        </Box>
      );
    }

    // 로그인하지 않은 사용자(또는 로딩 실패 시)에게 로그인 버튼 노출
    if (!member || !member.isLoggedIn) {
      return (
        <Box ref={loginRef} sx={{ display: 'inline-flex' }}>
          <NaverLogin height={32} />
        </Box>
      );
    }

    return (
      <Box ref={loginRef} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccountCircle fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {member?.nickname}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{
          bgcolor: 'grey.100',
          px: 1,
          py: 0.2,
          borderRadius: 1,
          color: 'text.secondary',
          fontWeight: 500
        }}>
          {member?.role === 'ADMIN' ? '관리자' : member?.role}
        </Typography>

        <IconButton
          size="small"
          color="inherit"
          aria-label="menu"
          onClick={handleMenu}
          sx={{ ml: { xs: 0, sm: 0.5 } }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => { handleClose(); router.push('/home'); }}>홈</MenuItem>
          <MenuItem onClick={() => { handleClose(); router.push('/mypage'); }}>마이페이지</MenuItem>
          <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
        </Menu>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top Bar Area */}
      <Paper
        elevation={isMobile ? 0 : 1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1,
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: 'background.paper',
          minHeight: '56px',
          borderBottom: isMobile ? '1px solid #eee' : 'none'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* VOC 버튼 영역 — 온보딩 ref 부착 */}
          <Box ref={vocRef} sx={{ display: 'inline-flex' }}>
            <VoiceOfCustomerModal />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderMemberInfo()}
        </Box>
      </Paper>

      {/* Main Search Area */}
      <Paper
        elevation={isMobile ? 0 : 1}
        sx={{
          p: isMobile ? 2 : 4,
          mt: isMobile ? 0 : 2,
          borderRadius: isMobile ? 0 : 2,
          backgroundColor: 'background.paper',
          textAlign: 'center',
          borderBottom: isMobile ? '1px solid #eee' : 'none'
        }}
      >
        {/* 로고 — 온보딩 ref 부착 */}
        <Box sx={{ mb: 2 }} ref={logoRef}>
          <Link href="/home" style={{ display: 'inline-block' }}>
            <img
              alt="Quiet Chatter Icon"
              src="/images/quiet-chatter-icon2.png"
              style={{ width: '180px', height: '180px', marginBottom: '1rem', objectFit: 'contain' }}
            />
          </Link>
        </Box>
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', gap: 1, maxWidth: 600, mx: 'auto' }}>
            {/* 검색창 — 온보딩 ref 부착 */}
            <Box ref={searchRef} sx={{ flex: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="관심있는 책이나 작가를 찾아보세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              />
            </Box>
            <Button
              type="submit"
              variant="outlined"
              size="large"
              sx={{
                whiteSpace: 'nowrap',
                minWidth: 'auto',
                px: 3,
                borderRadius: 1,
                color: 'primary.main',
                borderColor: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(92, 45, 145, 0.04)',
                }
              }}
            >
              검색
            </Button>
          </Box>
        </form>
      </Paper>

      {/* ── 온보딩 툴팁 오케스트레이터 ────────────────────────────────────
           Context에서 refs를 읽으므로 props 없이 사용합니다.
           timerRef는 Home.tsx에서 직접 context에 등록됩니다.
      ──────────────────────────────────────────────────────────────────── */}
      <HomeOnboarding />
    </Box>
  );
};

export default Header;
