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
} from 'firebase/firestore';
import { db } from './firebase';
import { Review, ReviewInput } from '@/types/review';

/** 특정 장소의 후기 전체를 최근순으로 가져옵니다. */
export async function getReviewsByPlace(placeId: string): Promise<Review[]> {
  const q = query(
    collection(db, 'reviews'),
    where('placeId', '==', placeId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as Omit<Review, 'id' | 'createdAt'> & { createdAt: any };
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt.toDate(),
    };
  });
}

/** 후기 추가 + 장소 키워드·리뷰 카운트 업데이트 */
export async function addReview(input: ReviewInput) {
  // 1) 리뷰 문서 추가
  const ref = await addDoc(collection(db, 'reviews'), {
    ...input,
    createdAt: serverTimestamp(),
  });

  // 2) places/{placeId}.stats.reviewCount 를 1씩 올려주기
  const placeRef = doc(db, 'places', input.placeId);
  await updateDoc(placeRef, {
    'stats.reviewCount': increment(1),
    // keywords 축적은 arrayUnion 으로 따로 구현하세요
  });

  return ref.id;
}
