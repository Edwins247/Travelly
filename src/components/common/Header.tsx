'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { NavLink } from '@/components/common/NavLink';
import { LoginButton } from '@/components/common/LoginButton';
import { MobileSheet } from '@/components/common/MobileSheet';
import { NAV_ITEMS, NAV_CONFIG } from '@/constants/navigation';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 로고 */}
      <Link href="/" className="text-lg font-bold">
        {NAV_CONFIG.LOGO_TEXT}
      </Link>

      {/* 데스크톱 GNB */}
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          {NAV_ITEMS.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* 데스크톱 로그인 버튼 */}
      <div className="hidden md:block">
        <LoginButton />
      </div>

      {/* 모바일 햄버거 메뉴 */}
      <MobileSheet nav={NAV_ITEMS} />
    </header>
  );
}
