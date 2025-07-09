// src/services/users.ts
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, arrayUnion, arrayRemove, onSnapshot, Timestamp, DocumentReference, DocumentSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import type { User as FirebaseUser } from 'firebase/auth';

/** 
 * Firestore에 저장된 users/{uid} 문서 스키마 타입 
 */
interface UserDoc {
  uid: string;
  displayName: string;
  email: string;
  provider: string;
  createdAt: Timestamp;
  wishlist: string[];
}

export async function ensureUserDocument(user: FirebaseUser) {
  const userRef = doc(db, 'users', user.uid) as DocumentReference<UserDoc>;
  const snap = await getDoc(userRef);
  if (snap.exists()) return;

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
  const userRef = doc(db, 'users', uid) as DocumentReference<UserDoc>;
  const snap = await getDoc(userRef);
  const data = snap.data();        // data는 UserDoc | undefined
  return Array.isArray(data?.wishlist) ? data.wishlist : [];
}
/**
 * placeId를 wishlist에 추가
 */
export async function addToWishlist(uid: string, placeId: string) {
  const userRef = doc(db, 'users', uid) as DocumentReference<UserDoc>;
  await updateDoc(userRef, {
    wishlist: arrayUnion(placeId),
  });
}

/**
 * placeId를 wishlist에서 제거합니다.
 */
export async function removeFromWishlist(uid: string, placeId: string) {
  const userRef = doc(db, 'users', uid) as DocumentReference<UserDoc>;
  await updateDoc(userRef, {
    wishlist: arrayRemove(placeId),
  });
}

/**
 * 유저 문서를 실시간 구독해 wishlist 배열을 업데이트합니다.
 * 언마운트 시 구독을 해제하는 함수를 반환합니다.
 */
export function subscribeWishlist(
  uid: string,
  callback: (ids: string[]) => void
): () => void {
  const userRef = doc(db, 'users', uid) as DocumentReference<UserDoc>;
  const unsub = onSnapshot(userRef, (snap: DocumentSnapshot<UserDoc>) => {
    const data = snap.data();      // data는 UserDoc | undefined
    callback(Array.isArray(data?.wishlist) ? data.wishlist : []);
  });
  return unsub;
}