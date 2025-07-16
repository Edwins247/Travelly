// src/components/common/PlaceCardSkeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const PlaceCardSkeleton = React.memo(function PlaceCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-32 sm:h-36 w-full rounded-xl" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
});
