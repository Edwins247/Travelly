'use client';

import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonProps {
  title?: string;
  description?: string;
  showBackButton?: boolean;
}

export function ComingSoon({ 
  title = "준비중입니다", 
  description = "해당 페이지는 현재 준비 중입니다. 빠른 시일 내에 서비스를 제공하겠습니다.",
  showBackButton = true
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center px-4">
      <div className="rounded-full bg-muted p-6">
        <Construction className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {showBackButton && (
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            이전 페이지
          </Button>
        )}
        
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            홈으로 가기
          </Link>
        </Button>
      </div>

      <div className="text-xs text-muted-foreground mt-8">
        문의사항이 있으시면{' '}
        <a 
          href="mailto:team@travel.ly" 
          className="text-primary hover:underline"
        >
          abc123@gamil.com
        </a>
        로 연락해주세요.
      </div>
    </div>
  );
}
