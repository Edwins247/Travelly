// 검색 필터 옵션들
export const SEARCH_REGIONS = [
  { value: 'all', label: '전체' },
  { value: 'domestic', label: '국내' },
  { value: 'abroad', label: '해외' },
] as const;

export const SEARCH_SEASONS = [
  'all', 
  '봄', 
  '여름', 
  '가을', 
  '겨울'
] as const;

export const SEARCH_BUDGETS = [
  'all', 
  '저예산', 
  '중간', 
  '고급'
] as const;

// 검색 관련 상수
export const SEARCH_CONFIG = {
  MIN_KEYWORD_LENGTH: 1,
  MAX_KEYWORD_LENGTH: 50,
  SUGGESTION_LIMIT: 5,
  DEFAULT_REGION: 'all',
  DEFAULT_SEASON: 'all',
  DEFAULT_BUDGET: 'all',
} as const;

// URL 파라미터 키
export const SEARCH_PARAMS = {
  KEYWORD: 'keyword',
  REGION: 'region',
  SEASON: 'season',
  BUDGET: 'budget',
  PAGE: 'page',
} as const;
