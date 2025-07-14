// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from '@/components/home/SearchBar';
import { KeywordChips } from '@/components/home/KeywordChips';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PlaceGrid } from '@/components/common/PlaceGrid';
import { PageLoader } from '@/components/common/PageLoader';
import { getPlaces } from '@/services/places';
import type { PlaceCardData } from '@/types/place';


export default function Home() {
  const hotKeywords = [
    '혼자 힐링',
    '겨울 실내',
    '가족 여행',
    '사진맛집',
    '반려동물',
    '역사 탐방',
  ];

  // 1) State 선언
  const [places, setPlaces] = useState<PlaceCardData[]>([]);
  const [loading, setLoading] = useState(true);

  // 2) Firestore에서 가져오기
  useEffect(() => {
    getPlaces({})
      .then((data) => {
        setPlaces(data);
      })
      .catch((e) => {
        console.error('getPlaces 오류:', e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 전체 페이지 로딩 중일 때는 전체 로더 표시
  if (loading) {
    return <PageLoader showHeader={false} showFooter={false} />;
  }

  return (
    <main className="flex flex-col items-center gap-6 py-16">
      <div className="w-full max-w-6xl space-y-6 px-4">
        <SearchBar />
        <KeywordChips keywords={hotKeywords} />
        <CategoryGrid />

        {/* 여행지 목록 */}
        <PlaceGrid title="추천 여행지" places={places} />
      </div>
    </main>
  );
}
