// src/app/(public)/search/page.tsx
'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { getPlaces, type GetPlacesOptions } from '@/services/places';
import type { PlaceCardData } from '@/types/place';

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
    setLoading(true);
    const options: GetPlacesOptions = {
      keyword: rawKeyword,
      region:  rawRegion || undefined,
      season:  rawSeason || undefined,
      budget:  rawBudget || undefined,
    };
    getPlaces(options)
      .then(setPlaces)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [rawKeyword, rawRegion, rawSeason, rawBudget]);

  // 6) Pagination slice
  const total     = places.length;
  const start     = (page - 1) * PER_PAGE;
  const slice     = places.slice(start, start + PER_PAGE);

  return (
    <>
      <h1 className="text-xl font-semibold">
        “{rawKeyword}” 검색 결과 ({total})
      </h1>

      <FilterBar />

      {loading ? (
        <PlaceGrid title="검색 결과" isLoading />
      ) : (
        <PlaceGrid title="" places={slice} />
      )}

      <Pagination
        perPage={PER_PAGE}
        total={total}
        currentPage={page}
        onPageChange={setPage}
      />
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
