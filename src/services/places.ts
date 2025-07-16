import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  increment,
  Query,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, storage } from '@/services/firebase';
import { GetPlacesOptions, Place, PlaceCardData, PlaceDTO, PlaceInput } from '@/types/place';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from '@/store/toastStore';
import { performanceTracking, stopTrace } from '@/utils/performance';

// Firebase 에러 타입 정의
interface FirebaseError {
  code?: string;
  message?: string;
}

// 네트워크 에러 확인 함수
function isNetworkError(error: unknown): boolean {
  const firebaseError = error as FirebaseError;
  return (
    firebaseError?.code === 'unavailable' ||
    firebaseError?.code === 'deadline-exceeded' ||
    firebaseError?.message?.includes('network') ||
    firebaseError?.message?.includes('offline') ||
    !navigator.onLine
  );
}

// 에러 메시지 생성 함수
function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (isNetworkError(error)) {
    return '네트워크 연결을 확인하고 다시 시도해주세요.';
  }
  return defaultMessage;
}


// 1) 빈 틀만 생성하고 ID 리턴 (최초 호출)
export async function addPlace(): Promise<string> {
  try {
    const ref = doc(collection(db, 'places'));
    await setDoc(ref, {
      stats: { likes: 0, reviewCount: 0 },
      createdAt: serverTimestamp(),
    });
    return ref.id;
  } catch (error) {
    console.error('Error creating place:', error);
    const message = getErrorMessage(error, '잠시 후 다시 시도해주세요.');
    toast.error('여행지 생성 실패', message);
    throw error;
  }
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
  // 성능 추적 시작
  const trace = performanceTracking.trackFirestoreQuery('getPlaces');

  try {
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
    const result = snap.docs.map((doc: QueryDocumentSnapshot<Place>) => {
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

    // 성능 추적 종료
    stopTrace(trace);
    return result;
  } catch (error) {
    console.error('Error fetching places:', error);
    const message = getErrorMessage(error, '잠시 후 다시 시도해주세요.');
    toast.error('여행지 목록 로딩 실패', message);

    // 에러 시에도 추적 종료
    stopTrace(trace);
    return []; // 빈 배열 반환으로 UI가 깨지지 않도록 함
  }
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
 * places 컬렉션의 keywords 필드에서 입력값으로 시작하는 키워드를 최대 limit개 가져옵니다.
 * ToDo: 이렇게 컬렉션에서 keywords를 추출하는 방식 vs keywords를 아예 따로 새로운 컬렉션으로 만들어서 검색하게 하기
 */
export async function fetchKeywordSuggestions(prefix: string, limit = 5): Promise<string[]> {
  if (!prefix) return [];

  try {
    const col = collection(db, 'places');
    const snap = await getDocs(col);

    // 모든 places의 keywords를 수집
    const allKeywords = new Set<string>();

    snap.docs.forEach(doc => {
      const data = doc.data();
      if (data.keywords && Array.isArray(data.keywords)) {
        data.keywords.forEach((keyword: string) => {
          if (keyword.toLowerCase().includes(prefix.toLowerCase())) {
            allKeywords.add(keyword);
          }
        });
      }
    });

    // Set을 배열로 변환하고 정렬 후 limit 적용
    const results = Array.from(allKeywords)
      .sort()
      .slice(0, limit);

    return results;
  } catch (error) {
    console.error('fetchKeywordSuggestions: error:', error);
    return [];
  }
}

/**
 * 여행지의 좋아요 수를 1 증가시킵니다.
 */
export async function incrementPlaceLikes(placeId: string): Promise<void> {
  const placeRef = doc(db, 'places', placeId);
  await updateDoc(placeRef, {
    'stats.likes': increment(1),
  });
}

/**
 * 여행지의 좋아요 수를 1 감소시킵니다.
 */
export async function decrementPlaceLikes(placeId: string): Promise<void> {
  const placeRef = doc(db, 'places', placeId);
  await updateDoc(placeRef, {
    'stats.likes': increment(-1),
  });
}



/**
 * SSG를 위해 모든 장소 ID를 가져옵니다.
 */
export async function getAllPlaceIds(): Promise<string[]> {
  try {
    const col = collection(db, 'places');
    const snap = await getDocs(col);
    return snap.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error fetching all place IDs:', error);
    return [];
  }
}

export async function getPlaceById(id: string): Promise<PlaceDTO | null> {
  try {
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
  } catch (error) {
    console.error('Error fetching place by id:', error);
    const message = getErrorMessage(error, '페이지를 새로고침하거나 다시 시도해주세요.');
    toast.error('여행지 정보 로딩 실패', message);
    return null;
  }
}


export function uploadPlaceImage(file: File, placeId: string): Promise<string> {
  const path = `places/${placeId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  // 성능 추적 시작
  const trace = performanceTracking.trackImageUpload();

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      null,
      (error) => {
        console.error('Error uploading image:', error);
        toast.error('이미지 업로드 실패', '파일 크기나 형식을 확인하고 다시 시도해주세요.');
        stopTrace(trace); // 에러 시 추적 종료
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(storageRef);
          stopTrace(trace); // 성공 시 추적 종료
          resolve(url);
        } catch (e) {
          console.error('Error getting download URL:', e);
          toast.error('이미지 URL 생성 실패', '다시 시도해주세요.');
          stopTrace(trace); // 에러 시 추적 종료
          reject(e);
        }
      }
    );
  });
}


