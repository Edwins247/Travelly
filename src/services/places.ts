import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  Query,
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

export interface GetPlacesOptions {
  keyword?: string;
  region?: 'domestic' | 'abroad';
  season?: string;
  budget?: string;
}

export async function getPlaces({
  keyword,
  region,
  season,
  budget,
}: GetPlacesOptions): Promise<PlaceCardData[]> {
  // Base ref with Place type
  const col = collection(db, 'places') as CollectionReference<Place>;
  let q: Query<Place> = col;

  // 1) 키워드
  if (keyword) {
    q = query(q, where('keywords', 'array-contains', keyword));
  }

  // 2) regionType 필터
  if (region === 'domestic') {
    q = query(q, where('regionType', '==', '국내'));
  } else if (region === 'abroad') {
    q = query(q, where('regionType', '==', '해외'));
  }

  // 3) season 필터
  if (season) {
    q = query(q, where('seasonTags', 'array-contains', season));
  }

  // 4) budget 필터
  if (budget) {
    q = query(q, where('budgetLevel', '==', budget));
  }

  // Execute and map
  const snap = await getDocs(q);
  return snap.docs.map((doc: QueryDocumentSnapshot<Place>) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      region: data.location.region,
      thumbnail:
        Array.isArray(data.imageUrls) && data.imageUrls.length > 0
          ? data.imageUrls[0]
          : '/placeholder.jpg',
    };
  });
}

/**
 * placeId 배열로 PlaceCardData 객체들을 한 번에 가져옵니다.
 */
export async function getWishlistPlaces(ids: string[]): Promise<PlaceCardData[]> {
  if (ids.length === 0) return [];

  // 1) DocumentReference<Place> 로 ID별 ref 생성
  const refs = ids.map((id) => doc(db, 'places', id) as DocumentReference<Place>);

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

/**
 * 키워드 컬렉션에서 입력값으로 시작하는 키워드를 최대 limit개 가져옵니다.
 */
export async function fetchKeywordSuggestions(prefix: string, limit = 5): Promise<string[]> {
  if (!prefix) return [];
  const col = collection(db, 'keywords');
  const q = query(col, where('keyword', '>=', prefix), where('keyword', '<=', prefix + '\uf8ff'));
  const snap = await getDocs(q);
  return snap.docs.slice(0, limit).map((d) => d.data().keyword);
}

export async function getPlaceById(id: string): Promise<Place | null> {
  // Place 인터페이스에 id까지 포함돼 있으므로, 제네릭으로 Omit<Place,'id'>를 붙이고
  // 반환값에는 spread로 id를 추가합니다.
  const ref = doc(
    db,
    'places',
    id
  ) as DocumentReference<Omit<Place, 'id'>>;
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  // data는 Omit<Place,'id'> 타입
  const data = snap.data() as Omit<Place, 'id'>;

  // Place 타입 완성
  return {
    id: snap.id,
    ...data,
  };
}
