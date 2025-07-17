import { analytics } from '@/services/firebase';
import { logEvent } from 'firebase/analytics';

/**
 * Firebase Analytics 이벤트 추적 유틸리티
 * Travelly 프로젝트의 핵심 비즈니스 메트릭을 추적합니다.
 */

// Analytics 사용 가능 여부 확인
const isAnalyticsEnabled = async (): Promise<boolean> => {
  if (!analytics) return false;
  try {
    const analyticsInstance = await analytics;
    return analyticsInstance !== null;
  } catch {
    return false;
  }
};

// 안전한 이벤트 로깅 함수
const safeLogEvent = async (eventName: string, parameters?: Record<string, string | number | boolean>) => {
  try {
    if (await isAnalyticsEnabled()) {
      const analyticsInstance = await analytics;
      if (analyticsInstance) {
        logEvent(analyticsInstance, eventName, parameters);
        
        // 개발 환경에서 로깅
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 Analytics Event: ${eventName}`, parameters);
        }
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.warn('Analytics event failed:', eventName, error);
  }
};

// 1. 여행지 관련 이벤트
export const placeAnalytics = {
  // 여행지 조회
  viewPlace: (placeId: string, placeName: string, region: string, regionType: string) => {
    safeLogEvent('place_view', {
      place_id: placeId,
      place_name: placeName,
      region: region,
      region_type: regionType,
      content_type: 'place',
      item_id: placeId,
    });
  },

  // 여행지 좋아요
  likePlace: (placeId: string, placeName: string, region: string) => {
    safeLogEvent('place_like', {
      place_id: placeId,
      place_name: placeName,
      region: region,
      action: 'like',
    });
  },

  // 여행지 좋아요 취소
  unlikePlace: (placeId: string, placeName: string, region: string) => {
    safeLogEvent('place_unlike', {
      place_id: placeId,
      place_name: placeName,
      region: region,
      action: 'unlike',
    });
  },

  // 여행지 제안 시작
  startContribution: () => {
    safeLogEvent('place_contribution_start', {
      content_type: 'contribution',
    });
  },

  // 여행지 제안 완료
  completeContribution: (placeId: string, region: string, regionType: string, keywordCount: number) => {
    safeLogEvent('place_contribution_complete', {
      place_id: placeId,
      region: region,
      region_type: regionType,
      keyword_count: keywordCount,
      content_type: 'contribution',
    });
  },
};

// 2. 검색 및 발견 패턴
export const searchAnalytics = {
  // 검색 쿼리 실행
  searchQuery: (keyword: string, resultCount: number, filters?: Record<string, string | undefined>) => {
    safeLogEvent('search', {
      search_term: keyword,
      result_count: resultCount,
      ...filters,
    });
  },

  // 검색 결과 클릭
  searchResultClick: (keyword: string, placeId: string, placeName: string, position: number) => {
    safeLogEvent('select_content', {
      content_type: 'place',
      item_id: placeId,
      item_name: placeName,
      search_term: keyword,
      position: position,
    });
  },

  // 필터 사용
  useFilter: (filterType: string, filterValue: string, resultCount: number) => {
    safeLogEvent('filter_usage', {
      filter_type: filterType,
      filter_value: filterValue,
      result_count: resultCount,
    });
  },

  // 검색 제안 클릭
  searchSuggestionClick: (suggestion: string, originalQuery: string) => {
    safeLogEvent('search_suggestion_click', {
      suggestion: suggestion,
      original_query: originalQuery,
    });
  },
};

// 3. 사용자 참여도
export const engagementAnalytics = {
  // 리뷰 작성 시작
  startReview: (placeId: string) => {
    safeLogEvent('review_start', {
      place_id: placeId,
      content_type: 'review',
    });
  },

  // 리뷰 작성 완료
  completeReview: (placeId: string, placeName: string, tagCount: number, contentLength: number) => {
    safeLogEvent('review_complete', {
      place_id: placeId,
      place_name: placeName,
      tag_count: tagCount,
      content_length: contentLength,
      content_type: 'review',
    });
  },

  // 이미지 갤러리 상호작용
  imageGalleryInteraction: (placeId: string, action: 'view' | 'fullscreen' | 'navigate') => {
    safeLogEvent('image_interaction', {
      place_id: placeId,
      interaction_type: action,
      content_type: 'image',
    });
  },

  // 키워드 탐색 클릭
  keywordExploration: (keyword: string, placeId: string, placeName: string) => {
    safeLogEvent('keyword_exploration', {
      keyword: keyword,
      source_place_id: placeId,
      source_place_name: placeName,
      content_type: 'keyword',
    });
  },
};

// 4. 사용자 여정 및 페이지 분석
export const journeyAnalytics = {
  // 페이지 진입 (referrer 정보 포함)
  enterPage: (pageName: string, referrer?: string, additionalParams?: Record<string, string | number | boolean>) => {
    safeLogEvent('page_enter', {
      page_name: pageName,
      page_location: window.location.href,
      referrer: referrer || document.referrer || 'direct',
      timestamp: Date.now(),
      ...additionalParams,
    });
  },

  // 페이지 이탈 (체류 시간 포함)
  exitPage: (pageName: string, timeSpent: number, scrollDepth?: number) => {
    safeLogEvent('page_exit', {
      page_name: pageName,
      time_spent: timeSpent,
      scroll_depth: scrollDepth || 0,
      timestamp: Date.now(),
    });
  },

  // 사용자 플로우 추적 (A → B 이동)
  userFlow: (fromPage: string, toPage: string, trigger: string, context?: Record<string, string | number | boolean>) => {
    safeLogEvent('user_flow', {
      from_page: fromPage,
      to_page: toPage,
      trigger: trigger, // 'search', 'click', 'navigation', 'recommendation' 등
      session_id: getSessionId(),
      ...context,
    });
  },

  // 핵심 전환 퍼널 추적
  conversionFunnel: (step: string, action: 'start' | 'complete' | 'abandon', metadata?: Record<string, string | number | boolean>) => {
    safeLogEvent('conversion_funnel', {
      funnel_step: step,
      action: action,
      session_id: getSessionId(),
      timestamp: Date.now(),
      ...metadata,
    });
  },

  // 사용자 참여도 측정
  engagement: (type: 'scroll' | 'click' | 'hover' | 'focus', target: string, value?: number) => {
    safeLogEvent('user_engagement', {
      engagement_type: type,
      target_element: target,
      ...(value !== undefined && { value }),
      page_name: getCurrentPageName(),
      timestamp: Date.now(),
    });
  },
};

// 세션 ID 생성/관리
let sessionId: string | null = null;
const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  return sessionId;
};

// 현재 페이지 이름 추출
const getCurrentPageName = (): string => {
  const path = window.location.pathname;
  if (path === '/') return 'home';
  if (path.startsWith('/places/')) return 'place-detail';
  if (path === '/search') return 'search';
  if (path === '/contribute') return 'contribute';
  return path.replace('/', '').replace(/\//g, '-');
};

// 5. 개발 환경에서 Analytics 상태 확인
export const analyticsStatus = {
  checkStatus: async () => {
    if (process.env.NODE_ENV === 'development') {
      const enabled = await isAnalyticsEnabled();
      console.group('📊 Firebase Analytics Status');
      console.log('✅ Enabled:', enabled);
      console.log('🎯 Tracking Events:');
      console.log('  • Place views, likes, contributions');
      console.log('  • Search queries and results');
      console.log('  • User engagement (reviews, interactions)');
      console.log('  • Page navigation and user journey');
      console.log('🌐 View data at: https://console.firebase.google.com/project/YOUR_PROJECT/analytics');
      console.groupEnd();
    }
  },
};

// 페이지 로드 시 상태 확인 (개발 환경)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(analyticsStatus.checkStatus, 2000);
  });
}
