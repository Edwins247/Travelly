// src/components/common/PlaceCardSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

export function PlaceCardSkeleton() {
  return (
    <div className="w-56">
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
