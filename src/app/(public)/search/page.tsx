import { Suspense } from 'react';
import { FilterBar }  from '@/components/search/FilterBar';
import { PlaceGrid }  from '@/components/home/PlaceGrid';
import { demoPlaces } from '@/mocks/places';

type SearchParams = Record<string, string | string[] | undefined>;

type SearchPageProps = {
  /**
   * Next 가 주입하는 URL 쿼리.
   * - 서버 프리렌더 단계에서 `Promise` 로 올 수도 있으므로 union 처리
   */
  searchParams?: SearchParams | Promise<SearchParams>;
};

export const dynamic = 'force-dynamic'; // SSG 캐시 무효 (필요 시)

/* ---------- 타입 적용 ---------- */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  /* searchParams 가 Promise 면 await, 아니면 그대로 사용 */
  const params   = await searchParams ?? {};
  const keyword  = params.keyword ?? '';

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
