"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';
import { LATEST_TERMS } from '../../constants/terms';
import { validateNickname } from '../../utils/validation';

interface SignupModalProps {
  open: boolean;
  tempNickname: string;
  onSignup: (nickname: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

const SignupModal: React.FC<SignupModalProps> = ({ open, tempNickname, onSignup, onCancel, loading }) => {
  const [nickname, setNickname] = useState(tempNickname);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateNickname(nickname);
    if (!validation.isValid) {
      setError(validation.message || null);
      return;
    }
    if (!agreed) {
      alert('이용약관 및 개인정보 수집에 동의해야 가입할 수 있습니다.');
      return;
    }
    await onSignup(nickname);
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} fullWidth maxWidth="xs">
      <DialogTitle>회원가입</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            아직 회원이 아니시군요! 아래 필수 약관에 동의하시고 가입을 완료해주세요.
          </Typography>

          <Box sx={{
            maxHeight: 180,
            overflowY: 'auto',
            p: 2,
            mb: 2,
            mt: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'grey.50'
          }}>
            {LATEST_TERMS.sections.map((section, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary.main" fontWeight="bold">
                  {section.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {section.content}
                </Typography>
              </Box>
            ))}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={loading}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" fontWeight="bold">
                (필수) 이용약관 및 개인정보 수집에 동의합니다.
              </Typography>
            }
            sx={{ mb: 2 }}
          />

          <TextField
            autoFocus
            margin="dense"
            label="닉네임"
            type="text"
            fullWidth
            variant="outlined"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              if (error) setError(null);
            }}
            error={Boolean(error)}
            helperText={error || '1~12자의 한글, 영문, 숫자, 공백, _, -를 사용할 수 있습니다. (공백/기호는 중간에만 가능)'}
            disabled={loading}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="inherit" disabled={loading}>
            취소
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !agreed}
          >
            {loading ? '가입 중...' : '가입하기'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SignupModal;
