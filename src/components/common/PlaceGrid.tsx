// src/components/home/PlaceGrid.tsx
'use client';

import { useRouter } from 'next/navigation';
import { PlaceCardData } from '@/types/place';
import { PlaceCard } from '@/components/common/PlaceCard';
import { PlaceCardSkeleton } from '@/components/common/PlaceCardSkeleton';

interface PlaceGridProps {
  title: string;
  places?: PlaceCardData[];   // 이걸 optional로
  isLoading?: boolean;        // 로딩 플래그
}

export function PlaceGrid({ title, places = [], isLoading = false }: PlaceGridProps) {
  const router = useRouter();

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">{title}</h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <PlaceCardSkeleton key={i} />)
          : places.map((p) => (
              <PlaceCard
                key={p.id}
                {...p}
              />
            ))}
      </div>

      {/* "추천 여행지"에만 전체 보기 버튼 */}
      {title === '추천 여행지' && !isLoading && (
        <button
          className="text-sm text-primary underline-offset-2 hover:underline"
          onClick={() => router.push('/search')}
        >
          더 보기 →
        </button>
      )}
    </section>
  );
}
