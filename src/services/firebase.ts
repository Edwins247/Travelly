import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage }  from 'firebase/storage';
import { getPerformance } from "firebase/performance";
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:               process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:           process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:                process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:        process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // optional
};

// Firebase 앱 초기화 (중복 방지)
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Analytics는 클라이언트 사이드에서만 초기화
export const analytics = typeof window !== 'undefined'
  ? isSupported().then(ok => ok ? getAnalytics(firebaseApp) : null)
  : null;

// Performance는 클라이언트 사이드에서만 초기화
export const perf = typeof window !== 'undefined'
  ? getPerformance(firebaseApp)
  : null;
