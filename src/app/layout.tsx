import Header from '@/components/common/Header';
import { LoginModal } from '@/components/common/LoginModal';
import '@/styles/globals.css';

export const metadata = { title: 'Travelly' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <Header />
        {children}
        <LoginModal />
      </body>
    </html>
  );
}
