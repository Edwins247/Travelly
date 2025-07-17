// 페이지네이션 관련 상수
export const PAGINATION = {
  PER_PAGE: 12,
  MAX_VISIBLE_PAGES: 5,
} as const;

// 시간 관련 상수 (밀리초)
export const TIME = {
  STALE_TIME_SHORT: 2 * 60 * 1000,    // 2분
  STALE_TIME_MEDIUM: 5 * 60 * 1000,   // 5분
  STALE_TIME_LONG: 10 * 60 * 1000,    // 10분
  GC_TIME: 10 * 60 * 1000,            // 10분
  TOAST_DURATION: 5000,                // 5초
  RETRY_DELAY_MAX: 30000,              // 30초
  RELOAD_DELAY: 1000,                  // 1초
} as const;

// 재시도 관련 상수
export const RETRY = {
  MAX_ATTEMPTS: 3,
  MAX_ATTEMPTS_SEARCH: 2,
  EXPONENTIAL_BASE: 2,
} as const;

// 이미지 관련 상수
export const IMAGES = {
  PLACEHOLDER: '/img/placeholder.png',
  MAX_UPLOAD_COUNT: 5,
} as const;

// UI 관련 상수
export const UI = {
  ICON_SIZE_SM: 'h-4 w-4',
  ICON_SIZE_MD: 'h-5 w-5',
  ICON_SIZE_LG: 'h-8 w-8',
  ICON_SIZE_XL: 'h-12 w-12',
  POPULAR_TAGS_LIMIT: 8,
} as const;

// 텍스트 길이 제한
export const TEXT_LIMITS = {
  REVIEW_MIN_LENGTH: 10,
  REVIEW_MAX_LENGTH: 1000,
  KEYWORD_MAX_LENGTH: 20,
} as const;
