// src/components/common/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore }   from '@/store/authStore';
import { useLoginModal }  from '@/store/loginModalStore';
import { LoginModal }     from '@/components/common/LoginModal';
import { LoginRequired }  from '@/components/common/LoginRequired';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading }   = useAuthStore();
  const {
    openModal,
    closeModal,
    shouldAutoOpen,
    setShouldAutoOpen,
    wasClosedByUser,
    setWasClosedByUser
  } = useLoginModal();

  /* 로그인 여부 감시 → 로딩이 끝나고 user가 없으면 모달 오픈 */
  useEffect(() => {
    if (!loading && !user && shouldAutoOpen && !wasClosedByUser) {
      openModal();
    }
  }, [user, loading, openModal, shouldAutoOpen, wasClosedByUser]);

  /* 사용자가 로그인되면 모달 닫고 상태 리셋 */
  useEffect(() => {
    if (user) {
      closeModal(); // 로그인 성공 시 모달 즉시 닫기
      setShouldAutoOpen(true);
      setWasClosedByUser(false); // 로그인 성공 시 닫힘 상태 리셋
    }
  }, [user, closeModal, setShouldAutoOpen, setWasClosedByUser]);

  /* 로딩 중일 때 */
  if (loading) {
    return <LoginModal />;
  }

  /* 사용자가 없고 모달을 닫았을 때 - LoginRequired 표시 */
  if (!user && wasClosedByUser) {
    return (
      <>
        <LoginRequired
          title="로그인이 필요합니다"
          description="이 페이지를 보려면 로그인해주세요."
        />
        <LoginModal />
      </>
    );
  }

  /* 사용자가 없고 모달이 열려있어야 할 때 */
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
