'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';         
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------
   UI 전용 컴포넌트 – 아직 Firestore 연결 X
   TODO: 🔍 키 입력 → firestore 키워드 자동완성 fetch 후 suggestions 상태로 세팅
------------------------------------------------------------------- */
interface SearchBarProps {
  /** 임시 자동완성 키워드 (없으면 기본 더미) */
  defaultSuggestions?: string[];
  className?: string;
}

export function SearchBar({
  defaultSuggestions = ['혼자 힐링', '겨울 실내', '가족 여행'],
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [open, setOpen]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = defaultSuggestions.filter(k =>
    k.toLowerCase().includes(value.toLowerCase()),
  );

  const handleSubmit = (keyword: string) => {
    if (!keyword.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
    setOpen(false);
    setValue('');
    inputRef.current?.blur();
  };

  return (
    <div className={cn('relative w-full max-w-xl', className)}>
      {/* ----------------- 검색 입력 ----------------- */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit(value);
        }}
      >
        <div className="flex items-center rounded-full bg-muted pl-4 pr-2 py-2 ring-1 ring-border focus-within:ring-primary/60">
          <Input
            ref={inputRef}
            value={value}
            onChange={e => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="어디로 떠나고 싶으신가요?"
            className="border-none bg-transparent focus-visible:ring-0"
          />

          <Button size="icon" type="submit" variant="ghost">
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </form>

      {/* ----------------- 자동완성 리스트 ----------------- */}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border bg-background shadow-lg"
          onMouseLeave={() => setOpen(false)}
        >
          {suggestions.map(k => (
            <li
              key={k}
              onClick={() => handleSubmit(k)}
              className="cursor-pointer px-4 py-2 hover:bg-muted"
            >
              {k}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
