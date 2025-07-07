// src/app/(public)/search/page.tsx
// ToDo: 추후 SSR로 변경될 수 있음
'use client';           

import { useSearchParams } from 'next/navigation';
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid }  from '@/components/home/PlaceGrid';
import { demoPlaces } from '@/mocks/places';
import { Suspense } from 'react';

export default function SearchPage() {
  const params   = useSearchParams();
  const keyword  = params.get('keyword') ?? '';

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-xl font-semibold">“{keyword}” 검색 결과</h1>

      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>
      
      <PlaceGrid title="" places={demoPlaces} />
    </main>
  );
}
