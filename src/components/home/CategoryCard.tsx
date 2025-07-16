// src/components/home/CategoryCard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface CategoryCardProps extends ComponentProps<'button'> {
  /** 아이콘 (ReactNode) */
  icon: React.ReactNode;
  /** 레이블 */
  label: string;
  /** 클릭 시 이동할 URL */
  href: string;
}

export function CategoryCard({ icon, label, href, className, ...rest }: CategoryCardProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={cn(
        'flex h-20 w-full xs:h-24 xs:w-20 sm:h-28 sm:w-24 flex-col items-center justify-center gap-1 xs:gap-2 rounded-lg border text-xs xs:text-sm transition hover:bg-muted',
        className,
      )}
      {...rest}
    >
      <span className="text-foreground/70">{icon}</span>
      <span className="text-center leading-tight">{label}</span>
    </button>
  );
}
