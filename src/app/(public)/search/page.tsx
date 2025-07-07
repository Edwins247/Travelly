// src/app/(public)/search/page.tsx
import { FilterBar } from '@/components/search/FilterBar';
import { PlaceGrid }  from '@/components/home/PlaceGrid';
import { demoPlaces } from '@/mocks/places';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchPage({ searchParams }: Props) {
  const keyword = searchParams.keyword ?? '';

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-xl font-semibold">“{keyword}” 검색 결과</h1>

      {/* FilterBar 는 이미 'use client' 지시자가 있으므로 그대로 사용 */}
      <FilterBar />

      <PlaceGrid title="" places={demoPlaces} />
    </main>
  );
}
