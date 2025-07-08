// src/app/(protected)/wishlist/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { PlaceGrid } from '@/components/home/PlaceGrid';
import { Pagination } from '@/components/common/Pagination';
import { getPlaces } from '@/services/places';       // Firestore에서 전체 불러오기
import type { PlaceCardData } from '@/types/place';

export default function WishlistPage() {
  // 1) Firestore에서 place 전체 목록을 state로 보관
  const [places, setPlaces] = useState<PlaceCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // 2) 로컬 페이징 상태
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  // 3) 마운트 시 전체 place 불러오기
  useEffect(() => {
    setLoading(true);
    getPlaces({}).then((data) => {
      setPlaces(data);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // 4) total / slice 계산
  const total = places.length;
  const start = (page - 1) * PER_PAGE;
  const slice = places.slice(start, start + PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <h1 className="text-xl font-semibold">찜 목록 (테스트용)</h1>

      {loading ? (
        // 로딩 중 스켈레톤
        <PlaceGrid title="찜 목록" isLoading />
      ) : total === 0 ? (
        <p className="text-muted-foreground">
          아직 불러온 여행지가 없습니다.
        </p>
      ) : (
        <>
          {/* 실제 Firestore 데이터를 페이징 없이 혹은 페이징해서 보여줌 */}
          <PlaceGrid title="" places={slice} />

          <Pagination
            perPage={PER_PAGE}
            total={total}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </main>
  );
}
