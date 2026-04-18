"use client";

import { useState, useEffect, useCallback } from 'react';
import { getRecommendedTalks, getBooksByIds } from '../api/api';
import type { Talk, Book } from '../types';
import { MESSAGES } from '../constants';

export const useHomeData = () => {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [books, setBooks] = useState<Map<string, Book>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      else setIsRefreshing(true);

      const recommendedTalks = await getRecommendedTalks();

      if (!Array.isArray(recommendedTalks)) {
        setTalks([]);
        return;
      }

      setTalks(recommendedTalks);

      if (recommendedTalks.length > 0) {
        const bookIds = Array.from(new Set(recommendedTalks.map(t => t.bookId)));
        const booksData = await getBooksByIds(bookIds);
        setBooks(new Map(booksData.map(b => [b.id, b])));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : MESSAGES.ERROR.DEFAULT);
    } finally {
      if (!isBackground) setLoading(false);
      else setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    if (loading || isRefreshing) return;
    await fetchData(true);
  }, [loading, isRefreshing, fetchData]);

  return { talks, books, loading, isRefreshing, refreshData, error };
};
