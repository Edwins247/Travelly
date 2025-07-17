import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
  type CollectionReference,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Review, ReviewInput } from '@/types/review';
import { toast } from '@/store/toastStore';

/**
 * Firestore 에 저장된 raw 리뷰 타입:
 * - Review 에서 id, createdAt(Date) 를 뺀 뒤,
 * - createdAt 은 Firestore Timestamp 로.
 */
interface ReviewFirestore extends Omit<Review, 'id' | 'createdAt'> {
  createdAt: Timestamp;
}

/** 특정 장소의 후기 전체를 최근순으로 가져옵니다. */
export async function getReviewsByPlace(placeId: string): Promise<Review[]> {
  try {
    // 1) 컬렉션 레퍼런스에 제네릭 지정
    const reviewsCol = collection(db, 'reviews') as CollectionReference<ReviewFirestore>;

    // 2) where + orderBy
    const q = query(
      reviewsCol,
      where('placeId', '==', placeId),
      orderBy('createdAt', 'desc')
    );

    // 3) 조회
    const snap = await getDocs(q);

    // 4) Snapshot → Review[]
    return snap.docs.map((docSnap: QueryDocumentSnapshot<ReviewFirestore>) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        placeId: data.placeId,
        content: data.content,
        userTags: data.userTags,
        userId: data.userId,
        // Timestamp → Date
        createdAt: data.createdAt.toDate(),
      };
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching reviews:', error);
    toast.error('후기 로딩 실패', '네트워크 연결을 확인하고 다시 시도해주세요.');
    return []; // 빈 배열 반환으로 UI가 깨지지 않도록 함
  }
}

/** 후기 추가 + places/{placeId}.stats.reviewCount 를 1 올려줍니다. */
export async function addReview(input: ReviewInput): Promise<string> {
  try {
    // 1) 리뷰 문서 추가
    const ref = await addDoc(collection(db, 'reviews'), {
      ...input,
      createdAt: serverTimestamp(),
    });

    // 2) reviewCount 증가
    const placeRef = doc(db, 'places', input.placeId);
    await updateDoc(placeRef, {
      'stats.reviewCount': increment(1),
    });

    toast.success('후기가 등록되었습니다', '소중한 후기를 남겨주셔서 감사합니다!');
    return ref.id;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error adding review:', error);
    toast.error('후기 등록 실패', '잠시 후 다시 시도해주세요.');
    throw error;
  }
}
