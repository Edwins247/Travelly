// src/app/(public)/places/[id]/page.tsx
import { getPlaceById } from '@/services/places';
import PlaceDetailHero from '@/components/place/PlaceDetailHero';
import KeywordBadgeList from '@/components/place/KeywordBadgeList';
import StatsInfo from '@/components/place/StatsInfo';
import BasicInfoTable from '@/components/place/BasicInfoTable';
import { LikeButton } from '@/components/common/LikeButton'; // 여기만 변경

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await getPlaceById(id);
  if (!place) return <p>존재하지 않는 여행지입니다.</p>;

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-4">
      <div className="relative">
        <PlaceDetailHero
          name={place.name}
          imageUrls={place.imageUrls}
          regionType={place.regionType}
          location={place.location}
          seasonTags={place.seasonTags}
          budgetLevel={place.budgetLevel}
        />
        <LikeButton placeId={place.id} className="right-4 top-4" />
      </div>

      <KeywordBadgeList keywords={place.keywords} />

      <StatsInfo likes={place.stats.likes} reviewCount={place.stats.reviewCount} />

      <BasicInfoTable
        description={place.description}
        location={place.location}
        createdBy={place.createdBy}
        createdAt={place.createdAt.toDate()} // Firestore Timestamp → Date
      />
    </main>
  );
}
