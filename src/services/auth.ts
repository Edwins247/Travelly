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

const auth    = getAuth(firebaseApp);
const google  = new GoogleAuthProvider();

/* ------------------------------------------------------------- */
/*  공통 헬퍼 – 상태 업데이트                                     */
/* ------------------------------------------------------------- */
const set = useAuthStore.getState();

function start() { set.setLoad(true);  set.setError(null); }
function success(user: User) { set.setUser(user); }
function fail(e: any) { set.setError(e.message); throw e; }
function end() { set.setLoad(false); }

/* ------------------------------------------------------------- */
/*  Google 로그인                                                 */
/* ------------------------------------------------------------- */
export async function signInWithGoogle() {
  try {
    start();
    const { user } = await signInWithPopup(auth, google);
    success(user);
    return user;
  } catch (e) {
    fail(e);
  } finally {
    end();
  }
}

/* ------------------------------------------------------------- */
/*  이메일: 자동 로그인 or 회원가입                               */
/* ------------------------------------------------------------- */
export async function signInOrSignUpEmail(email: string, password: string) {
  try {
    start();

    // 1) 로그인 시도
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    success(user);
    return user;
  } catch (err) {
    const e = err as AuthError;

    // 2) 존재하지 않으면 회원가입 → 곧바로 로그인 완료 상태
    if (e.code === 'auth/user-not-found') {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      success(user);
      return user;
    }

    // 3) 기타 오류 (비밀번호 틀림 등)
    fail(e);
  } finally {
    end();
  }
}

/* ------------------------------------------------------------- */
/*  로그아웃                                                      */
/* ------------------------------------------------------------- */
export async function signOutUser() {
  try {
    await signOut(auth);
    set.setUser(null);
  } catch (e) {
    set.setError((e as Error).message);
    throw e;
  }
}
