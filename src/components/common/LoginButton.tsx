'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { signOutUser } from '@/services/auth';
import { useLoginModal } from '@/store/loginModalStore';

export function LoginButton({ className }: { className?: string }) {
  const { user, loading } = useAuthStore();
  const { openModal }     = useLoginModal();

  if (loading) return <Button disabled className={className}>로딩…</Button>;

  return user ? (
    <Button variant="outline" size="sm" onClick={signOutUser} className={className}>
      로그아웃
    </Button>
  ) : (
    <Button variant="outline" size="sm" onClick={openModal} className={className}>
      로그인
    </Button>
  );
}
