'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';      
import { cn } from '@/lib/utils';

// ToDo: 실제 키워드 바탕으로 업데이트하기
interface KeywordChipsProps {
  /** 추천 키워드 목록 (해시태그 없이 텍스트만) */
  keywords: string[];
  className?: string;
}

export function KeywordChips({ keywords, className }: KeywordChipsProps) {
  const router = useRouter();

  if (!keywords.length) return null;

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {keywords.map(k => (
        <Badge
          key={k}
          variant="secondary"
          className="cursor-pointer rounded-full px-3 py-1 text-[13px] font-medium hover:bg-primary/10"
          onClick={() => router.push(`/search?keyword=${encodeURIComponent(k)}`)}
        >
          #{k}
        </Badge>
      ))}
    </div>
  );
}
