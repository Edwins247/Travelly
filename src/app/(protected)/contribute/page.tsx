import { ContributeForm } from '@/components/contribute/ContributeForm';

export const metadata = { title: 'Travelly | 여행지 제안' };

export default function ContributePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <ContributeForm />
    </main>
  );
}
