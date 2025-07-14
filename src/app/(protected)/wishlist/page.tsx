// src/app/(protected)/wishlist/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { getWishlistPlaces } from '@/services/places';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { PageLoader } from '@/components/common/PageLoader';
import type { PlaceCardData } from '@/types/place';

export default function WishlistPage() {
  const { wishlist, loading: wLoading } = useWishlist();
  const [places, setPlaces] = useState<PlaceCardData[]>([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // wishlist ID 배열이 바뀔 때마다 실제 PlaceCardData로 변환
  useEffect(() => {
    if (wishlist.length > 0) {
      getWishlistPlaces(wishlist).then(setPlaces);
    } else {
      setPlaces([]);
    }
  }, [wishlist]);

  // 로딩 중엔 전체 페이지 로더
  if (wLoading) {
    return <PageLoader showHeader={false} showFooter={false} />;
  }

  // 아무것도 없으면 메시지
  if (places.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-xl font-semibold">찜 목록</h1>
        <p className="text-muted-foreground">아직 찜한 여행지가 없습니다.</p>
      </main>
    );
  }

  // 페이징
  const total = places.length;
  const start = (page - 1) * PER_PAGE;
  const slice = places.slice(start, start + PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-8">
      <h1 className="text-xl font-semibold">찜 목록</h1>

      <PlaceGrid title="" places={slice} />

      <Pagination
        perPage={PER_PAGE}
        total={total}
        currentPage={page}
        onPageChange={setPage}
      />
    </main>
  );
}
