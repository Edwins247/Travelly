import { ContributeForm } from '@/components/contribute/ContributeForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '여행지 제안 | Travelly',
  description: '새로운 여행지를 제안하고 공유하세요.',
};

export default function ContributePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-10">
      <ContributeForm />
    </main>
  );
}
