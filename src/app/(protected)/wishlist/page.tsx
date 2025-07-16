// src/app/(protected)/wishlist/page.tsx
'use client';

import { useState } from 'react';
import { useWishlist } from '@/hooks/useWishlist';
import { useWishlistPlaces } from '@/hooks/usePlaces';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { PageLoader } from '@/components/common/PageLoader';

export default function WishlistPage() {
  const { wishlist, loading: wLoading } = useWishlist();
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // React Query로 위시리스트 장소들 가져오기
  const {
    data: places = [],
    isLoading: placesLoading
  } = useWishlistPlaces(wishlist);

  // 전체 로딩 상태
  const loading = wLoading || placesLoading;

  // 로딩 중엔 전체 페이지 로더
  if (loading) {
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
