// 네비게이션 아이템 타입
export interface NavItem {
  href: string;
  label: string;
  exact?: boolean;
}

// 네비게이션 메뉴 아이템들
export const NAV_ITEMS = [
  { 
    href: '/', 
    label: '홈', 
    exact: true 
  },
  { 
    href: '/search', 
    label: '여행지' 
  },
  { 
    href: '/wishlist', 
    label: '찜 리스트' 
  },
  { 
    href: '/contribute', 
    label: '여행지 제안' 
  },
] as const;

// 네비게이션 관련 설정
export const NAV_CONFIG = {
  LOGO_TEXT: 'Travelly',
  MOBILE_BREAKPOINT: 'md', // Tailwind breakpoint
} as const;
