import { ReactNode } from 'react';
import { AuthGuard } from '@/components/common/AuthGuard';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
