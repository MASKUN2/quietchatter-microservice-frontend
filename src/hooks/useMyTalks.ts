"use client";

import { useState, useEffect, useCallback } from 'react';
import { getMyTalks, handleReaction, getBooksByIds } from '../api/api';
import type { Talk } from '../types';
import { useToast } from './useToast';
import { MESSAGES } from '../constants';

export const useMyTalks = (isLoggedIn: boolean) => {
    const { showToast } = useToast();

    const [talks, setTalks] = useState<Talk[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchTalks = useCallback(async (pageNum: number, isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const data = await getMyTalks(pageNum);

            const bookIds = Array.from(new Set(data.content.map(t => t.bookId)));
            const booksData = await getBooksByIds(bookIds);
            const booksMap = new Map(booksData.map(b => [b.id, b]));

            const enrichedTalks = data.content.map(t => {
                const book = booksMap.get(t.bookId);
                return {
                    ...t,
                    book: book ? {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        cover: book.thumbnailImageUrl || ''
                    } : undefined
                };
            });

            setTalks(prev => isInitial ? enrichedTalks : [...prev, ...enrichedTalks]);
            setHasMore(!data.page.last);
        } catch (error: unknown) {
            console.error('Failed to fetch my talks:', error);
        } finally {
            if (isInitial) setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchTalks(0, true);
        }
    }, [isLoggedIn, fetchTalks]);

    const loadMore = useCallback(() => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTalks(nextPage);
    }, [page, fetchTalks]);

    const handleTalkReaction = useCallback(async (talkId: string, type: 'LIKE' | 'SUPPORT', hasReacted: boolean) => {
        try {
            await handleReaction(talkId, type, hasReacted);
            setTalks(prev => prev.map(talk => {
                if (talk.id !== talkId) return talk;

                let likeCount = talk.like_count ?? 0;
                let supportCount = talk.support_count ?? 0;
                let didILike = talk.didILike;
                let didISupport = talk.didISupport;

                if (type === 'LIKE') {
                    didILike = !hasReacted;
                    likeCount += didILike ? 1 : -1;
                } else {
                    didISupport = !hasReacted;
                    supportCount += didISupport ? 1 : -1;
                }

                return {
                    ...talk,
                    like_count: likeCount,
                    support_count: supportCount,
                    didILike,
                    didISupport
                };
            }));
        } catch (error: unknown) {
            if (error instanceof Error) {
                showToast(error.message, 'error');
            } else {
                showToast(MESSAGES.ERROR.REACTION_FAILED, 'error');
            }
        }
    }, [showToast]);

    const refresh = useCallback(() => {
        setPage(0);
        fetchTalks(0, true);
    }, [fetchTalks]);

    return { talks, loading, hasMore, loadMore, handleTalkReaction, refresh };
};
