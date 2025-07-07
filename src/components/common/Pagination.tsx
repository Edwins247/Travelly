'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Props {
  perPage: number;
  total: number;
  onPageChange?: (p: number) => void;   // ☆ 추가 (선택)
}

export function Pagination({ perPage, total }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const current = Number(params.get('page') ?? '1');
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  /* ── helpers ───────────────────────────── */
  const go = (page: number) => {
    const p = new URLSearchParams(params);

    if (page > 1) {
      p.set('page', String(page));
    } else {
      p.delete('page');
    }

    router.push(`?${p.toString()}`, { scroll: false });
  };

  /* ── 버튼 렌더 ──────────────────────────── */
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
