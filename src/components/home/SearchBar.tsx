// src/components/search/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchKeywordSuggestions } from '@/services/places';

export function SearchBar() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showList, setShowList] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // debouncedInput 변경 시 제안 키워드 조회
  useEffect(() => {
    let active = true;
    const term = debouncedInput.trim();

    if (term) {
      setIsLoadingSuggestions(true);
      fetchKeywordSuggestions(term).then((list) => {
        if (active) {
          setSuggestions(list);
          setShowList(list.length > 0); // 제안이 있을 때만 리스트 표시
          setIsLoadingSuggestions(false);
        }
      }).catch((error) => {
        console.error('SearchBar: error fetching suggestions:', error);
        if (active) {
          setSuggestions([]);
          setShowList(false);
          setIsLoadingSuggestions(false);
        }
      });
    } else {
      setSuggestions([]);
      setShowList(false);
      setIsLoadingSuggestions(false);
    }
    return () => {
      active = false;
    };
  }, [debouncedInput]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = input.trim();
    if (!term) return;
    router.push(`/search?keyword=${encodeURIComponent(term)}`);
    setShowList(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={onSubmit} className="flex">
        <Input
          value={input}
          placeholder="어디로 떠나고 싶으신가요?"
          onFocus={() => setShowList(true)}
          onBlur={() => setTimeout(() => setShowList(false), 150)}
          onChange={(e) => setInput(e.target.value)}
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
                onMouseDown={() => {
                  setInput(kw);
                  router.push(`/search?keyword=${encodeURIComponent(kw)}`);
                }}
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
