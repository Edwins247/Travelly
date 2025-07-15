'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { journeyAnalytics } from '@/utils/analytics';

/**
 * 페이지 진입/이탈 및 사용자 여정을 자동으로 추적하는 훅
 */
export function usePageTracking(pageName: string, additionalParams?: Record<string, string | number | boolean>) {
  const pathname = usePathname();
  const enterTime = useRef<number>(Date.now());
  const previousPage = useRef<string | null>(null);
  const scrollDepth = useRef<number>(0);

  // 스크롤 깊이 추적
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      scrollDepth.current = Math.max(scrollDepth.current, scrollPercent || 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 페이지 진입 추적
  useEffect(() => {
    enterTime.current = Date.now();
    
    // 이전 페이지에서 현재 페이지로의 플로우 추적
    if (previousPage.current) {
      journeyAnalytics.userFlow(
        previousPage.current,
        pageName,
        'navigation',
        { pathname, ...additionalParams }
      );
    }

    // 페이지 진입 이벤트
    journeyAnalytics.enterPage(pageName, undefined, additionalParams);

    // 현재 페이지를 이전 페이지로 설정
    return () => {
      previousPage.current = pageName;
    };
  }, [pageName, pathname, additionalParams]);

  // 페이지 이탈 추적 (언마운트 시)
  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - enterTime.current;
      journeyAnalytics.exitPage(pageName, timeSpent, scrollDepth.current);
    };
  }, [pageName]);

  // 브라우저 종료/새로고침 시 이탈 추적
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - enterTime.current;
      journeyAnalytics.exitPage(pageName, timeSpent, scrollDepth.current);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pageName]);
}

/**
 * 전환 퍼널 추적을 위한 훅
 */
export function useConversionFunnel() {
  const startFunnelStep = (step: string, metadata?: Record<string, string | number | boolean>) => {
    journeyAnalytics.conversionFunnel(step, 'start', metadata);
  };

  const completeFunnelStep = (step: string, metadata?: Record<string, string | number | boolean>) => {
    journeyAnalytics.conversionFunnel(step, 'complete', metadata);
  };

  const abandonFunnelStep = (step: string, metadata?: Record<string, string | number | boolean>) => {
    journeyAnalytics.conversionFunnel(step, 'abandon', metadata);
  };

  return {
    startFunnelStep,
    completeFunnelStep,
    abandonFunnelStep,
  };
}

/**
 * 사용자 참여도 추적을 위한 훅
 */
export function useEngagementTracking() {
  const trackClick = (target: string, value?: number) => {
    journeyAnalytics.engagement('click', target, value);
  };

  const trackScroll = (depth: number) => {
    journeyAnalytics.engagement('scroll', 'page', depth);
  };

  const trackHover = (target: string, duration?: number) => {
    journeyAnalytics.engagement('hover', target, duration);
  };

  const trackFocus = (target: string) => {
    journeyAnalytics.engagement('focus', target);
  };

  return {
    trackClick,
    trackScroll,
    trackHover,
    trackFocus,
  };
}
