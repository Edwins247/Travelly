import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { Place, PlaceCardData } from '@/types/place';

// 타입 정의
export interface PlaceInput {
  name: string;
  description?: string;
  imageUrl?: string;
  location: { region: string; district?: string };
  regionType: '국내' | '해외';
  seasonTags: string[];
  budgetLevel: '저예산' | '중간' | '고급';
  keywords?: string[];
  createdBy: string;
  // keywords는 리뷰 작성 시 누적되므로 초기값은 없어도 됨
}

// src/services/places.ts

export async function addPlace(data: PlaceInput): Promise<string> {
  const { createdBy, ...rest } = data;
  const docRef = await addDoc(collection(db, 'places'), {
    ...rest,
    createdBy, // ← 여기 추가
    imageUrls: data.imageUrl ? [data.imageUrl] : [],
    stats: { likes: 0, reviewCount: 0 },
    keywords: data.keywords || [], // 필요시
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

interface GetPlacesOptions {
  keyword?: string;
  // 나중에 region, season, budget 추가 가능
}

export async function getPlaces({ keyword }: GetPlacesOptions): Promise<PlaceCardData[]> {
  // 1) 컬렉션 레퍼런스에 제네릭으로 Place 타입을 붙여줍니다.
  const col = collection(db, 'places') as CollectionReference<Place>;

  // 2) 키워드가 있으면 where 절 추가
  const q = keyword ? query(col, where('keywords', 'array-contains', keyword)) : col;

  // 3) 조회
  const snap = await getDocs(q);

  // 4) Snapshot 에서 Place 타입으로 data() 를 받습니다.
  return snap.docs.map((doc: QueryDocumentSnapshot<Place>) => {
    const data = doc.data(); // data의 타입이 Place 입니다.
    return {
      id: doc.id,
      name: data.name,
      region: data.location.region,
      thumbnail: data.imageUrls.length > 0 ? data.imageUrls[0] : '/placeholder.jpg',
      // liked 는 나중에 wishlist 와 매핑
    };
  });
}

/**
 * placeId 배열로 PlaceCardData 객체들을 한 번에 가져옵니다.
 */
export async function getWishlistPlaces(
  ids: string[]
): Promise<PlaceCardData[]> {
  if (ids.length === 0) return [];

  // 1) DocumentReference<Place> 로 ID별 ref 생성
  const refs = ids.map(
    (id) => doc(db, 'places', id) as DocumentReference<Place>
  );

  // 2) 병렬로 스냅샷 조회
  const snaps = await Promise.all(refs.map((r) => getDoc(r)));

  // 3) 존재하는 문서만 필터링 & Place 타입으로 안전하게 data() 사용
  return snaps
    .filter((snap) => snap.exists())
    .map((snap) => {
      const data = snap.data(); // data는 Place 타입
      return {
        id: snap.id,
        name: data.name,
        region: data.location.region,
        thumbnail:
          Array.isArray(data.imageUrls) && data.imageUrls.length > 0
            ? data.imageUrls[0]
            : '/placeholder.png',
      };
    });
}