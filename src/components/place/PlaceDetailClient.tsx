'use client';

import { useEffect } from 'react';
import { usePageTracking } from '@/hooks/usePageTracking';
import { placeAnalytics } from '@/utils/analytics';
import type { PlaceDTO } from '@/types/place';

interface PlaceDetailClientProps {
  place: PlaceDTO;
  children: React.ReactNode;
}

export function PlaceDetailClient({ place, children }: PlaceDetailClientProps) {
  // 페이지 추적 (여행지 정보 포함)
  usePageTracking('place-detail', {
    place_id: place.id,
    place_name: place.name,
    region: place.location.region,
    region_type: place.regionType,
    keyword_count: place.keywords.length,
  });

  // Analytics: 여행지 조회 이벤트 (클라이언트에서 실행)
  useEffect(() => {
    placeAnalytics.viewPlace(
      place.id,
      place.name,
      place.location.region,
      place.regionType
    );
  }, [place]);

  return <>{children}</>;
}
