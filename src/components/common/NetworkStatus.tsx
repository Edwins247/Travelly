'use client';

import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { WifiOff, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NetworkStatus() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-2">
      <div className="flex items-center justify-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>인터넷 연결이 끊어졌습니다. 연결을 확인해주세요.</span>
      </div>
    </div>
  );
}

interface NetworkAwareProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showOfflineMessage?: boolean;
}

export function NetworkAware({ 
  children, 
  fallback,
  showOfflineMessage = true 
}: NetworkAwareProps) {
  const { isOnline } = useNetworkStatus();

  if (!isOnline) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showOfflineMessage) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="rounded-full bg-red-100 p-6">
            <WifiOff className="h-12 w-12 text-red-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">인터넷 연결 없음</h3>
            <p className="text-muted-foreground max-w-md">
              인터넷 연결을 확인하고 다시 시도해주세요.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

interface NetworkIndicatorProps {
  className?: string;
}

export function NetworkIndicator({ className }: NetworkIndicatorProps) {
  const { isOnline } = useNetworkStatus();

  return (
    <div className={cn("flex items-center gap-1 text-xs", className)}>
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span className="text-green-600">온라인</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-500" />
          <span className="text-red-600">오프라인</span>
        </>
      )}
    </div>
  );
}
