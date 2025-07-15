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
  error?: string;             // 에러 메시지
  onRetry?: () => void;       // 재시도 함수
}

export function PlaceGrid({
  title,
  places = [],
  isLoading = false,
  error,
  onRetry
}: PlaceGridProps) {
  const router = useRouter();

  return (
    <section className="space-y-4">
      <h2 className="text-base font-semibold">{title}</h2>

      {error ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="text-muted-foreground">
            <p className="text-sm">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-primary hover:underline"
            >
              다시 시도
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <PlaceCardSkeleton key={i} />)
            : places.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <p>표시할 여행지가 없습니다.</p>
                  <p className="text-sm">다른 검색 조건을 시도해보세요.</p>
                </div>
              ) : (
                places.map((p) => (
                  <PlaceCard
                    key={p.id}
                    {...p}
                  />
                ))
              )}
        </div>
      )}

      {/* "추천 여행지"에만 전체 보기 버튼 */}
      {title === '추천 여행지' && !isLoading && !error && places.length > 0 && (
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
