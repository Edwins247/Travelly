'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center space-y-8 text-center p-4">
      <div className="space-y-4">
        <div className="text-6xl font-bold text-primary">404</div>
        <h1 className="text-3xl font-semibold tracking-tight">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-muted-foreground max-w-md">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            홈으로 이동
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/search">
            <Search className="h-4 w-4" />
            여행지 검색
          </Link>
        </Button>
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          이전 페이지
        </Button>
      </div>
    </main>
  );
}
