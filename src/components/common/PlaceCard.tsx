'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlaceCardData } from '@/types/place';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface PlaceCardProps extends PlaceCardData {
  onToggleLike?: (id: string, next: boolean) => void; // wishlist 페이지에서 주입
  className?: string;
}

export function PlaceCard({
  id,
  name,
  region,
  thumbnail,
  category,
  liked = false,
  onToggleLike,
  className,
}: PlaceCardProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();                // 카드 클릭 방지
    if (!user) {
      // 👉 로그인 모달 열기
      document.getElementById('login-trigger')?.click();
      return;
    }
    onToggleLike?.(id, !liked);
  };

  return (
    <Link
      href={`/places/${id}`}
      className={cn(
        'group flex w-56 flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md',
        className,
      )}
    >
      {/* --- 썸네일 --- */}
      <div className="relative h-36 w-full overflow-hidden">
        <Image
          src={thumbnail || '/img/placeholder.png'}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          unoptimized
        />

        {/* 찜 버튼 */}
        <button
          onClick={handleLike}
          aria-label="like"
          className={cn(
            'absolute right-2 top-2 rounded-full bg-white/80 p-1 backdrop-blur transition',
            liked ? 'text-destructive' : 'text-muted-foreground',
          )}
        >
          <Heart className={liked ? 'fill-destructive' : 'fill-none'} size={18} />
        </button>
      </div>

      {/* --- 본문 --- */}
      <div className="space-y-1 p-3">
        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          {category}
        </span>

        <h3 className="truncate text-sm font-semibold">{name}</h3>
        <p className="truncate text-xs text-muted-foreground">{region}</p>
      </div>
    </Link>
  );
}
