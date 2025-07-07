// src/app/(public)/search/page.tsx
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid } from '@/components/home/PlaceGrid';
import { demoPlaces } from '@/mocks/places';
import { Suspense } from 'react';

export default function SearchPage() {
  // TODO: keyword/filters 읽어서 Firestore fetch
  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      {/* 검색 키워드 헤드라인 */}
      <h1 className="text-xl font-semibold">
        “단풍” 검색 결과
      </h1>

      {/* 필터 바 */}
      <FilterBar />

      {/* 결과 리스트 */}
      <Suspense fallback={<p>Loading...</p>}>
        <PlaceGrid title="" places={demoPlaces} />
      </Suspense>
    </main>
  );
}
