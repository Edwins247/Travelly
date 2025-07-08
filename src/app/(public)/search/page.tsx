// src/app/(public)/search/page.tsx
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid } from '@/components/home/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { getPlaces } from '@/services/places';
import type { PlaceCardData } from '@/types/place';

// 1) 실제 조회·렌더링 로직은 이 컴포넌트 안에 담고…
function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();

  const rawKeyword = params.get('keyword') ?? '';
  const rawPage    = params.get('page')    ?? '1';
  const pageNumber = Math.max(Number(rawPage) || 1, 1);
  const PER_PAGE   = 12;

  const [allPlaces, setAllPlaces] = useState<PlaceCardData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(pageNumber);

  // URL 페이지 번호 동기화
  useEffect(() => {
    if (page !== pageNumber) {
      const q = new URLSearchParams(params);
      if (page > 1) q.set('page', String(page));
      else         q.delete('page');
      router.push(`?${q.toString()}`, { scroll: false });
    }
  }, [page, pageNumber, params, router]);

  // Firestore 데이터 패칭
  useEffect(() => {
    setLoading(true);
    getPlaces({ keyword: rawKeyword })
      .then(setAllPlaces)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [rawKeyword]);

  const total     = allPlaces.length;
  const start     = (pageNumber - 1) * PER_PAGE;
  const pageSlice = allPlaces.slice(start, start + PER_PAGE);

  return (
    <>
      <h1 className="text-xl font-semibold">
        “{rawKeyword}” 검색 결과 ({total})
      </h1>

      <FilterBar />

      {loading ? (
        <PlaceGrid title="검색 결과" isLoading />
      ) : (
        <PlaceGrid title="" places={pageSlice} />
      )}

      <Pagination
        perPage={PER_PAGE}
        total={total}
        currentPage={pageNumber}
        onPageChange={setPage}
      />
    </>
  );
}

// 2) 페이지 컴포넌트에서 Suspense 로 감싸기
export default function SearchPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Suspense fallback={<div>검색 결과를 불러오는 중…</div>}>
        <SearchContent />
      </Suspense>
    </main>
  );
}
