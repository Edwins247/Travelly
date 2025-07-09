// src/components/place/KeywordBadgeList.tsx
'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface KeywordBadgeListProps {
  keywords: string[];
}

export default function KeywordBadgeList({ keywords }: KeywordBadgeListProps) {
  if (keywords.length === 0) return null;

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Top Keywords</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw) => (
          <Badge key={kw} variant="outline">
            {kw}
          </Badge>
        ))}
      </div>
    </section>
  );
}
