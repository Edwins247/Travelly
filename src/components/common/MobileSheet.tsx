'use client';

import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { NavLink, NavLinkProps } from '@/components/common/NavLink';   // ← 우리가 만든 NavLink
// import { LoginButton } from '@/components/common/LoginButton';   // 만들고 나서 주석 해제
import { cn } from '@/lib/utils';

interface MobileSheetProps {
  /** 햄버거 아이콘 Tailwind 클래스를 커스터마이즈하고 싶을 때 */
  className?: string;
  /** Header 쪽에서 주입하는 네비게이션 배열 */
  nav: NavLinkProps[];
}

/**
 * 모바일(< md) 전용 햄버거 메뉴 + 사이드 Sheet
 */
export function MobileSheet({ className, nav }: MobileSheetProps) {
  return (
    <Sheet>
      {/* ── Trigger ───────────────────────────────────────────── */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('md:hidden', className)} // md 이상에선 숨김
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">메뉴</span>
        </Button>
      </SheetTrigger>

      {/* ── Content ───────────────────────────────────────────── */}
      <SheetContent side="left" className="w-72 p-0">
        <nav className="flex flex-col gap-1 px-4 py-6">
          {nav.map(item => (
            <NavLink
              key={item.href}
              {...item}
              className="w-full rounded-md px-3 py-2 text-base hover:bg-accent"
            />
          ))}

          {/* 로그인 / 로그아웃 버튼 자리 */}
          {/* <div className="mt-4 border-t pt-4">
            <LoginButton className="w-full" />
          </div> */}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
