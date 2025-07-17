import { getPlaces } from '@/services/places';
import { HomeClient } from '@/components/home/HomeClient';
import { performanceTracking, stopTrace } from '@/utils/performance';
import type { Metadata } from 'next';
import type { PlaceCardData } from '@/types/place';
import { HOT_KEYWORDS } from '@/constants/home';

export const metadata: Metadata = {
  title: 'Travelly - 여행지 검색 및 추천',
  description: '키워드로 맞춤 여행지를 찾고 여행 정보를 확인하세요.',
  openGraph: {
    title: 'Travelly',
    description: '키워드로 맞춤 여행지를 찾고 여행 정보를 확인하세요.',
    type: 'website',
  },
};

export default async function Home() {
  const hotKeywords = HOT_KEYWORDS;

  // 서버에서 초기 데이터 페칭
  const homePageTrace = performanceTracking.trackPageLoad('home-server');

  let initialPlaces: PlaceCardData[];
  try {
    initialPlaces = await getPlaces({});
    stopTrace(homePageTrace);
  } catch (error) {
    console.error('Error fetching initial places:', error);
    stopTrace(homePageTrace);
    initialPlaces = [];
  }

  return (
    <HomeClient
      initialPlaces={initialPlaces}
      hotKeywords={hotKeywords}
    />
  );
}
