'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { toast } from '@/store/toastStore';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 에러를 토스트로 알림
    toast.error(
      '예상치 못한 오류가 발생했습니다',
      '페이지를 새로고침하거나 잠시 후 다시 시도해주세요.'
    );
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ resetError }: { error?: Error; resetError: () => void }) {
  const handleRefresh = () => {
    resetError();
    window.location.reload();
  };

  const handleGoHome = () => {
    resetError();
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center p-4">
      <div className="rounded-full bg-red-100 p-6">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-semibold tracking-tight">
          앗! 문제가 발생했습니다
        </h2>
        <p className="text-muted-foreground">
          예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          페이지 새로고침
        </Button>
        <Button onClick={handleGoHome} variant="outline" className="gap-2">
          <Home className="h-4 w-4" />
          홈으로 이동
        </Button>
      </div>
    </div>
  );
}
