import { ComingSoon } from '@/components/common/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '자주 묻는 질문 | Travelly',
  description: '자주 묻는 질문 페이지입니다.',
};

export default function FAQPage() {
  return (
    <main className="container mx-auto py-10">
      <ComingSoon 
        title="FAQ 준비중"
        description="자주 묻는 질문 페이지는 현재 준비 중입니다. 빠른 시일 내에 서비스를 제공하겠습니다."
      />
    </main>
  );
}
