'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/store/toastStore';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') console.error('Global error: ', error);
    // 에러를 토스트로 알림
    toast.error(
      '서버 오류가 발생했습니다',
      '잠시 후 다시 시도해주세요.'
    );
  }, [error]);

  const handleRefresh = () => {
    reset();
    window.location.reload();
  };

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 text-center p-4">
      <div className="rounded-full bg-red-100 p-6">
        <AlertTriangle className="h-16 w-16 text-red-600" />
      </div>

      <div className="space-y-4 max-w-md">
        <div className="text-4xl font-bold text-red-600">500</div>
        <h1 className="text-3xl font-semibold tracking-tight">
          서버 오류가 발생했습니다
        </h1>
        <p className="text-muted-foreground">
          일시적인 서버 문제로 요청을 처리할 수 없습니다.
          잠시 후 다시 시도해주세요.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            홈으로 이동
          </Link>
        </Button>
      </div>
    </main>
  );
}
