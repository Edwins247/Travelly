// src/app/(protected)/layout.tsx
import { ReactNode } from 'react';
import { AuthGuard } from '@/components/common/AuthGuard';

export const dynamic = 'force-dynamic';  // SSG 캐시 무효 (옵션)

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
