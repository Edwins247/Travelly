import {
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
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, storage } from '@/services/firebase';
import { GetPlacesOptions, Place, PlaceCardData, PlaceInput } from '@/types/place';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


// src/services/places.ts

export interface PlaceDTO {
  id: string;
  name: string;
  description?: string;
  imageUrls: string[];
  location: {
    region: string;
    district?: string;
  };
  regionType: '국내' | '해외';
  seasonTags: string[];
  budgetLevel: '저예산' | '중간' | '고급';
  keywords: string[];
  createdBy: string;
  // 원시 문자열로 넘깁니다
  createdAt: string;
  stats: {
    likes: number;
    reviewCount: number;
  };
}

// 1) 빈 틀만 생성하고 ID 리턴 (최초 호출)
export async function addPlace(): Promise<string> {
  const ref = doc(collection(db, 'places'));
  await setDoc(ref, {
    stats: { likes: 0, reviewCount: 0 },
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// 2) 실제 필드 채우기 (업데이트)
export async function updatePlace(id: string, data: PlaceInput) {
  const ref = doc(db, 'places', id);
  await updateDoc(ref, {
    ...data,
    // createdAt나 stats는 그대로 두고, 필요한 필드만 덮어씌웁니다.
  });
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

export async function getPlaceById(id: string): Promise<PlaceDTO | null> {
  const ref = doc(db, 'places', id) as DocumentReference<Omit<Place, 'id'>>;
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const d = snap.data() as Omit<Place, 'id'>;

  return {
    id: snap.id,
    name: d.name,
    description: d.description,
    imageUrls: d.imageUrls,
    location: d.location,
    regionType: d.regionType,
    seasonTags: d.seasonTags,
    budgetLevel: d.budgetLevel,
    keywords: d.keywords,
    createdBy: d.createdBy,
    // Timestamp → Date → ISO 문자열
    createdAt: d.createdAt.toDate().toISOString(),
    stats: {
      // Firestore 쪽에서 increment 로 관리했다면 number 여야 합니다.
      likes: typeof d.stats.likes === 'number' ? d.stats.likes : 0,
      reviewCount:
        typeof d.stats.reviewCount === 'number' ? d.stats.reviewCount : 0,
    },
  };
}


export function uploadPlaceImage(file: File, placeId: string): Promise<string> {
  const path = `places/${placeId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      null,
      reject,
      async () => {
        try {
          const url = await getDownloadURL(storageRef);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}


