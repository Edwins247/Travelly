// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { SearchBar } from '@/components/home/SearchBar';
import { KeywordChips } from '@/components/home/KeywordChips';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { PageLoader } from '@/components/common/PageLoader';
import { NetworkAware } from '@/components/common/NetworkStatus';
import { performanceTracking, stopTrace } from '@/utils/performance';
import { usePageTracking } from '@/hooks/usePageTracking';
import { usePlaces } from '@/hooks/usePlaces';


export default function Home() {
  const hotKeywords = [
    '혼자 힐링',
    '겨울 실내',
    '가족 여행',
    '사진맛집',
    '반려동물',
    '역사 탐방',
  ];

  // 페이지 추적
  usePageTracking('home', { page_type: 'landing' });

  // React Query로 장소 목록 가져오기
  const {
    data: places = [],
    isLoading: loading,
    error: queryError,
    refetch: fetchPlaces
  } = usePlaces({});

  // 에러 메시지 변환
  const error = queryError ? '여행지 목록을 불러오는데 실패했습니다.' : undefined;

  // 성능 추적을 위한 useEffect
  useEffect(() => {
    if (!loading) {
      // 메인 페이지 로딩 성능 추적
      const homePageTrace = performanceTracking.trackPageLoad('home');
      stopTrace(homePageTrace);
    }
  }, [loading]);

  // 전체 페이지 로딩 중일 때는 전체 로더 표시
  if (loading) {
    return <PageLoader showHeader={false} showFooter={false} />;
  }

  return (
    <main className="flex flex-col items-center gap-6 py-16">
      <div className="w-full max-w-6xl space-y-6 px-4">
        <SearchBar />
        <KeywordChips keywords={hotKeywords} />
        <CategoryGrid />

        {/* 여행지 목록 */}
        <NetworkAware>
          <PlaceGrid
            title="추천 여행지"
            places={places}
            isLoading={loading}
            error={error || undefined}
            onRetry={fetchPlaces}
          />
        </NetworkAware>
      </div>
    </main>
  );
}
