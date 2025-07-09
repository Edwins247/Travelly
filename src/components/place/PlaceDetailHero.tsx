// src/components/place/PlaceDetailHero.tsx
'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import React from 'react';

interface PlaceDetailHeroProps {
  name: string;
  imageUrls: string[];
  regionType: '국내' | '해외';
  location: { region: string; district?: string };
  seasonTags: string[];
  budgetLevel: '저예산' | '중간' | '고급';
}

export default function PlaceDetailHero({
  name,
  imageUrls,
  regionType,
  location,
  seasonTags,
  budgetLevel,
}: PlaceDetailHeroProps) {
  const bgImage = imageUrls[0] || '/placeholder.jpg';

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden">
      {/* 배경 이미지 */}
      <Image
        src={bgImage}
        alt={name}
        fill
        className="object-cover brightness-90"
        unoptimized
      />
      {/* 오버레이 텍스트 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4">
        <h1 className="text-3xl font-bold text-white drop-shadow">{name}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="secondary">{regionType}</Badge>
          <Badge variant="secondary">{location.region}</Badge>
          {location.district && <Badge variant="secondary">{location.district}</Badge>}
          {seasonTags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
          <Badge variant="destructive">{budgetLevel}</Badge>
        </div>
      </div>
    </div>
  );
}
