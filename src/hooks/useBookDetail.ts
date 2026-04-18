import { useState, useEffect, useCallback } from 'react';
import { getBookDetails, getTalks, postTalk, handleReaction } from '../api/api';
import type { Book, Talk, PageInfo } from '../types';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { MESSAGES } from '../constants';

export const useBookDetail = (bookId: string | undefined) => {
  const [book, setBook] = useState<Book | null>(null);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const { member, refreshMember } = useAuth();
  const { showToast } = useToast();
  const [loadingBook, setLoadingBook] = useState(true);
  const [loadingTalks, setLoadingTalks] = useState(true);

  // Talk Form State
  const [talkContent, setTalkContent] = useState('');

  // Current Talk Page
  const [talkPage, setTalkPage] = useState(0);

  const loadBook = useCallback(async (id: string) => {
    try {
      setLoadingBook(true);
      const data = await getBookDetails(id);
      setBook(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingBook(false);
    }
  }, []);

  const loadTalks = useCallback(async (id: string, page: number) => {
    try {
      setLoadingTalks(true);

      // 톡 목록을 불러오기 전 사용자 인증 정보를 갱신 (최신 세션 정보 반영)
      if (page === 0) {
        await refreshMember();
      }

      const data = await getTalks(id, page);
      setTalks(data.content);
      setPageInfo(data.page);
      setTalkPage(page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTalks(false);
    }
  }, [refreshMember]);

  const onTalkUpdate = useCallback(() => {
    if (bookId) {
      loadTalks(bookId, talkPage);
    }
  }, [bookId, talkPage, loadTalks]);

  useEffect(() => {
    if (bookId) {
      loadBook(bookId);
      loadTalks(bookId, 0);
    }
  }, [bookId, loadBook, loadTalks]);

  const onPostTalk = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId || !talkContent.trim()) return;

    try {
      await postTalk(bookId, talkContent);
      setTalkContent('');
      await loadTalks(bookId, 0);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(MESSAGES.ERROR.TALK_POST_FAILED, 'error');
      }
    }
  }, [bookId, talkContent, loadTalks, showToast]);

  const onReaction = useCallback(async (talkId: string, type: 'LIKE' | 'SUPPORT', hasReacted: boolean) => {
    if (!member?.isLoggedIn) {
      showToast(MESSAGES.ERROR.LOGIN_REQUIRED, 'error');
      return;
    }
    try {
      await handleReaction(talkId, type, hasReacted);

      setTalks(prev => prev.map(t => {
        if (String(t.id) !== String(talkId)) return t;
        const isLike = type === 'LIKE';

        if (isLike) {
          return {
            ...t,
            didILike: !hasReacted,
            like_count: hasReacted ? (t.like_count ?? 0) - 1 : (t.like_count ?? 0) + 1
          };
        }

        return {
          ...t,
          didISupport: !hasReacted,
          support_count: hasReacted ? (t.support_count ?? 0) - 1 : (t.support_count ?? 0) + 1
        };
      }));

    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(MESSAGES.ERROR.REACTION_FAILED, 'error');
      }
      if (bookId) loadTalks(bookId, talkPage);
    }
  }, [member?.isLoggedIn, bookId, talkPage, loadTalks, showToast]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (bookId) loadTalks(bookId, value - 1);
  };

  return {
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
  };
};
