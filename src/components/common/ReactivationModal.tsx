"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Alert } from '@mui/material';
import { reactivateAccount, ApiError } from '../../api/api';

interface ReactivationModalProps {
    open: boolean;
    reactivationToken: string;
    onReactivated: (message: string) => Promise<void>;
    onCancel: () => void;
    onTokenExpired: () => void;
}

const ReactivationModal: React.FC<ReactivationModalProps> = ({ open, reactivationToken, onReactivated, onCancel, onTokenExpired }) => {
    const [loading, setLoading] = useState(false);
    const [errorInfo, setErrorInfo] = useState<string | null>(null);

    const handleReactivate = async () => {
        setLoading(true);
        setErrorInfo(null);
        try {
            await reactivateAccount(reactivationToken);
            await onReactivated('계정이 성공적으로 재활성화되었습니다. 환영합니다!');
        } catch (error: unknown) {
            if (error instanceof ApiError && error.response?.status === 401) {
                onTokenExpired();
            } else {
                setErrorInfo(error instanceof Error ? error.message : '계정 재활성화에 실패했습니다.');
            }
        } finally {
            if (open) { // In case the modal wasn't closed
                setLoading(false);
            }
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onCancel} fullWidth maxWidth="xs">
            <DialogTitle>계정 재활성화</DialogTitle>
            <DialogContent>
                {errorInfo && (
                    <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{errorInfo}</Alert>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} gutterBottom>
                    회원님의 계정은 현재 비활성화 상태입니다. 서비스를 다시 이용하시려면 아래 버튼을 눌러 계정을 재활성화해주세요.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit" disabled={loading}>
                    취소
                </Button>
                <Button
                    onClick={handleReactivate}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                >
                    {loading ? '처리 중...' : '재활성화하기'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ReactivationModal;
