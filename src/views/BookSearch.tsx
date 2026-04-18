"use client";

import React from 'react';
import { Box, Alert, Skeleton, Stack, Typography } from '@mui/material';
import BookListItem from '../components/book/BookListItem';
import { useBookSearch } from '../hooks/useBookSearch';

const BookSearch: React.FC = () => {
  const { keyword, books, loading, error, lastBookElementRef } = useBookSearch();

  return (
    <Box sx={{ minHeight: 500 }}>
      {/* Section header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: '0.2em', fontSize: '0.75rem', display: 'block', lineHeight: 1.4 }}>
          SEARCH RESULTS
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mt: 0.5 }}>
          {keyword ? `"${keyword}" 검색 결과` : '책 검색'}
          {!loading && !error && books.length > 0 && (
            <Typography component="span" variant="caption" color="text.secondary" sx={{ fontWeight: 400, ml: 1 }}>
              {books.length}권
            </Typography>
          )}
        </Typography>
      </Box>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div key={book.id} ref={lastBookElementRef}>
              <BookListItem book={book} />
            </div>
          );
        } else {
          return <BookListItem key={book.id} book={book} />;
        }
      })}

      {loading && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {Array.from(new Array(3)).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', height: 122, alignItems: 'center', p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Skeleton variant="rectangular" width={60} height={90} sx={{ mr: 2 }} />
              <Box sx={{ width: '100%' }}>
                <Skeleton width="60%" height={32} />
                <Skeleton width="40%" />
                <Skeleton width="30%" />
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!loading && !error && books.length === 0 && keyword && (
        <Alert severity="info" sx={{ mt: 2 }}>검색 결과가 없습니다.</Alert>
      )}
    </Box>
  );
};

export default BookSearch;