"use client";

import React from 'react';
import Link from 'next/link';
import { List, ListItem, ListItemButton, ListItemAvatar, ListItemText, Avatar, Typography, Stack, Box, Skeleton, Alert } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import type { Talk, Book } from '../../types';
import { useOnboardingRefs } from '../../context/OnboardingContext';

interface RecommendedTalksProps {
  loading: boolean;
  error: string | null;
  talks: Talk[];
  books: Map<string, Book>;
}

const RecommendedTalks: React.FC<RecommendedTalksProps> = ({ loading, error, talks, books }) => {
  const { recommendedTalkRef } = useOnboardingRefs();

  if (loading) {
    return (
      <List sx={{ py: 0 }}>
        {Array.from(new Array(6)).map((_, index) => (
          <ListItem key={index} disablePadding sx={{ mb: 1.5 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                p: { xs: 1.5, sm: 2 },
              }}
            >
              <Box sx={{ mr: { xs: 1, sm: 2 } }}>
                <Skeleton variant="rectangular" width={50} height={75} sx={{ borderRadius: 1 }} />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="30%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
              </Box>
              <Stack direction="row" spacing={1.5} sx={{ ml: 2, alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
                  <Skeleton variant="text" width={16} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="circular" width={16} height={16} sx={{ mr: 0.5 }} />
                  <Skeleton variant="text" width={16} />
                </Box>
              </Stack>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (talks.length === 0) return <Typography color="textSecondary">최근 등록된 북톡이 없습니다.</Typography>;

  return (
    <List sx={{ py: 0 }}>
      {talks.map((talk, index) => {
        const book = books.get(talk.bookId);
        if (!book) return null;
        const truncatedContent = talk.content.length > 100 ? talk.content.substring(0, 100) + '...' : talk.content;

        const cardContent = (
          <ListItem disablePadding sx={{ mb: 1.5 }}>
            <ListItemButton
              component={Link}
              href={`/books/${book.id}`}
              sx={{
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                p: { xs: 1.5, sm: 2 },
                '&:hover': {
                  borderColor: 'primary.light',
                  backgroundColor: 'rgba(92, 45, 145, 0.02)'
                }
              }}
            >
              <ListItemAvatar sx={{ mr: { xs: 1, sm: 2 } }}>
                <Avatar
                  variant="rounded"
                  src={book.thumbnailImageUrl || '/images/quiet-chatter-icon.png'}
                  alt={book.title}
                  sx={{ width: 50, height: 75, boxShadow: 1 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="600" noWrap>
                    {book.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary" noWrap component="span" display="block">
                      {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.primary" noWrap component="span" display="block" sx={{ fontStyle: 'italic', mt: 0.5, opacity: 0.8 }}>
                      &quot;{truncatedContent}&quot;
                    </Typography>
                  </>
                }
              />
              <Stack direction="row" spacing={1.5} sx={{ ml: 2, alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
                <Typography variant="caption" display="flex" alignItems="center" color={talk.didILike ? "primary.main" : "text.secondary"}>
                  {talk.didILike ? <ThumbUpAltIcon fontSize="small" sx={{ mr: 0.5 }} /> : <ThumbUpOffAltIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {talk.like_count}
                </Typography>
                <Typography variant="caption" display="flex" alignItems="center" color={talk.didISupport ? "error.main" : "text.secondary"}>
                  {talk.didISupport ? <FavoriteIcon fontSize="small" sx={{ mr: 0.5 }} /> : <FavoriteBorderIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {talk.support_count}
                </Typography>
              </Stack>
            </ListItemButton>
          </ListItem>
        );

        // 첫 번째 카드에만 recommendedTalkRef를 부착한 Box를 감쌉니다 (온보딩 툴팁 anchor).
        // plain div인 Box는 HTMLElement ref를 타입 제약 없이 받을 수 있습니다.
        if (index === 0) {
          return (
            <Box key={talk.id} ref={recommendedTalkRef}>
              {cardContent}
            </Box>
          );
        }

        return <React.Fragment key={talk.id}>{cardContent}</React.Fragment>;
      })}
    </List>
  );
};

export default RecommendedTalks;
