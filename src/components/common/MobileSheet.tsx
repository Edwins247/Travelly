'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { LoginButton } from '@/components/common/LoginButton';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

interface MobileSheetProps {
  /** 햄버거 아이콘 Tailwind 클래스를 커스터마이즈하고 싶을 때 */
  className?: string;
  /** Header 쪽에서 주입하는 네비게이션 배열 */
  nav: NavItem[];
}

// 모바일용 링크 컴포넌트 (NavigationMenu 컨텍스트 불필요)
function MobileNavLink({ href, label, exact = false, className }: NavItem & { className?: string }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          'w-full rounded-md px-3 py-2 text-base hover:bg-accent transition-colors',
          active && 'text-primary font-semibold bg-accent',
          className,
        )}
      >
        {label}
      </Link>
    </SheetClose>
  );
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
      <SheetContent side="left" className="w-80 p-0">
        <VisuallyHidden>
          <SheetTitle>네비게이션 메뉴</SheetTitle>
          <SheetDescription>
            사이트의 주요 페이지로 이동할 수 있는 네비게이션 메뉴입니다.
          </SheetDescription>
        </VisuallyHidden>
        <nav className="flex flex-col gap-1 px-4 py-6">
          {nav.map(item => (
            <MobileNavLink
              key={item.href}
              {...item}
            />
          ))}

          {/* 로그인 / 로그아웃 버튼 자리 */}
          <div className="mt-4 border-t pt-4">
            <SheetClose asChild>
              <LoginButton className="w-full" />
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
