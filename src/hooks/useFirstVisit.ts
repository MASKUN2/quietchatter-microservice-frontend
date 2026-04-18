"use client";

import { useState, useEffect } from 'react';

/**
 * useFirstVisit
 *
 * localStorage의 키를 기반으로 특정 페이지/기능의 최초 방문 여부를 판단합니다.
 *
 * @param key  localStorage에 저장할 고유 키 이름
 *             - 홈 온보딩:       'hasVisited'
 *             - 책 상세 방문:    'hasVisitedBookDetail'
 *
 * - isFirstVisit: true이면 해당 키에 대한 최초 방문
 * - markVisited:  방문 완료 처리 함수
 */
export function useFirstVisit(key: string = 'hasVisited'): {
    isFirstVisit: boolean;
    markVisited: () => void;
} {
    const [isFirstVisit, setIsFirstVisit] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsFirstVisit(localStorage.getItem(key) !== 'true');
        }
    }, [key]);

    const markVisited = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, 'true');
            setIsFirstVisit(false);
        }
    };

    return { isFirstVisit, markVisited };
}

/** localStorage 키 상수 모음 — 여기에만 추가하면 됩니다 */
export const VISIT_KEYS = {
    /** 홈 온보딩 툴팁 완료 */
    HOME: 'hasVisited',
    /** 책 상세 페이지 방문 (전체 통틀어 한 번) */
    BOOK_DETAIL: 'hasVisitedBookDetail',
} as const;
