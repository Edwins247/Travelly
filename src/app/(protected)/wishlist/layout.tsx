import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '찜 목록 | Travelly',
  description: '내가 찜한 여행지 목록을 확인하세요.',
};

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
