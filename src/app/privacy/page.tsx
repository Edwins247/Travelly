import { ComingSoon } from '@/components/common/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침 | Travelly',
  description: '개인정보처리방침 페이지입니다.',
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto py-10">
      <ComingSoon 
        title="개인정보처리방침 준비중"
        description="Travelly 개인정보처리방침 페이지는 현재 준비 중입니다. 빠른 시일 내에 서비스를 제공하겠습니다."
      />
    </main>
  );
}
