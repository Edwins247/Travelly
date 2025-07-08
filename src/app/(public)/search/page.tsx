// src/app/(public)/search/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid } from '@/components/home/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { getPlaces } from '@/services/places';
import type { PlaceCardData } from '@/types/place';

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();

  // 1) URL 파라미터
  const rawKeyword = params.get('keyword') ?? '';
  const rawPage    = params.get('page')    ?? '1';
  const pageNumber = Math.max(Number(rawPage) || 1, 1);

  const PER_PAGE = 12;

  // 2) 상태 선언
  const [allPlaces, setAllPlaces] = useState<PlaceCardData[]>([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(pageNumber);

  // 페이지 번호가 URL과 다르면 URL 동기화
  useEffect(() => {
    if (page !== pageNumber) {
      const p = new URLSearchParams(params);
      if (page > 1) p.set('page', String(page));
      else p.delete('page');
      router.push(`?${p.toString()}`, { scroll: false });
    }
  }, [page, pageNumber, params, router]);

  // 3) Firestore에서 가져오기 (클라이언트)
  useEffect(() => {
    setLoading(true);
    getPlaces({ keyword: rawKeyword })
      .then((data) => setAllPlaces(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [rawKeyword]);

  // 4) 페이징
  const total     = allPlaces.length;
  const start     = (pageNumber - 1) * PER_PAGE;
  const pageSlice = allPlaces.slice(start, start + PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
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
    </main>
  );
}
