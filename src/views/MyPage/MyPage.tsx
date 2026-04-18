"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Stack, Divider } from '@mui/material';
import PagePaper from '../../components/common/PagePaper';
import TalkItem from '../../components/book/TalkItem';
import WithdrawalDialog from './components/WithdrawalDialog';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useMyTalks } from '../../hooks/useMyTalks';

const MyPage: React.FC = () => {
    const { member } = useAuth();
    const router = useRouter();
    const [isWithdrawalOpen, setIsWithdrawalOpen] = useState(false);

    const isLoggedIn = !!member?.isLoggedIn;
    const { talks, loading, hasMore, loadMore, handleTalkReaction, refresh } = useMyTalks(isLoggedIn);

    useEffect(() => {
        if (!member) {
            router.replace('/home');
        }
    }, [member, router]);

    if (!member) return null;

    return (
        <PagePaper>
            <Box sx={{ mb: 4 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.75rem', display: 'block', lineHeight: 1.4 }}>
                    MY PROFILE
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                            {member.nickname}
                        </Typography>
                        <Typography variant="caption" sx={{
                            bgcolor: 'grey.100',
                            px: 1,
                            py: 0.2,
                            borderRadius: 1,
                            color: 'text.secondary',
                            fontWeight: 500
                        }}>
                            {member.role}
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => router.push('/mypage/profile')}
                        sx={{
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            '&:hover': {
                                borderColor: 'primary.dark',
                                backgroundColor: 'rgba(92, 45, 145, 0.04)'
                            }
                        }}
                    >
                        프로필 수정
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 4, borderColor: 'divider' }} />

            <Box sx={{ mb: 2 }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.75rem', display: 'block', lineHeight: 1.4 }}>
                    MY TALKS
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mt: 0.5 }}>
                    내가 작성한 톡
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Stack spacing={3}>
                    {talks.length === 0 ? (
                        <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                            작성한 톡이 없습니다.
                        </Typography>
                    ) : (
                        talks.map(talk => (
                            <Box key={talk.id} sx={{ mb: 2 }}>
                                <TalkItem
                                    talk={talk}
                                    showBookInfo={true}
                                    isMyPageMode={true}
                                    onReaction={handleTalkReaction}
                                    currentMemberId={member.id}
                                    onUpdate={refresh}
                                />
                            </Box>
                        ))
                    )}
                    {hasMore && talks.length > 0 && (
                        <Box sx={{ textAlign: 'center', pt: 2 }}>
                            <Button onClick={loadMore} variant="outlined" color="primary">
                                더보기
                            </Button>
                        </Box>
                    )}
                </Stack>
            )}

            <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid', borderColor: 'divider', textAlign: 'right' }}>
                <Button
                    color="primary"
                    onClick={() => setIsWithdrawalOpen(true)}
                    sx={{ textDecoration: 'underline' }}
                >
                    회원 탈퇴
                </Button>
            </Box>

            <WithdrawalDialog
                open={isWithdrawalOpen}
                onClose={() => setIsWithdrawalOpen(false)}
            />
        </PagePaper>
    );
};

export default MyPage;
