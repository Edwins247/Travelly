// src/constants/review.ts

// 리뷰 태그 옵션들
export const REVIEW_TAGS = [
  '힐링', 
  '가족여행', 
  '뷰맛집', 
  '액티비티', 
  '데이트', 
  '혼행',
  '사진맛집', 
  '인스타', 
  '자연', 
  '도시', 
  '전통', 
  '현대',
  '조용함', 
  '활기참', 
  '저렴함', 
  '고급스러움'
] as const;

// 리뷰 관련 설정
export const REVIEW_CONFIG = {
  MIN_CONTENT_LENGTH: 10,
  MAX_CONTENT_LENGTH: 1000,
  MAX_TAGS_COUNT: 5,
  POPULAR_TAGS_LIMIT: 8,
} as const;

// 리뷰 폼 기본값
export const REVIEW_DEFAULTS = {
  content: '',
  tags: [] as string[],
  customTag: '',
};
