"use client";

import React from 'react';
import Link from 'next/link';
import { Card, Box, CardMedia, CardContent, Typography, Link as MuiLink, useTheme, useMediaQuery } from '@mui/material';
import type { Book } from '../../types';

interface BookListItemProps {
  book: Book;
}

const BookListItem: React.FC<BookListItemProps> = ({ book }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ 
      display: 'flex', 
      mb: isMobile ? 0 : 2, 
      alignItems: 'center',
      borderRadius: isMobile ? 0 : 1,
      boxShadow: isMobile ? 'none' : undefined,
      borderBottom: isMobile ? '1px solid #eee' : undefined
    }}>
        <Box sx={{ p: 2 }}>
            {book.thumbnailImageUrl ? (
                <MuiLink component={Link} href={`/books/${book.id}`}>
                    <CardMedia
                        component="img"
                        sx={{ width: 60, height: 90, objectFit: 'contain' }}
                        image={book.thumbnailImageUrl}
                        alt={book.title}
                    />
                </MuiLink>
            ) : (
                <Box sx={{ width: 60, height: 90, bgcolor: 'grey.300' }} />
            )}
        </Box>
        <CardContent sx={{ flex: '1 0 auto', overflow: 'hidden' }}>
            <Typography component="h5" variant="h6" noWrap>
                <MuiLink component={Link} href={`/books/${book.id}`} color="inherit" underline="hover">
                    {book.title}
                </MuiLink>
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
                저자: {book.author}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
                ISBN: {book.isbn}
            </Typography>
        </CardContent>
    </Card>
  );
};

export default BookListItem;
