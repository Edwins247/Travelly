import { perf } from '@/services/firebase';
import { trace } from 'firebase/performance';

/**
 * Firebase Performance 유틸리티 함수들
 * 자동 추적은 이미 활성화되어 있고, 필요시 커스텀 추적을 위한 헬퍼 함수들
 */

// Performance 사용 가능 여부 확인
export const isPerformanceEnabled = (): boolean => {
  return perf !== null && typeof window !== 'undefined';
};

// 커스텀 추적 시작
export const startTrace = (traceName: string) => {
  if (!isPerformanceEnabled() || !perf) {
    console.warn('Firebase Performance not available');
    return null;
  }
  
  try {
    const customTrace = trace(perf, traceName);
    customTrace.start();
    return customTrace;
  } catch (error) {
    console.error('Failed to start trace:', error);
    return null;
  }
};

// 추적 종료
export const stopTrace = (traceInstance: any) => {
  if (traceInstance) {
    try {
      traceInstance.stop();
    } catch (error) {
      console.error('Failed to stop trace:', error);
    }
  }
};

// 개발 환경에서 Performance 상태 로깅
export const logPerformanceStatus = () => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔥 Firebase Performance Status');
    console.log('✅ Enabled:', isPerformanceEnabled());
    console.log('📊 Automatic tracking active for:');
    console.log('  • All Firebase network requests (Firestore, Storage, Auth)');
    console.log('  • Page load performance');
    console.log('  • HTTP/HTTPS requests');
    console.log('🌐 View data at: https://console.firebase.google.com/project/YOUR_PROJECT/performance');
    console.groupEnd();
  }
};

// 자주 사용할 추적 함수들
export const performanceTracking = {
  // Firestore 쿼리 추적
  trackFirestoreQuery: (queryName: string) => {
    return startTrace(`firestore_${queryName}`);
  },
  
  // 이미지 업로드 추적
  trackImageUpload: () => {
    return startTrace('image_upload');
  },
  
  // 페이지 로딩 추적
  trackPageLoad: (pageName: string) => {
    return startTrace(`page_load_${pageName}`);
  },
  
  // 검색 성능 추적
  trackSearch: (searchType: string) => {
    return startTrace(`search_${searchType}`);
  },
};

// 개발 환경에서 자동 초기화
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // 페이지 로드 후 상태 로깅
  window.addEventListener('load', () => {
    setTimeout(logPerformanceStatus, 1000);
  });
}
