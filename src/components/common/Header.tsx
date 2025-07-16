'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

import { NavLink } from '@/components/common/NavLink';   
import { LoginButton } from '@/components/common/LoginButton';
import { MobileSheet } from '@/components/common/MobileSheet';

const navItems = [
  { href: '/',          label: '홈', exact: true },
  { href: '/search',    label: '여행지' },
  { href: '/wishlist',  label: '찜 리스트' },
  { href: '/contribute',label: '여행지 제안' },
];

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 sm:px-6 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* 로고 */}
      <Link href="/" className="text-lg font-bold">
        Travelly
      </Link>

      {/* 데스크톱 GNB */}
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          {navItems.map(item => (
            <NavLink key={item.href} {...item} />
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      {/* 데스크톱 로그인 버튼 */}
      <div className="hidden md:block">
        <LoginButton />
      </div>

      {/* 모바일 햄버거 메뉴 */}
      <MobileSheet nav={navItems} />
    </header>
  );
}
