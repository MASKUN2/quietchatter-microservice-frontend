"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Divider, Box, Typography, Pagination, Skeleton, Alert, Dialog, DialogContent, DialogTitle, Stack } from '@mui/material';
import BookInfo from '../components/book/BookInfo';
import TalkForm from '../components/book/TalkForm';
import TalkList from '../components/book/TalkList';
import NaverLogin from '../components/common/NaverLogin';
import PagePaper from '../components/common/PagePaper';
import { useBookDetail } from '../hooks/useBookDetail';

const BookDetail: React.FC = () => {
  const params = useParams();
  const bookId = params?.bookId as string;
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const {
    book,
    talks,
    pageInfo,
    member,
    loadingBook,
    loadingTalks,
    talkContent,
    setTalkContent,
    talkPage,
    onPostTalk,
    onReaction,
    onTalkUpdate,
    handlePageChange
  } = useBookDetail(bookId);

  if (loadingBook) {
    return (
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (!book) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">책 정보를 찾을 수 없습니다.</Alert>
      </Box>
    );
  }

  return (
    <>
      <Stack spacing={{ xs: 2, md: 4 }}>
        <BookInfo book={book} />
        <Divider />
        <Box>
          <PagePaper sx={{ p: { xs: 1, sm: 2 } }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.75rem', display: 'block', lineHeight: 1.4 }}>
                BOOK TALK
              </Typography>
              <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: '-0.02em', mt: 0.5 }}>
                Talks
              </Typography>
            </Box>

            {member?.isLoggedIn ? (
              <TalkForm
                content={talkContent}
                setContent={setTalkContent}
                onSubmit={onPostTalk}
                nickname={member?.nickname}
              />
            ) : (
              <TalkForm
                content={talkContent}
                setContent={setTalkContent}
                onSubmit={(e) => e.preventDefault()}
                isGuest={true}
                onLoginClick={() => setLoginModalOpen(true)}
              />
            )}

            <TalkList
              talks={talks}
              loading={loadingTalks}
              onReaction={onReaction}
              currentMemberId={member?.id}
              onUpdate={onTalkUpdate}
            />

            {pageInfo && pageInfo.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={pageInfo.totalPages}
                  page={talkPage + 1}
                  onChange={handlePageChange}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </PagePaper>
        </Box>
      </Stack>

      <Dialog
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          로그인
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
            서비스를 이용하시려면<br />로그인이 필요합니다.
          </Typography>
          <NaverLogin />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BookDetail;
