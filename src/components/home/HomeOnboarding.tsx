"use client";

import { useEffect, useState, useRef } from 'react';
import OnboardingTooltip from '../common/OnboardingTooltip';
import { useFirstVisit, VISIT_KEYS } from '../../hooks/useFirstVisit';
import { useOnboardingRefs } from '../../context/OnboardingContext';

/**
 * 각 툴팁 설정을 나타내는 타입.
 * 유지보수 시 TOOLTIP_STEPS 배열만 수정하면 됩니다.
 */
interface TooltipStep {
    /** 툴팁에 표시할 한국어 메시지 */
    message: string;
    /** 툴팁이 나타날 방향 */
    placement: 'bottom' | 'bottom-start' | 'bottom-end' | 'top' | 'top-start' | 'top-end' | 'left' | 'right';
    /** OnboardingRefs 의 키와 일치해야 합니다 */
    refKey: 'logoRef' | 'searchRef' | 'vocRef' | 'loginRef' | 'timerRef' | 'recommendedTalkRef';
}

/** ── 설정 영역 ───────────────────────────────────────────────────────────
 * 툴팁 순서, 메시지, 방향을 여기서만 관리합니다.
 * 순서를 바꾸거나 메시지를 수정하려면 이 배열만 편집하세요.
 * ─────────────────────────────────────────────────────────────────────── */
const TOOLTIP_STEPS: TooltipStep[] = [
    {
        refKey: 'logoRef',
        message: '🏠 로고를 누르면 언제든지 홈으로 돌아올 수 있어요!',
        placement: 'bottom',
    },
    {
        refKey: 'searchRef',
        message: '🔍 관심 있는 책이나 작가를 검색해보세요',
        placement: 'bottom',
    },
    {
        refKey: 'vocRef',
        message: '💬 서비스에 대한 자유로운 의견을 언제든 남겨주세요',
        placement: 'bottom-start',
    },
    {
        refKey: 'loginRef',
        message: '👤 네이버 계정으로 간편하게 로그인하세요',
        placement: 'bottom-end',
    },
    {
        refKey: 'timerRef',
        message: '⏱ 45초마다 새 북톡을 추천해요. 클릭하면 타이머를 연장할 수 있어요!',
        placement: 'bottom-end',
    },
    {
        refKey: 'recommendedTalkRef',
        message: '📖 북톡을 클릭하면 해당 책의 다양한 이야기를 볼 수 있어요. 한번 눌러보세요!',
        placement: 'top',
    },
];

/** 각 툴팁이 화면에 표시되는 시간 (ms) */
const DISPLAY_DURATION_MS = 6000;
/** 다음 툴팁이 나타나기 전 대기 시간 (ms) */
const GAP_BETWEEN_MS = 500;

/**
 * HomeOnboarding
 *
 * 최초 방문자에게만 홈 페이지의 주요 UI를 소개하는 툴팁 오케스트레이터입니다.
 * - OnboardingContext 에서 ref들을 읽습니다.
 * - TOOLTIP_STEPS 배열의 순서대로 툴팁을 순차 표시합니다.
 * - 모든 툴팁이 완료되면 localStorage에 방문 기록을 저장합니다.
 */
const HomeOnboarding: React.FC = () => {
    const { isFirstVisit, markVisited } = useFirstVisit(VISIT_KEYS.HOME);
    const refs = useOnboardingRefs();
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!isFirstVisit) return;

        // 첫 번째 툴팁 즉시 표시
        setActiveIndex(0);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isFirstVisit]);

    useEffect(() => {
        if (activeIndex < 0) return;

        // DISPLAY_DURATION_MS 이후 현재 툴팁 숨기고 다음으로 이동
        timerRef.current = setTimeout(() => {
            const nextIndex = activeIndex + 1;

            if (nextIndex < TOOLTIP_STEPS.length) {
                // GAP_BETWEEN_MS 대기 후 다음 툴팁 표시
                timerRef.current = setTimeout(() => {
                    setActiveIndex(nextIndex);
                }, GAP_BETWEEN_MS);
            } else {
                // 모든 툴팁 완료 → 방문 기록 저장
                setActiveIndex(-1);
                markVisited();
            }
        }, DISPLAY_DURATION_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [activeIndex, markVisited]);

    if (!isFirstVisit) return null;

    return (
        <>
            {TOOLTIP_STEPS.map((step, index) => {
                const anchorEl = refs[step.refKey]?.current ?? null;
                return (
                    <OnboardingTooltip
                        key={step.refKey}
                        anchorEl={anchorEl}
                        open={activeIndex === index}
                        message={step.message}
                        placement={step.placement}
                    />
                );
            })}
        </>
    );
};

export default HomeOnboarding;
