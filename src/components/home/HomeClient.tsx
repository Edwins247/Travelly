'use client';

import { useEffect } from 'react';
import { SearchBar } from '@/components/home/SearchBar';
import { KeywordChips } from '@/components/home/KeywordChips';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { NetworkAware } from '@/components/common/NetworkStatus';
import { performanceTracking, stopTrace } from '@/utils/performance';
import { usePageTracking } from '@/hooks/usePageTracking';
import { usePlaces } from '@/hooks/usePlaces';
import type { PlaceCardData } from '@/types/place';

interface HomeClientProps {
  initialPlaces: PlaceCardData[];
  hotKeywords: string[];
}

export function HomeClient({ initialPlaces, hotKeywords }: HomeClientProps) {
  // 페이지 추적
  usePageTracking('home', { page_type: 'landing' });

  // React Query로 장소 목록 가져오기 (서버에서 받은 초기 데이터 사용)
  const {
    data: places = initialPlaces,
    isLoading: loading,
    error: queryError,
    refetch: fetchPlaces
  } = usePlaces({}, {
    // 서버에서 받은 초기 데이터가 있으면 즉시 사용
    initialData: initialPlaces,
    // 초기 데이터가 있으면 staleTime을 늘려서 불필요한 refetch 방지
    staleTime: initialPlaces.length > 0 ? 10 * 60 * 1000 : 5 * 60 * 1000,
  });
  
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

  return (
    <main className="flex flex-col items-center gap-6 py-8 sm:py-16">
      <div className="w-full max-w-6xl space-y-6 px-4 sm:px-6">
        <SearchBar />
        <KeywordChips keywords={hotKeywords} />
        <CategoryGrid />

        {/* 여행지 목록 */}
        <NetworkAware>
          <PlaceGrid
            title="추천 여행지"
            places={places}
            isLoading={loading}
            error={error}
            onRetry={fetchPlaces}
          />
        </NetworkAware>
      </div>
    </main>
  );
}
