"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import PagePaper from '../../components/common/PagePaper';
import ProfileUpdate from './components/ProfileUpdate';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProfileEditPage: React.FC = () => {
    const { member } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!member) {
            router.replace('/home');
        }
    }, [member, router]);

    if (!member) {
        return null;
    }

    return (
        <PagePaper>
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.75rem', display: 'block', lineHeight: 1.4 }}>
                    EDIT PROFILE
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mt: 0.5 }}>
                    프로필 수정
                </Typography>
            </Box>

            <ProfileUpdate />
        </PagePaper>
    );
};

export default ProfileEditPage;
