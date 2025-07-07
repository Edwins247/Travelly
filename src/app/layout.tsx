import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { LoginModal } from '@/components/common/LoginModal';
import '@/styles/globals.css';

export const metadata = { title: 'Travelly' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className='flex-1'>{children}</main>
        <Footer />
        <LoginModal />
      </body>
    </html>
  );
}
