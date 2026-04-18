"use client";

import React from 'react';
import { Box } from '@mui/material';

interface NaverLoginProps {
    height?: number;
}

const NaverLogin: React.FC<NaverLoginProps> = ({ height = 40 }) => {
    const handleLogin = () => {
        const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
        const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI || '');
        const state = Math.random().toString(36).substring(2, 15);

        // CSRF 방지를 위해 state 저장 (선택 사항이나 권장됨)
        localStorage.setItem('naver_auth_state', state);

        // 로그인 후 원래 페이지로 돌아오기 위해 현재 경로 저장
        const redirectUrl = window.location.pathname + window.location.search;
        localStorage.setItem('redirect_after_login', redirectUrl);
        console.log('[DEBUG] set redirect_after_login:', redirectUrl);

        const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&locale=ko_KR`;

        window.location.href = naverAuthUrl;
    };

    return (
        <Box
            onClick={handleLogin}
            sx={{
                height: height,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                '& img': {
                    height: '100%',
                    borderRadius: '4px',
                    objectFit: 'contain'
                }
            }}
        >
            <img
                src="https://static.nid.naver.com/oauth/small_g_in.PNG"
                alt="네이버 로그인"
            />
        </Box>
    );
};

export default NaverLogin;
