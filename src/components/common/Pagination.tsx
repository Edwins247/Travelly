// src/components/common/Pagination.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PAGINATION } from '@/constants/common';

interface Props {
  perPage: number;
  total: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  perPage,
  total,
  currentPage,
  onPageChange,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();

  // use passed-in currentPage if provided, otherwise read from URL
  const current = currentPage ?? Number(params.get('page') ?? '1');
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const go = (page: number) => {
    // allow parent to override navigation
    if (onPageChange) {
      onPageChange(page);
      return;
    }

    const p = new URLSearchParams(params);
    if (page > 1) {
      p.set('page', String(page));
    } else {
      p.delete('page');
    }
    router.push(`?${p.toString()}`, { scroll: false });
  };

  // 모바일에서는 페이지 수를 제한
  const getVisiblePages = () => {
    const maxVisible = PAGINATION.MAX_VISIBLE_PAGES; // 모바일에서 최대 5개 페이지만 표시
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(1, current - half);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return { start, end };
  };

  const { start, end } = getVisiblePages();
  const items = [];

  for (let i = start; i <= end; i++) {
    items.push(
      <Button
        key={i}
        size="sm"
        variant={i === current ? 'default' : 'outline'}
        onClick={() => go(i)}
        className="w-8 h-8 p-0 text-sm"
      >
        {i}
      </Button>,
    );
  }

  return (
    <div className="flex justify-center items-center gap-1 sm:gap-2 py-4 sm:py-6">
      <Button
        size="sm"
        variant="outline"
        disabled={current === 1}
        onClick={() => go(current - 1)}
        className="w-8 h-8 p-0"
      >
        ‹
      </Button>

      {start > 1 && (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => go(1)}
            className="w-8 h-8 p-0 text-sm"
          >
            1
          </Button>
          {start > 2 && <span className="px-1 text-muted-foreground">...</span>}
        </>
      )}

      {items}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-muted-foreground">...</span>}
          <Button
            size="sm"
            variant="outline"
            onClick={() => go(totalPages)}
            className="w-8 h-8 p-0 text-sm"
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="outline"
        disabled={current === totalPages}
        onClick={() => go(current + 1)}
        className="w-8 h-8 p-0"
      >
        ›
      </Button>
    </div>
  );
}
