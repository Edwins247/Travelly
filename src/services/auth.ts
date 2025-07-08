// src/services/auth.ts
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from 'firebase/auth';
import { firebaseApp } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';

const auth = getAuth(firebaseApp);
const google = new GoogleAuthProvider();
const set = useAuthStore.getState();

function start() {
  set.setLoad(true);
  set.setError(null);
}

function success(user: User) {
  set.setUser(user);
}

function fail(e: unknown) {
  if (e instanceof Error) set.setError(e.message);
  throw e;
}

function end() {
  set.setLoad(false);
}

/**
 * 이메일 로그인 or 회원가입
 */
export async function signInOrSignUpEmail(email: string, password: string) {
  start();
  try {
    // 1) 먼저 회원가입 시도
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    success(user);
    return user;
  } catch (err) {
    const e = err as AuthError;

    // 2) 이미 계정이 있는 이메일이라면, 로그인으로 분기
    if (e.code === 'auth/email-already-in-use') {
      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        success(user);
        return user;
      } catch (innerErr) {
        const ie = innerErr as AuthError;
        if (ie.code === 'auth/wrong-password') {
          set.setError('비밀번호가 올바르지 않습니다.');
          return;
        }
        // 그 외 로그인 오류
        fail(ie);
      }
    }

    // 3) 비밀번호 없이 다른 프로바이더로만 가입된 경우
    if (e.code === 'auth/invalid-credential' || e.code === 'auth/account-exists-with-different-credential') {
      set.setError('이 이메일은 Google 로그인으로만 가입된 계정입니다.');
      return;
    }

    // 4) 나머지 오류
    fail(e);
  } finally {
    end();
  }
}

export async function signInWithGoogle() {
  start();
  try {
    const { user } = await signInWithPopup(auth, google);
    success(user);
    return user;
  } catch (e) {
    fail(e);
  } finally {
    end();
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    set.setUser(null);
  } catch (e) {
    set.setError((e as Error).message);
    throw e;
  }
}
