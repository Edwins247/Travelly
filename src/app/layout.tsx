import AuthProvider from '@/components/common/AuthProvider';
import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import { LoginModal } from '@/components/common/LoginModal';
import { ToastContainer } from '@/components/common/ToastContainer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { NetworkStatus } from '@/components/common/NetworkStatus';
import '@/styles/globals.css';

export const metadata = { title: 'Travelly' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <ErrorBoundary>
          <AuthProvider>
            <NetworkStatus />
            <Header />
            <main className='flex-1'>{children}</main>
            <Footer />
            <LoginModal />
            <ToastContainer />
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
