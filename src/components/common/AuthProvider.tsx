'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';
import { ensureUserDocument } from '@/services/users';
import { PageLoader } from '@/components/common/PageLoader';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoad, loading } = useAuthStore();

  useEffect(() => {
    setLoad(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 사용자가 로그인된 상태
        setUser(user);
        await ensureUserDocument(user);
      } else {
        // 사용자가 로그아웃된 상태
        setUser(null);
      }
      setLoad(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoad]);

  // 초기 인증 상태 로딩 중일 때 전체 페이지 로더 표시
  if (loading) {
    return <PageLoader />;
  }

  return <>{children}</>;
}
