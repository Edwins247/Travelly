'use client';
import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { PageLoader } from '@/components/common/PageLoader';
import { NetworkAware } from '@/components/common/NetworkStatus';
import { performanceTracking, stopTrace } from '@/utils/performance';
import { searchAnalytics } from '@/utils/analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { usePlaces } from '@/hooks/usePlaces';
import type { GetPlacesOptions } from '@/types/place';
import { PAGINATION } from '@/constants/common';
import { ERROR_MESSAGES, LOADING_MESSAGES } from '@/constants/messages';

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();

  // 1) URL에서 모든 필터 꺼내기
  const rawKeyword = params.get('keyword') ?? '';
  const rawRegion  = (params.get('region') as 'domestic' | 'abroad') ?? '';
  const rawSeason  = params.get('season') ?? '';
  const rawBudget  = params.get('budget') ?? '';
  const rawPage    = Number(params.get('page') ?? '1');

  const PER_PAGE   = PAGINATION.PER_PAGE;

  // 페이지 추적 (검색 컨텍스트 포함)
  usePageTracking('search', {
    search_keyword: rawKeyword,
    search_region: rawRegion || '',
    search_season: rawSeason || '',
    search_budget: rawBudget || '',
  });

  // 2) State
  const [page, setPage] = useState(rawPage);

  // 3) 검색 옵션 메모이제이션
  const searchOptions = useMemo<GetPlacesOptions>(() => ({
    keyword: rawKeyword,
    region: rawRegion || undefined,
    season: rawSeason || undefined,
    budget: rawBudget || undefined,
  }), [rawKeyword, rawRegion, rawSeason, rawBudget]);

  // 4) React Query로 장소 검색
  const {
    data: places = [],
    isLoading: loading,
    error: queryError,
    refetch: retryFetch
  } = usePlaces(searchOptions);

  // 에러 메시지 변환
  const error = queryError ? ERROR_MESSAGES.SEARCH_LOAD_FAILED : null;

  // 3) Sync page → URL
  useEffect(() => {
    if (page !== rawPage) {
      const q = new URLSearchParams(params);
      if (page > 1) q.set('page', String(page));
      else          q.delete('page');
      router.push(`?${q.toString()}`, { scroll: false });
    }
  }, [page, rawPage, params, router]);

  // 4) Whenever any filter changes, reset page to 1
  useEffect(() => {
    setPage(1);
  }, [rawKeyword, rawRegion, rawSeason, rawBudget]);

  // 5) 성능 추적 및 Analytics
  useEffect(() => {
    if (!loading && places.length >= 0) {
      // 검색 페이지 로딩 성능 추적
      const searchPageTrace = performanceTracking.trackPageLoad('search-results');
      stopTrace(searchPageTrace);

      // Analytics: 검색 결과 수 추적
      if (rawKeyword) {
        const filters = {
          region: rawRegion,
          season: rawSeason,
          budget: rawBudget,
        };
        searchAnalytics.searchQuery(rawKeyword, places.length, filters);
      }
    }
  }, [loading, places.length, rawKeyword, rawRegion, rawSeason, rawBudget]);

  // 6) Pagination slice
  const total     = places.length;
  const start     = (page - 1) * PER_PAGE;
  const slice     = places.slice(start, start + PER_PAGE);

  // 초기 로딩 중일 때는 전체 페이지 로더 표시
  if (loading && places.length === 0) {
    return <PageLoader showHeader={false} showFooter={false} />;
  }

  return (
    <>
      <h1 className="text-xl font-semibold">
        “{rawKeyword}” 검색 결과 ({total})
      </h1>

      <FilterBar />

      <NetworkAware>
        <PlaceGrid
          title={loading ? "검색 결과" : ""}
          places={slice}
          isLoading={loading}
          error={error || undefined}
          onRetry={retryFetch}
          searchKeyword={rawKeyword}
        />

        <Pagination
          perPage={PER_PAGE}
          total={total}
          currentPage={page}
          onPageChange={setPage}
        />
      </NetworkAware>
    </>
  );
}

export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6 py-6 sm:py-10">
      <Suspense fallback={<div>{LOADING_MESSAGES.LOADING_SEARCH}</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
