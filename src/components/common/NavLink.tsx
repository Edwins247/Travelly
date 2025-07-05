'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';   // ← shadcn/ui 파일
import { cn } from '@/lib/utils';

export interface NavLinkProps {
  /** 이동할 경로 */
  href: string;
  /** 표시할 라벨 */
  label: string;
  /** href 와 pathname 을 완전히 일치시켜야 active? (기본: startsWith) */
  exact?: boolean;
  /** Tailwind 추가 클래스 */
  className?: string;
}

export function NavLink({ href, label, exact = false, className }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            'px-3 py-2 text-sm transition-colors hover:text-primary/80',
            isActive && 'text-primary font-semibold',
            className
          )}
        >
          {label}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
