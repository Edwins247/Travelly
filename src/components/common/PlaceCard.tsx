'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LikeButton } from '@/components/common/LikeButton';
// import { useRouter } from 'next/navigation';

interface PlaceCardProps {
  id: string;
  name: string;
  region: string;
  thumbnail: string;
  category?: string;
  className?: string;
}

export function PlaceCard({ id, name, region, thumbnail, className }: PlaceCardProps) {
  // const router = useRouter();

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
        <LikeButton placeId={id} />
      </div>

      {/* --- 본문 --- */}
      <div className="space-y-1 p-3">
        <h3 className="truncate text-sm font-semibold">{name}</h3>
        <p className="truncate text-xs text-muted-foreground">{region}</p>
      </div>
    </Link>
  );
}
