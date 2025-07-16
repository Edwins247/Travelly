'use client';

import { QueryClient, QueryClientProvider, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

/**
 * React Query 프로바이더 컴포넌트
 * 
 * 클라이언트 컴포넌트에서 React Query를 사용할 수 있도록 설정합니다.
 * 각 요청마다 새로운 QueryClient 인스턴스를 생성하여 클라이언트 간 데이터 격리를 보장합니다.
 */
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 기본 staleTime 설정 (5분)
            staleTime: 5 * 60 * 1000,
            
            // 기본 cacheTime 설정 (10분)
            gcTime: 10 * 60 * 1000,
            
            // 에러 발생 시 3번까지 재시도
            retry: 3,
            
            // 네트워크 재연결 시 자동으로 refetch
            refetchOnReconnect: true,
            
            // 윈도우 포커스 시 자동으로 refetch (사용자가 탭을 다시 열었을 때)
            refetchOnWindowFocus: true,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * 서버 사이드에서 사용할 QueryClient 생성 함수
 *
 * 서버 컴포넌트에서 데이터를 프리페치할 때 사용합니다.
 */
export function createServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 서버에서는 staleTime을 0으로 설정하여 항상 fresh한 데이터 사용
        staleTime: 0,

        // 서버에서는 캐시를 사용하지 않음
        gcTime: 0,

        // 서버에서는 재시도하지 않음
        retry: false,

        // 서버에서는 refetch 비활성화
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

/**
 * SSR/SSG를 위한 Hydration 컴포넌트
 *
 * 서버에서 프리페치된 데이터를 클라이언트로 전달할 때 사용합니다.
 */
export function ReactQueryHydration({
  children,
  state
}: {
  children: ReactNode;
  state?: unknown;
}) {
  if (state) {
    return (
      <HydrationBoundary state={state}>
        {children}
      </HydrationBoundary>
    );
  }

  return <>{children}</>;
}
