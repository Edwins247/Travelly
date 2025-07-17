'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { NavItem } from '@/constants/navigation';

export interface NavLinkProps extends NavItem {
  className?: string;
}

export function NavLink({ href, label, exact = false, className }: NavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <NavigationMenuItem>
      {/* asChild => 내부에 커스텀 태그 삽입 */}
      <NavigationMenuLink
        asChild
        className={cn(
          'px-3 py-2 text-sm transition-colors hover:text-primary/80',
          active && 'text-primary font-semibold',
          className,
        )}
      >
        <Link href={href}>{label}</Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}
