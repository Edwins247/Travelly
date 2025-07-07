import { Suspense }    from 'react';
import { FilterBar }   from '@/components/search/FilterBar';
import { PlaceGrid }   from '@/components/home/PlaceGrid';
import { Pagination }  from '@/components/common/Pagination';
import { demoPlaces }  from '@/mocks/places';

type SearchParams          = Record<string, string | string[] | undefined>;
interface SearchPageProps { searchParams?: Promise<SearchParams>; }

export const dynamic = 'force-dynamic';

export default async function SearchPage({ searchParams }: SearchPageProps) {
  /* 기존 로직 유지 */
  const params          = (await searchParams) ?? {};
  const keyword         = params.keyword ?? '';

  /* ── 페이지네이션 계산 ─────────────────── */
  const PER_PAGE        = 12;
  const pageNumber      = Number(params.page ?? '1');
  const currentPage     = pageNumber > 0 ? pageNumber : 1;

  const total           = demoPlaces.length;
  const start           = (currentPage - 1) * PER_PAGE;
  const pageSlice       = demoPlaces.slice(start, start + PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <h1 className="text-xl font-semibold">“{keyword}” 검색 결과</h1>

      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      <PlaceGrid title="" places={pageSlice} />

      {/* 🔽 새로 추가된 페이지네이션 */}
      <Pagination perPage={PER_PAGE} total={total} />
    </main>
  );
}
