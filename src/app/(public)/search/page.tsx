// src/app/(public)/search/page.tsx
'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { PageLoader } from '@/components/common/PageLoader';
import { NetworkAware } from '@/components/common/NetworkStatus';
import { getPlaces } from '@/services/places';
import { performanceTracking, stopTrace } from '@/utils/performance';
import type { PlaceCardData, GetPlacesOptions } from '@/types/place';

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();

  // 1) URL에서 모든 필터 꺼내기
  const rawKeyword = params.get('keyword') ?? '';
  const rawRegion  = (params.get('region') as 'domestic' | 'abroad') ?? '';
  const rawSeason  = params.get('season') ?? '';
  const rawBudget  = params.get('budget') ?? '';
  const rawPage    = Number(params.get('page') ?? '1');

  const PER_PAGE   = 12;

  // 2) State
  const [places, setPlaces]   = useState<PlaceCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [page, setPage]       = useState(rawPage);

  // 3) Sync page → URL
  useEffect(() => {
    if (page !== rawPage) {
      const q = new URLSearchParams(params);
      if (page > 1) q.set('page', String(page));
      else          q.delete('page');
      router.push(`?${q.toString()}`, { scroll: false });
    }
  }, [page, rawPage, params, router]);

  // 4) Whenever any filter changes, reset page to 1 & fetch
  useEffect(() => {
    setPage(1);
  }, [rawKeyword, rawRegion, rawSeason, rawBudget]);

  // 5) Fetch from Firestore on any filter change
  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      // 검색 페이지 로딩 성능 추적
      const searchPageTrace = performanceTracking.trackPageLoad('search-results');

      const options: GetPlacesOptions = {
        keyword: rawKeyword,
        region:  rawRegion || undefined,
        season:  rawSeason || undefined,
        budget:  rawBudget || undefined,
      };
      try {
        const data = await getPlaces(options);
        setPlaces(data);
        stopTrace(searchPageTrace); // 성공 시 추적 종료
      } catch (e) {
        console.error('Search places error:', e);
        setError('검색 결과를 불러오는데 실패했습니다.');
        stopTrace(searchPageTrace); // 에러 시 추적 종료
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [rawKeyword, rawRegion, rawSeason, rawBudget]);

  // 재시도용 함수
  const retryFetch = () => {
    const options: GetPlacesOptions = {
      keyword: rawKeyword,
      region:  rawRegion || undefined,
      season:  rawSeason || undefined,
      budget:  rawBudget || undefined,
    };

    setLoading(true);
    setError(null);

    getPlaces(options)
      .then(setPlaces)
      .catch(() => setError('검색 결과를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false));
  };

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
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Suspense fallback={<div>검색 결과를 불러오는 중…</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
