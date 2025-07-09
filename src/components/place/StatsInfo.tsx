// src/components/place/StatsInfo.tsx
'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, MessageSquare } from 'lucide-react';

interface StatsInfoProps {
  likes: number;
  reviewCount: number;
}

export default function StatsInfo({ likes, reviewCount }: StatsInfoProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Statistics</h2>
      <Card>
        <CardContent className="flex items-center justify-start gap-6">
          <div className="flex items-center gap-1">
            <Heart className="text-destructive" />
            <span className="font-medium">{likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="text-secondary" />
            <span className="font-medium">{reviewCount}</span>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
