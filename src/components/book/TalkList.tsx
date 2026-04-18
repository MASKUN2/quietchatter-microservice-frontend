"use client";

import React from 'react';
import { Stack, Typography, Skeleton } from '@mui/material';
import TalkItem from './TalkItem';
import type { Talk } from '../../types';

interface TalkListProps {
  talks: Talk[];
  loading: boolean;
  onReaction: (talkId: string, type: 'LIKE' | 'SUPPORT', hasReacted: boolean) => void;
  currentMemberId?: string | null;
  onUpdate: () => void;
}

const TalkList: React.FC<TalkListProps> = ({ talks, loading, onReaction, currentMemberId, onUpdate }) => {
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton height={100} />
        <Skeleton height={100} />
        <Skeleton height={100} />
      </Stack>
    );
  }

  if (talks.length === 0) {
    return (
      <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
        아직 등록된 Talk가 없습니다. 첫 번째 이야기를 남겨보세요!
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {talks.map((talk) => (
        <TalkItem 
          key={talk.id} 
          talk={talk} 
          onReaction={onReaction} 
          currentMemberId={currentMemberId}
          onUpdate={onUpdate}
        />
      ))}
    </Stack>
  );
};

export default TalkList;
