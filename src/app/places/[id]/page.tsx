// src/app/(public)/places/[id]/page.tsx
import { getPlaceById } from '@/services/places';
import ImageGallery from '@/components/place/ImageGallery';
import PlaceOverview from '@/components/place/PlaceOverview';
import KeywordExplorer from '@/components/place/KeywordExplorer';
import { LikeButton } from '@/components/common/LikeButton';
import { ReviewList } from '@/components/place/ReviewList';

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await getPlaceById(id);
  if (!place) return <p>존재하지 않는 여행지입니다.</p>;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4">
      {/* 이미지 갤러리 */}
      <div className="relative">
        <ImageGallery
          images={place.imageUrls}
          placeName={place.name}
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
      <KeywordExplorer keywords={place.keywords} />

      {/* 리뷰 섹션 */}
      <ReviewList placeId={place.id} />
    </main>
  );
}
