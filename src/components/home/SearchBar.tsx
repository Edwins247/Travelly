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

  // debouncedInput 변경 시 제안 키워드 조회
  useEffect(() => {
    let active = true;
    const term = debouncedInput.trim();
    if (term) {
      fetchKeywordSuggestions(term).then((list) => {
        if (active) setSuggestions(list);
      });
    } else {
      setSuggestions([]);
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

      {showList && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow">
          {suggestions.map((kw) => (
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
          ))}
        </ul>
      )}
    </div>
  );
}
