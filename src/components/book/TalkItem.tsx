"use client";

import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, IconButton, Stack, Tooltip, Avatar } from '@mui/material';
import Link from 'next/link';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateTalk, deleteTalk } from '../../api/api';
import type { Talk } from '../../types';
import CharacterLimitedTextField from '../common/CharacterLimitedTextField';
import { useToast } from '../../hooks/useToast';
import { MESSAGES } from '../../constants';

interface TalkItemProps {
  talk: Talk;
  onReaction: (talkId: string, type: 'LIKE' | 'SUPPORT', hasReacted: boolean) => void;
  currentMemberId?: string | null;
  onUpdate: () => void;
  showBookInfo?: boolean;
  isMyPageMode?: boolean;
}
const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const TalkItem: React.FC<TalkItemProps> = ({ talk, onReaction, currentMemberId, onUpdate, showBookInfo, isMyPageMode }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(talk.content);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const isMine = currentMemberId && String(talk.memberId) === String(currentMemberId);

  const handleUpdate = async () => {
    if (!editContent.trim() || editContent === talk.content) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await updateTalk(talk.id, editContent);
      setIsEditing(false);
      onUpdate();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(MESSAGES.ERROR.TALK_UPDATE_FAILED, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await deleteTalk(talk.id);
      showToast(MESSAGES.SUCCESS.TALK_DELETED, 'success');
      onUpdate();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(MESSAGES.ERROR.TALK_DELETE_FAILED, 'error');
      }
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mx: 0 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {showBookInfo && talk.book && (
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Link href={`/books/${talk.book.id}`}>
              <Avatar
                variant="rounded"
                src={talk.book.cover || '/images/quiet-chatter-icon.png'}
                alt={talk.book.title}
                sx={{ width: 44, height: 64, boxShadow: 1, '&:hover': { opacity: 0.8 } }}
              />
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
              <Typography
                component={Link}
                href={`/books/${talk.book.id}`}
                variant="subtitle2"
                fontWeight={700}
                color="text.primary"
                noWrap
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' }, display: 'block' }}
              >
                {talk.book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {talk.book.author}
              </Typography>
            </Box>
          </Box>
        )}

        <Tooltip title="1년후에 자동으로 숨겨집니다" placement="top" arrow>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1.5, cursor: 'help', width: 'fit-content' }}>
            <AccessTimeIcon sx={{ fontSize: '0.875rem' }} />
            <Typography variant="caption">
              {formatDate(talk.createdAt)}
              {talk.is_modified && ' (수정됨)'}
            </Typography>
            <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 500 }}>
              by {talk.nickname}
            </Typography>
          </Box>
        </Tooltip>

        {isEditing ? (
          <Box sx={{ mb: 2 }}>
            <CharacterLimitedTextField
              fullWidth
              multiline
              rows={3}
              maxLength={250}
              value={editContent}
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEditContent(e.target.value)}
              disabled={loading}
              sx={{ mb: 1 }}
              slotProps={{ htmlInput: { style: { fontSize: '1rem' } } }}
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" onClick={() => setIsEditing(false)} disabled={loading}>취소</Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleUpdate}
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
                저장
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="body1" sx={{ flexGrow: 1, whiteSpace: 'pre-wrap' }}>
              {talk.content}
            </Typography>
            {isMine && !isMyPageMode && (
              <Box sx={{ ml: 1, mt: -0.5 }}>
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleDelete} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            {isMine && isMyPageMode && (
              <Box sx={{ ml: 1, mt: -0.5 }}>
                <IconButton size="small" onClick={handleDelete} color="error">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isMyPageMode ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ThumbUpAltIcon fontSize="small" sx={{ mr: 0.5, color: 'text.disabled' }} />
                  {talk.like_count || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                  <FavoriteIcon fontSize="small" sx={{ mr: 0.5, color: 'text.disabled' }} />
                  {talk.support_count || 0}
                </Typography>
              </>
            ) : (
              <>
                <Button
                  size="small"
                  color={talk.didILike ? "primary" : "inherit"}
                  startIcon={talk.didILike ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                  onClick={() => onReaction(talk.id, 'LIKE', talk.didILike)}
                >
                  {talk.like_count}
                </Button>
                <Button
                  size="small"
                  color={talk.didISupport ? "error" : "inherit"}
                  startIcon={talk.didISupport ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={() => onReaction(talk.id, 'SUPPORT', talk.didISupport)}
                >
                  {talk.support_count}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TalkItem;