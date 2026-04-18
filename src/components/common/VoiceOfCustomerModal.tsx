"use client";

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, Box } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { sendVocMessage } from '../../api/api';
import { MESSAGES } from '../../constants';

const VoiceOfCustomerModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert(MESSAGES.ERROR.INPUT_REQUIRED);
      return;
    }

    setLoading(true);
    try {
      await sendVocMessage(message);
      alert(MESSAGES.SUCCESS.VOC_SENT);
      setMessage('');
      handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(MESSAGES.ERROR.VOC_SEND_FAILED);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Button 
          variant="outlined" 
          onClick={handleOpen}
          startIcon={<ChatBubbleOutlineIcon />}
          sx={{ 
            display: { xs: 'none', md: 'inline-flex' },
            color: 'primary.main',
            borderColor: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'rgba(92, 45, 145, 0.04)'
            }
          }}
        >
          무엇이든 말씀해주세요
        </Button>
         <IconButton 
          onClick={handleOpen}
          sx={{ 
            display: { xs: 'inline-flex', md: 'none' },
            color: 'primary.main'
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Voice of Customer</DialogTitle>
        <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="message"
                label="메시지를 남겨주세요"
                type="text"
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                placeholder="서비스에 대한 소중한 의견을 남겨주세요."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="inherit">
                취소
              </Button>
              <Button 
                type="submit" 
                variant="outlined" 
                disabled={loading}
                sx={{ 
                  color: 'primary.main', 
                  borderColor: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'rgba(92, 45, 145, 0.04)'
                  }
                }}
              >
                {loading ? '전송 중...' : '전송'}
              </Button>
            </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default VoiceOfCustomerModal;
