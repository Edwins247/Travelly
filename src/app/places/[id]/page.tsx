// src/app/(public)/places/[id]/page.tsx
import { getPlaceById } from '@/services/places';
import ImageGallery from '@/components/place/ImageGallery';
import PlaceOverview from '@/components/place/PlaceOverview';
import KeywordExplorer from '@/components/place/KeywordExplorer';
import { LikeButton } from '@/components/common/LikeButton';
import { ReviewList } from '@/components/place/ReviewList';
import { NetworkAware } from '@/components/common/NetworkStatus';
import { PlaceDetailClient } from '@/components/place/PlaceDetailClient';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { performanceTracking, stopTrace } from '@/utils/performance';

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 페이지 로딩 성능 추적 시작
  const pageTrace = performanceTracking.trackPageLoad('place-detail');

  let place;
  try {
    place = await getPlaceById(id);
  } catch (error) {
    console.error('Error fetching place:', error);
    stopTrace(pageTrace); // 에러 시 추적 종료
    return (
      <main className="mx-auto max-w-6xl p-4">
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="rounded-full bg-red-100 p-6">
            <RefreshCw className="h-12 w-12 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">여행지 정보를 불러올 수 없습니다</h2>
            <p className="text-muted-foreground max-w-md">
              잠시 후 다시 시도해주세요.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => window.location.reload()} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              다시 시도
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                홈으로 이동
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!place) {
    stopTrace(pageTrace); // 404 시 추적 종료
    return (
      <main className="mx-auto max-w-6xl p-4">
        <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
          <div className="text-6xl">🏞️</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">여행지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground max-w-md">
              요청하신 여행지가 존재하지 않습니다.
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              홈으로 이동
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  // 성공적으로 페이지 로드 완료
  stopTrace(pageTrace);

  return (
    <NetworkAware>
      <PlaceDetailClient place={place}>
        <main className="mx-auto max-w-6xl space-y-8 p-4">
        {/* 이미지 갤러리 */}
        <div className="relative">
          <ImageGallery
            images={place.imageUrls}
            placeName={place.name}
            placeId={place.id}
          />
          <LikeButton placeId={place.id} className="absolute top-4 right-4 z-20" />
        </div>

        {/* 여행지 개요 */}
        <PlaceOverview
          placeId={place.id}
          name={place.name}
          description={place.description}
          regionType={place.regionType}
          location={place.location}
          seasonTags={place.seasonTags}
          budgetLevel={place.budgetLevel}
          stats={place.stats}
        />

        {/* 키워드 탐색 */}
        <KeywordExplorer
            keywords={place.keywords}
            placeName={place.name}
            placeId={place.id}
          />

          {/* 리뷰 섹션 */}
          <ReviewList placeId={place.id} />
        </main>
      </PlaceDetailClient>
    </NetworkAware>
  );
}
