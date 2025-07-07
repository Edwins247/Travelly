// src/components/common/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore }   from '@/store/authStore';
import { useLoginModal }  from '@/store/loginModalStore';
import { LoginModal }     from '@/components/common/LoginModal';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user }            = useAuthStore();
  const { openModal }       = useLoginModal();

  /* 로그인 여부 감시 → 없으면 모달 오픈 */
  useEffect(() => {
    if (!user) openModal();
  }, [user, openModal]);

  /* user 가 없으면 children 렌더를 막고 모달만 */
  if (!user) {
    return <LoginModal />;
  }

  /* 로그인 완료 시: 실제 컨텐츠 + 모달(언제든 재사용) */
  return (
    <>
      {children}
      <LoginModal />
    </>
  );
}
