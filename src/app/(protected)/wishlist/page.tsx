'use client';                                    // 상태·클라 훅 사용

import { useState }        from 'react';
import { PlaceGrid }       from '@/components/home/PlaceGrid';
import { Pagination }      from '@/components/common/Pagination';
import { demoPlaces }      from '@/mocks/places';        // 👉 임시 더미

// TODO: Firestore 훅으로 교체 → useWishlist(user.uid)
const wishlistMock = demoPlaces.filter(p => p.liked);   // 더미 liked 항목만

export default function WishlistPage() {
  /* ------------ 페이지네이션 로컬 상태 ------------ */
  const [page, setPage] = useState(1);
  const PER_PAGE        = 8;
  const total           = wishlistMock.length;
  const start           = (page - 1) * PER_PAGE;
  const slice           = wishlistMock.slice(start, start + PER_PAGE);

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-12">
      <h1 className="text-xl font-semibold">찜 목록</h1>

      {total === 0 ? (
        <p className="text-muted-foreground">
          아직 찜한 여행지가 없습니다.
        </p>
      ) : (
        <>
          <PlaceGrid title="" places={slice} />

          <Pagination
            total={total}
            perPage={PER_PAGE}
            onPageChange={setPage}        // 🔸 로컬 페이지 상태만 갱신
          />
        </>
      )}
    </main>
  );
}
