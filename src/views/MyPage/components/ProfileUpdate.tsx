"use client";

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';
import { updateProfile } from '../../../api/api';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { validateNickname } from '../../../utils/validation';

const ProfileUpdate: React.FC = () => {
    const { member, refreshMember } = useAuth();
    const router = useRouter();
    const [nickname, setNickname] = useState(member?.nickname || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const validation = validateNickname(nickname);
        if (!validation.isValid) {
            setMessage({ text: validation.message || '올바르지 않은 닉네임입니다.', type: 'error' });
            return;
        }

        if (nickname === member?.nickname) return;

        setLoading(true);
        setMessage(null);
        try {
            await updateProfile(nickname);
            await refreshMember();
            setMessage({ text: '프로필이 성공적으로 업데이트되었습니다.', type: 'success' });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : '프로필 업데이트에 실패했습니다.';
            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleUpdate} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>프로필 수정</Typography>
            {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <TextField
                    label="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={loading}
                    fullWidth
                    error={message?.type === 'error'}
                    helperText={message?.type === 'error' ? message.text : '1~12자의 한글, 영문, 숫자, 공백, _, -를 사용할 수 있습니다. (공백/기호는 중간에만 가능)'}
                />
                <Button
                    variant="outlined"
                    onClick={() => router.push('/mypage')}
                    disabled={loading}
                    sx={{ height: 56, minWidth: 80 }}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !nickname.trim() || nickname === member?.nickname}
                    sx={{ height: 56, minWidth: 100 }}
                >
                    {loading ? '저장 중...' : '저장'}
                </Button>
            </Box>
        </Box>
    );
};

export default ProfileUpdate;
