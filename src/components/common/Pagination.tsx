// src/components/common/Pagination.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

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

  const items = [];
  for (let i = 1; i <= totalPages; i++) {
    items.push(
      <Button
        key={i}
        size="icon"
        variant={i === current ? 'default' : 'outline'}
        onClick={() => go(i)}
        className="mx-0.5 w-8"
      >
        {i}
      </Button>,
    );
  }

  return (
    <div className="flex justify-center gap-2 py-6">
      <Button
        size="icon"
        variant="outline"
        disabled={current === 1}
        onClick={() => go(current - 1)}
      >
        ‹
      </Button>

      {items}

      <Button
        size="icon"
        variant="outline"
        disabled={current === totalPages}
        onClick={() => go(current + 1)}
      >
        ›
      </Button>
    </div>
  );
}
