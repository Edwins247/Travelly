import { Suspense } from 'react';
import { FilterBar }  from '@/components/search/FilterBar';
import { PlaceGrid }   from '@/components/home/PlaceGrid';
import { demoPlaces }  from '@/mocks/places';

export const dynamic = 'force-dynamic'; // ← SSG 프리렌더 캐시 무력화(필요 시)

interface PageProps {
  searchParams?: Record<string, string | string[] | undefined>;
}

export default function SearchPage({ searchParams }: PageProps) {
  const keyword = (searchParams?.keyword as string) ?? '';

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-xl font-semibold">“{keyword}” 검색 결과</h1>

      {/* FilterBar 는 이미 client 컴포넌트이므로 Suspense 로 감쌈 */}
      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      {/* 임시 더미 카드 */}
      <PlaceGrid title="" places={demoPlaces} />
    </main>
  );
}
