// src/components/home/CategoryGrid.tsx
'use client';

import {
  Landmark,
  Globe,
  Wallet,
  Heart,
  Building,
  Plane,
  Soup,
  Ticket,
} from 'lucide-react';
import { CategoryCard } from './CategoryCard';

// ToDo: 새로운 데이터로 리뉴얼 한 뒤, 필요로한 실제 카테고리로 고정해서 처리하기
const items = [
  { label: '국내', icon: <Landmark className="h-8 w-8" />, href: '/search?region=domestic' },
  { label: '해외', icon: <Globe className="h-8 w-8" />,   href: '/search?region=abroad'   },
  { label: '저예산', icon: <Wallet className="h-8 w-8" />, href: '/search?budget=저예산'  },
  { label: '힐링', icon: <Heart className="h-8 w-8" />,   href: '/search?theme=힐링'     },
  { label: '문화', icon: <Building className="h-8 w-8"/>, href: '/search?theme=문화'     },
  { label: '액티비티', icon: <Plane className="h-8 w-8" />,href: '/search?theme=액티비티' },
  { label: '맛집', icon: <Soup className="h-8 w-8" />,    href: '/search?theme=맛집'     },
  { label: '축제', icon: <Ticket className="h-8 w-8" />,  href: '/search?theme=축제'     },
];

export function CategoryGrid() {
  return (
    <section className="rounded-2xl border p-4 sm:p-6">
      <h2 className="mb-4 text-base font-semibold">카테고리별 탐색</h2>

      <div className="grid grid-cols-2 gap-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-8">
        {items.map(item => (
          <CategoryCard key={item.href} {...item} />
        ))}
      </div>
    </section>
  );
}
