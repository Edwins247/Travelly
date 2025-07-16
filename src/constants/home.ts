// src/constants/home.ts
import { 
  Landmark, 
  Globe, 
  Wallet, 
  Heart, 
  Building, 
  Plane, 
  Soup, 
  Ticket 
} from 'lucide-react';

// 인기 키워드
export const HOT_KEYWORDS = [
  '혼자 힐링',
  '겨울 실내',
  '가족 여행',
  '사진맛집',
  '반려동물',
  '역사 탐방',
] as const;

// 카테고리 그리드 아이템들
export const CATEGORY_ITEMS = [
  { 
    label: '국내', 
    icon: Landmark, 
    href: '/search?region=domestic' 
  },
  { 
    label: '해외', 
    icon: Globe, 
    href: '/search?region=abroad' 
  },
  { 
    label: '저예산', 
    icon: Wallet, 
    href: '/search?budget=저예산' 
  },
  { 
    label: '힐링', 
    icon: Heart, 
    href: '/search?theme=힐링' 
  },
  { 
    label: '문화', 
    icon: Building, 
    href: '/search?theme=문화' 
  },
  { 
    label: '액티비티', 
    icon: Plane, 
    href: '/search?theme=액티비티' 
  },
  { 
    label: '맛집', 
    icon: Soup, 
    href: '/search?theme=맛집' 
  },
  { 
    label: '축제', 
    icon: Ticket, 
    href: '/search?theme=축제' 
  },
] as const;
