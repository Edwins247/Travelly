// src/components/search/SearchBar.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useKeywordSuggestions } from '@/hooks/usePlaces';
import { performanceTracking } from '@/utils/performance';
import { searchAnalytics } from '@/utils/analytics';

export function SearchBar() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const [showList, setShowList] = useState(false);

  // React Query로 키워드 제안 가져오기
  const {
    data: suggestions = [],
    isLoading: isLoadingSuggestions
  } = useKeywordSuggestions(debouncedInput.trim(), 5);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const term = input.trim();
    if (!term) return;

    // 검색 실행 성능 추적
    performanceTracking.trackSearch('execution');

    // Analytics: 검색 쿼리 실행 (결과 수는 검색 페이지에서 추가)
    searchAnalytics.searchQuery(term, 0); // 결과 수는 나중에 업데이트

    router.push(`/search?keyword=${encodeURIComponent(term)}`);
    setShowList(false);
    // 페이지 이동이므로 추적은 자동으로 종료됨
  }, [input, router]);

  const handleSuggestionClick = useCallback((kw: string) => {
    // Analytics: 검색 제안 클릭
    searchAnalytics.searchSuggestionClick(kw, input);

    setInput(kw);
    router.push(`/search?keyword=${encodeURIComponent(kw)}`);
  }, [input, router]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }, []);

  const handleFocus = useCallback(() => {
    setShowList(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => setShowList(false), 150);
  }, []);

  return (
    <div className="relative w-full">
      <form onSubmit={onSubmit} className="flex">
        <Input
          value={input}
          placeholder="어디로 떠나고 싶으신가요?"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleInputChange}
        />
        <Button type="submit" className="ml-2">
          <SearchIcon size={20} />
        </Button>
      </form>

      {showList && (
        <ul className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow">
          {isLoadingSuggestions ? (
            <li className="px-4 py-2 text-center text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                검색 중...
              </div>
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((kw) => (
              <li
                key={kw}
                className="cursor-pointer px-4 py-2 hover:bg-muted"
                onMouseDown={() => handleSuggestionClick(kw)}
              >
                {kw}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-center text-muted-foreground text-sm">
              검색 결과가 없습니다
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
