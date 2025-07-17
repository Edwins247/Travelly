'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LikeButton } from '@/components/common/LikeButton';
import { useImageError } from '@/hooks/useImageError';
import { ImageIcon } from 'lucide-react';
import { searchAnalytics } from '@/utils/analytics';
import { IMAGES } from '@/constants/common';

interface PlaceCardProps {
  id: string;
  name: string;
  region: string;
  thumbnail: string;
  category?: string;
  className?: string;
  searchKeyword?: string; // 검색 결과에서 온 경우
  position?: number; // 검색 결과에서의 위치
}

export const PlaceCard = React.memo<PlaceCardProps>(function PlaceCard({
  id,
  name,
  region,
  thumbnail,
  className,
  searchKeyword,
  position
}) {
  const { hasError, isLoading, handleError, handleLoad, getSrc } = useImageError(IMAGES.PLACEHOLDER);

  // 클릭 핸들러 (Analytics 추가)
  const handleClick = () => {
    if (searchKeyword && position !== undefined) {
      // 검색 결과에서 클릭한 경우 Analytics 추적
      searchAnalytics.searchResultClick(searchKeyword, id, name, position);
    }
  };

  return (
    <Link
      href={`/places/${id}`}
      onClick={handleClick}
      className={cn(
        'group flex w-full flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md',
        className,
      )}
    >
      {/* --- 썸네일 --- */}
      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-muted">
        {hasError ? (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <>
            <Image
              src={getSrc(thumbnail || '/img/placeholder.png')}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              onError={handleError}
              onLoad={handleLoad}
              priority={position === 0} // 첫 번째 이미지에만 priority 적용
              unoptimized
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </>
        )}

        {/* 찜 버튼 */}
        <LikeButton placeId={id} />
      </div>

      {/* --- 본문 --- */}
      <div className="space-y-1 p-3">
        <h3 className="truncate text-sm font-semibold">{name}</h3>
        <p className="truncate text-xs text-muted-foreground">{region}</p>
      </div>
    </Link>
  );
});
