'use client';

import { Button } from '@/components/ui/button';
import { useLoginModal } from '@/store/loginModalStore';
import { Lock, LogIn } from 'lucide-react';
import Link from 'next/link';

interface LoginRequiredProps {
  title?: string;
  description?: string;
}

export function LoginRequired({ 
  title = "로그인이 필요합니다", 
  description = "이 페이지를 보려면 로그인해주세요." 
}: LoginRequiredProps) {
  const { openModal } = useLoginModal();

  const handleLoginClick = () => {
    openModal();
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <div className="rounded-full bg-muted p-6">
        <Lock className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground max-w-md">{description}</p>
      </div>

      <div className="space-y-3">
        <Button onClick={handleLoginClick} className="gap-2">
          <LogIn className="h-4 w-4" />
          로그인하기
        </Button>
        
        <p className="text-sm text-muted-foreground">
          또는{' '}
          <Link
            href="/" 
            className="text-primary hover:underline"
          >
            홈으로 돌아가기
          </Link>
        </p>
      </div>
    </div>
  );
}
