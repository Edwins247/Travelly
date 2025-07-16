'use client';

import { useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// FilterBar.tsx 상단
const regions = [
  { value: 'all', label: '전체' },
  { value: 'domestic', label: '국내' },
  { value: 'abroad', label: '해외' },
];

const seasons = ['all', '봄', '여름', '가을', '겨울'];
const budgets = ['all', '저예산', '중간', '고급'];

export function FilterBar() {
  const params = useSearchParams();
  const router = useRouter();

  // helper: param 교체 후 push
  const setParam = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params);

    if (value === 'all') {
      p.delete(key); // ‘전체’ 선택 = 파라미터 제거
    } else {
      p.set(key, value); // 나머지는 그대로 설정
    }

    router.push(`/search?${p.toString()}`);
  }, [params, router]);

  const reset = useCallback(() =>
    router.push(`/search?keyword=${params.get('keyword') ?? ''}`),
    [router, params]
  );

  const handleRegionChange = useCallback((value: string) => setParam('region', value), [setParam]);
  const handleSeasonChange = useCallback((value: string) => setParam('season', value), [setParam]);
  const handleBudgetChange = useCallback((value: string) => setParam('budget', value), [setParam]);

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      {/* ---------- Region ---------- */}
      <Select value={params.get('region') ?? ''} onValueChange={handleRegionChange}>
        <SelectTrigger className="w-20 sm:w-32 text-sm">
          <SelectValue placeholder="지역" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ---------- Season ---------- */}
      <Select value={params.get('season') ?? ''} onValueChange={handleSeasonChange}>
        <SelectTrigger className="w-20 sm:w-28 text-sm">
          <SelectValue placeholder="계절" />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s) => (
            <SelectItem key={s} value={s}>
              {s || '전체'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ---------- Budget ---------- */}
      <Select value={params.get('budget') ?? ''} onValueChange={handleBudgetChange}>
        <SelectTrigger className="w-20 sm:w-28 text-sm">
          <SelectValue placeholder="예산" />
        </SelectTrigger>
        <SelectContent>
          {budgets.map((b) => (
            <SelectItem key={b} value={b}>
              {b || '전체'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ---------- Reset ---------- */}
      <Button variant="ghost" size="sm" onClick={reset} className="text-sm px-2 sm:px-3">
        초기화
      </Button>
    </div>
  );
}
