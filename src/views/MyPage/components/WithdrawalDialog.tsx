"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from '@mui/material';
import { deactivateAccount } from '../../../api/api';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface WithdrawalDialogProps {
    open: boolean;
    onClose: () => void;
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({ open, onClose }) => {
    const { refreshMember } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorInfo, setErrorInfo] = useState<string | null>(null);

    const handleWithdrawal = async () => {
        setLoading(true);
        setErrorInfo(null);
        try {
            await deactivateAccount();
            await refreshMember();
            onClose();
            router.replace('/home');
        } catch (error: unknown) {
            setErrorInfo(error instanceof Error ? error.message : '회원탈퇴에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="xs">
            <DialogTitle>회원 탈퇴</DialogTitle>
            <DialogContent>
                {errorInfo && <Alert severity="error" sx={{ mb: 2 }}>{errorInfo}</Alert>}
                <Typography variant="body1" color="primary.main" fontWeight="bold" gutterBottom>
                    정말로 탈퇴하시겠습니까?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    탈퇴 시 작성하신 모든 톡은 숨김 처리되며, 계정은 비활성화됩니다. 다시 로그인하여 계정을 재활성화할 수 있습니다.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={loading} color="inherit">
                    취소
                </Button>
                <Button onClick={handleWithdrawal} disabled={loading} variant="contained" color="primary">
                    {loading ? '처리 중...' : '탈퇴하기'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WithdrawalDialog;
