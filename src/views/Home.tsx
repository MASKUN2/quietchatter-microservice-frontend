"use client";

import React from 'react';
import { Typography, Box, Stack } from '@mui/material';
import PagePaper from '../components/common/PagePaper';
import RecommendedTalks from '../components/home/RecommendedTalks';
import UpdateLog from '../components/home/UpdateLog';
import RecommendedTalksTimer from '../components/home/RecommendedTalksTimer';
import { useHomeData } from '../hooks/useHomeData';
import { useOnboardingRefs } from '../context/OnboardingContext';

const Home: React.FC = () => {
  const { talks, books, loading, isRefreshing, refreshData, error } = useHomeData();

  // timerRef를 context에서 가져와 RecommendedTalksTimer 컨테이너에 부착합니다.
  const { timerRef } = useOnboardingRefs();

  return (
    <Stack spacing={{ xs: 2, md: 4 }}>
      <PagePaper
        sx={{
          minHeight: 250,
          overflow: 'hidden',
          px: { xs: 1, sm: 2 },
          pt: { xs: 2, sm: 3 },
          pb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.75rem', display: 'block', lineHeight: 1.4 }}>
              FOR YOU
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mt: 0.5 }}>
              당신을 위한 북톡 <Typography component="span" variant="caption" color="text.secondary" sx={{ fontWeight: 400 }}>BookTalk</Typography>
            </Typography>
          </Box>
          {!loading && !error && (
            <Box ref={timerRef} sx={{ display: 'inline-flex' }}>
              <RecommendedTalksTimer
                onRefresh={refreshData}
                isRefreshing={isRefreshing}
                intervalMs={45000}
              />
            </Box>
          )}
        </Box>
        <RecommendedTalks
          loading={loading}
          error={error}
          talks={talks}
          books={books}
        />
      </PagePaper>

      <UpdateLog />
    </Stack >
  );
};

export default Home;
