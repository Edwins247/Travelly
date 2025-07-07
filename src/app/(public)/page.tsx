import { SearchBar } from '@/components/home/SearchBar';
import { KeywordChips } from '@/components/home/KeywordChips';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PlaceGrid } from '@/components/home/PlaceGrid';
import { demoPlaces } from '@/mocks/places';

export const metadata = { title: 'Travelly' };

export default function Home() {
  const hotKeywords = ['혼자 힐링', '겨울 실내', '가족 여행', '사진맛집', '반려동물', '역사 탐방'];

  return (
    <main className="flex flex-col items-center gap-6 py-16">
      {/* 가운데 폭 제어 */}
      <div className="w-full max-w-3xl space-y-6 px-4">
        <SearchBar />

        {/* 추천 키워드 */}
        <KeywordChips keywords={hotKeywords} />

        <CategoryGrid />

        <PlaceGrid title="최근 본 여행지" places={demoPlaces.slice(0, 4)} />
        <PlaceGrid title="추천 여행지" places={demoPlaces.slice(4)} />
      </div>
    </main>
  );
}
