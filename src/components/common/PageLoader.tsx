'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface PageLoaderProps {
  showHeader?: boolean;
  showFooter?: boolean;
  showContent?: boolean;
}

export function PageLoader({ 
  showHeader = true, 
  showFooter = true, 
  showContent = true 
}: PageLoaderProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      {showHeader && (
        <div className="flex h-16 items-center justify-between border-b px-6 bg-background/80">
          <Skeleton className="h-6 w-20" />
          <div className="hidden md:flex space-x-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      )}

      {/* Main Content Skeleton */}
      {showContent && (
        <main className="flex-1">
          <div className="flex flex-col items-center gap-6 py-16">
            <div className="w-full max-w-6xl space-y-6 px-4">
              {/* Search Bar Skeleton */}
              <div className="relative w-full">
                <Skeleton className="h-9 w-full rounded-md" />
              </div>

              {/* Keyword Chips Skeleton */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-20 rounded-full" />
                ))}
              </div>

              {/* Category Grid Skeleton */}
              <div className="rounded-2xl border p-6">
                <Skeleton className="h-5 w-32 mb-4" />
                <div className="grid grid-cols-4 gap-4 sm:grid-cols-6 lg:grid-cols-8">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex h-28 w-24 flex-col items-center justify-center gap-2 rounded-lg border">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Place Grid Skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-56">
                      <Skeleton className="h-36 w-full rounded-xl" />
                      <div className="space-y-2 p-3">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer Skeleton */}
      {showFooter && (
        <div className="border-t bg-muted/40 py-6">
          <div className="container mx-auto flex flex-col gap-6 px-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 전체 페이지 로딩 오버레이
export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <PageLoader />
    </div>
  );
}

// 간단한 로딩 스피너
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary border-t-transparent`} />
    </div>
  );
}
