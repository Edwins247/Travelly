import { PlaceCardData } from '@/types/place';

/**
 * 임시 목업 데이터 (썸네일은 Unsplash 무료 이미지 사용)
 * Firestore 연결 전까지 UI·라우팅 테스트용
 */
export const demoPlaces: PlaceCardData[] = [
  {
    id: 'seoul-gyeongbokgung',
    name: '경복궁',
    region: '서울특별시',
    category: '관광지',
    thumbnail:
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&w=800&q=60',
    liked: true,
  },
  {
    id: 'jeju-seongsan',
    name: '성산일출봉',
    region: '제주특별자치도',
    category: '관광지',
    thumbnail:
      'https://images.unsplash.com/photo-1583321410109-79903f6e96b3?auto=format&w=800&q=60',
  },
  {
    id: 'gangneung-coffee',
    name: '안목 커피거리',
    region: '강원도',
    category: '맛집',
    thumbnail:
      'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&w=800&q=60',
  },
  {
    id: 'busan-haeundae',
    name: '해운대 해수욕장',
    region: '부산광역시',
    category: '관광지',
    thumbnail:
      'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&w=800&q=60',
  },
  {
    id: 'andong-hahoe',
    name: '하회마을',
    region: '경상북도',
    category: '문화시설',
    thumbnail:
      'https://images.unsplash.com/photo-1517721905240-909c5af8f11f?auto=format&w=800&q=60',
  },
  {
    id: 'incheon-chinatown',
    name: '인천 차이나타운',
    region: '인천광역시',
    category: '문화시설',
    thumbnail:
      'https://images.unsplash.com/photo-1568254183919-78a4f43b68c2?auto=format&w=800&q=60',
  },
  {
    id: 'jeonju-hanok',
    name: '전주 한옥마을',
    region: '전라북도',
    category: '관광지',
    thumbnail:
      'https://images.unsplash.com/photo-1526483360290-8f217fe1d9d5?auto=format&w=800&q=60',
  },
  {
    id: 'seorak-mountain',
    name: '설악산 국립공원',
    region: '강원도',
    category: '레포츠',
    thumbnail:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&w=800&q=60',
  },
];
