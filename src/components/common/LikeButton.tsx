// src/components/common/LikeButton.tsx
'use client';

import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/useWishlist';

interface LikeButtonProps {
  placeId: string;
  className?: string;
}

export function LikeButton({ placeId, className }: LikeButtonProps) {
  const { wishlist, loading, toggle } = useWishlist();
  const liked = wishlist.includes(placeId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(placeId, !liked);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={liked ? '찜 해제' : '찜하기'}
      disabled={loading}
      className={cn(
        'absolute right-2 top-2 rounded-full bg-white/80 p-1 backdrop-blur transition',
        liked ? 'text-destructive' : 'text-muted-foreground',
        className
      )}
    >
      <Heart className={liked ? 'fill-destructive' : 'fill-none'} size={18} />
    </button>
  );
}
