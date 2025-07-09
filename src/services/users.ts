// src/services/users.ts
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export async function ensureUserDocument(user: FirebaseUser) {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) return; // 이미 있으면 넘어감

  // 새 유저라면 Firestore에 저장
  await setDoc(userRef, {
    uid: user.uid,
    displayName: user.displayName ?? '',
    email: user.email ?? '',
    provider: user.providerData[0]?.providerId ?? 'password',
    createdAt: serverTimestamp(),
    wishlist: [],
  });
}

/**
 * 주어진 uid의 wishlist(문서 필드)를 한 번만 읽어 옵니다.
 */
export async function getUserWishlist(uid: string): Promise<string[]> {
  const snap = await getDoc(doc(db, 'users', uid));
  const data = snap.data() as any;
  return Array.isArray(data?.wishlist) ? data.wishlist : [];
}

/**
 * placeId를 wishlist에 추가
 */
export async function addToWishlist(uid: string, placeId: string) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    wishlist: arrayUnion(placeId),
  });
}

/**
 * placeId를 wishlist에서 제거
 */
export async function removeFromWishlist(uid: string, placeId: string) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    wishlist: arrayRemove(placeId),
  });
}

/**
 * 유저 문서를 실시간 구독해 wishlist 배열을 업데이트합니다.
 * 컴포넌트 언마운트 시 구독 해제 함수를 반환합니다.
 */
export function subscribeWishlist(
  uid: string,
  callback: (ids: string[]) => void
): () => void {
  const userRef = doc(db, 'users', uid);
  const unsub = onSnapshot(userRef, (snap) => {
    const data = snap.data() as any;
    callback(Array.isArray(data?.wishlist) ? data.wishlist : []);
  });
  return unsub;
}