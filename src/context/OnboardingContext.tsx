"use client";

import React, { createContext, useContext, useRef } from 'react';

/**
 * OnboardingContext
 *
 * 온보딩 툴팁이 필요한 ref들을 컴포넌트 트리를 가로질러 공유합니다.
 * - Header: logoRef, searchRef, vocRef, loginRef를 소유
 * - Home: timerRef를 등록
 * - RecommendedTalks: recommendedTalkRef를 등록
 * - HomeOnboarding: 모든 ref를 읽어 툴팁 렌더링
 */

export interface OnboardingRefs {
    logoRef: React.RefObject<HTMLElement | null>;
    searchRef: React.RefObject<HTMLElement | null>;
    vocRef: React.RefObject<HTMLElement | null>;
    loginRef: React.RefObject<HTMLElement | null>;
    timerRef: React.RefObject<HTMLElement | null>;
    /** 홈 화면 첫 번째 추천 북톡 카드 */
    recommendedTalkRef: React.RefObject<HTMLElement | null>;
}

const OnboardingContext = createContext<OnboardingRefs | null>(null);

/** Context Provider: App 루트 혹은 Layout 컴포넌트에서 감싸세요 */
export const OnboardingProvider: React.FC<{
    children: React.ReactNode;
    refs: OnboardingRefs;
}> = ({ children, refs }) => {
    return (
        <OnboardingContext.Provider value={refs}>
            {children}
        </OnboardingContext.Provider>
    );
};

/** ref 오브젝트를 읽는 훅 */
export function useOnboardingRefs(): OnboardingRefs {
    const ctx = useContext(OnboardingContext);
    if (!ctx) throw new Error('useOnboardingRefs must be used within OnboardingProvider');
    return ctx;
}

/**
 * useOnboardingRefsState
 *
 * OnboardingProvider를 사용하는 컴포넌트(App 혹은 Layout)에서 refs를 생성할 때
 * 이 훅을 사용하여 한 곳에서 모든 ref를 보관합니다.
 */
export function useOnboardingRefsState(): OnboardingRefs {
    const logoRef = useRef<HTMLElement | null>(null);
    const searchRef = useRef<HTMLElement | null>(null);
    const vocRef = useRef<HTMLElement | null>(null);
    const loginRef = useRef<HTMLElement | null>(null);
    const timerRef = useRef<HTMLElement | null>(null);
    const recommendedTalkRef = useRef<HTMLElement | null>(null);
    return { logoRef, searchRef, vocRef, loginRef, timerRef, recommendedTalkRef };
}
