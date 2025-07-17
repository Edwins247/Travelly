'use client';

import { CategoryCard } from './CategoryCard';
import { CATEGORY_ITEMS } from '@/constants/home';
import { UI } from '@/constants/common';

export function CategoryGrid() {
  return (
    <section className="rounded-2xl border p-4 sm:p-6">
      <h2 className="mb-4 text-base font-semibold">카테고리별 탐색</h2>

      <div className="grid grid-cols-2 gap-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-8">
        {CATEGORY_ITEMS.map(item => (
          <CategoryCard
            key={item.href}
            label={item.label}
            icon={<item.icon className={UI.ICON_SIZE_LG} />}
            href={item.href}
          />
        ))}
      </div>
    </section>
  );
}
