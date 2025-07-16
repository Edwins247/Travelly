// src/app/page.tsx
import { getPlaces } from '@/services/places';
import { HomeClient } from '@/components/home/HomeClient';
import { performanceTracking, stopTrace } from '@/utils/performance';
import type { Metadata } from 'next';
import type { PlaceCardData } from '@/types/place';
import { HOT_KEYWORDS } from '@/constants/home';

// 홈페이지 메타데이터
export const metadata: Metadata = {
  title: 'Travelly - 당신만의 특별한 여행지를 찾아보세요',
  description: '다양한 여행지 정보와 후기를 확인하고, 키워드로 맞춤 여행지를 찾아보세요.',
  keywords: ['여행', '여행지', '관광', '휴가', '여행 추천', '국내여행', '해외여행'],
  openGraph: {
    title: 'Travelly - 당신만의 특별한 여행지를 찾아보세요',
    description: '다양한 여행지 정보와 후기를 확인하고, 키워드로 맞춤 여행지를 찾아보세요.',
    url: 'https://travelly.com',
    siteName: 'Travelly',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Travelly 홈페이지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travelly - 당신만의 특별한 여행지를 찾아보세요',
    description: '다양한 여행지 정보와 후기를 확인하고, 키워드로 맞춤 여행지를 찾아보세요.',
    images: ['/og-home.jpg'],
  },
  alternates: {
    canonical: 'https://travelly.com',
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

  // JSON-LD 구조화 데이터
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Travelly',
    description: '다양한 여행지 정보와 후기를 확인하고, 키워드로 맞춤 여행지를 찾아보세요.',
    url: 'https://travelly.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://travelly.com/search?keyword={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Travelly',
      url: 'https://travelly.com',
    },
  };

  return (
    <>
      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        initialPlaces={initialPlaces}
        hotKeywords={hotKeywords}
      />
    </>
  );
}
