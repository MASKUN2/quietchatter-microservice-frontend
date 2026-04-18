import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchBooks } from '../api/api';
import type { Book, SliceInfo } from '../types';
import { useIntersectionObserver } from './useIntersectionObserver';

export const useBookSearch = () => {
  const searchParams = useSearchParams();
  const keyword = searchParams?.get('keyword') || '';
  
  const [books, setBooks] = useState<Book[]>([]);
  const [sliceInfo, setSliceInfo] = useState<SliceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const hasNextPage = Boolean(sliceInfo && !sliceInfo.last);

  const lastBookElementRef = useIntersectionObserver({
    loading,
    hasNextPage,
    onIntersect: () => setPage((prev) => prev + 1),
  });

  useEffect(() => {
    setBooks([]);
    setPage(0);
    setSliceInfo(null);
  }, [keyword]);

  const fetchBooks = useCallback(async (kw: string, pg: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchBooks(kw, pg);
      if (pg === 0) {
        setBooks(data.content);
      } else {
        setBooks(prev => [...prev, ...data.content]);
      }
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...info } = data;
      setSliceInfo(info as SliceInfo);
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (keyword) {
      fetchBooks(keyword, page);
    }
  }, [keyword, page, fetchBooks]);

  return {
    keyword,
    books,
    sliceInfo,
    loading,
    error,
    lastBookElementRef
  };
};
