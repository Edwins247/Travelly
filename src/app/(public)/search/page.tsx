// src/app/(public)/search/page.tsx
import { Suspense } from 'react';
import { FilterBar }  from '@/components/search/FilterBar';
import { PlaceGrid }  from '@/components/home/PlaceGrid';
import { demoPlaces } from '@/mocks/places';

export const dynamic = 'force-dynamic';

type SearchPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Promise 가능성 제거됨(Next 가 await) → 안전하게 사용
  const keyword = searchParams?.keyword ?? '';

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
