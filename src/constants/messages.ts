// 에러 메시지
export const ERROR_MESSAGES = {
  // 일반적인 에러
  NETWORK_ERROR: '네트워크 연결을 확인하고 다시 시도해주세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  
  // 인증 관련
  LOGIN_REQUIRED: '로그인 후 이용해주세요.',
  AUTH_FAILED: '인증에 실패했습니다.',
  
  // 데이터 로딩 관련
  PLACES_LOAD_FAILED: '여행지 목록을 불러오는데 실패했습니다.',
  SEARCH_LOAD_FAILED: '검색 결과를 불러오는데 실패했습니다.',
  REVIEWS_LOAD_FAILED: '후기를 불러오는데 실패했습니다.',
  
  // 폼 검증 관련
  REQUIRED_FIELD: '필수 입력입니다.',
  REQUIRED_SELECTION: '필수 선택입니다.',
  IMAGE_REQUIRED: '최소 1개의 이미지를 업로드해주세요.',
  SEASON_REQUIRED: '최소 1개의 계절을 선택해주세요.',
  KEYWORD_REQUIRED: '최소 1개의 키워드를 선택해주세요.',
  
  // 업로드 관련
  IMAGE_UPLOAD_FAILED: '이미지 업로드에 실패했습니다.',
  IMAGE_COUNT_EXCEEDED: '최대 5개의 이미지만 업로드할 수 있습니다.',
  
  // 제출 관련
  CONTRIBUTE_FAILED: '여행지 제안 등록 중 오류가 발생했습니다. 다시 시도해주세요.',
  REVIEW_SUBMIT_FAILED: '후기 등록에 실패했습니다. 잠시 후 다시 시도해주세요.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CONTRIBUTE_SUCCESS: '여행지 제안이 성공적으로 등록되었습니다! 🎉',
  REVIEW_SUCCESS: '후기가 등록되었습니다',
  REVIEW_SUCCESS_DESC: '소중한 후기를 남겨주셔서 감사합니다!',
} as const;

// 로딩 메시지
export const LOADING_MESSAGES = {
  LOADING_PLACES: '여행지 목록을 불러오는 중...',
  LOADING_SEARCH: '검색 결과를 불러오는 중...',
  LOADING_REVIEWS: '후기를 불러오는 중...',
  UPLOADING: '업로드 중...',
  SUBMITTING: '등록 중...',
} as const;

// 빈 상태 메시지
export const EMPTY_MESSAGES = {
  NO_PLACES: '등록된 여행지가 없습니다.',
  NO_SEARCH_RESULTS: '검색 결과가 없습니다.',
  NO_REVIEWS: '아직 후기가 없습니다. 첫 번째 후기를 남겨보세요!',
  NO_WISHLIST: '찜한 여행지가 없습니다.',
} as const;

// 액션 메시지
export const ACTION_MESSAGES = {
  RETRY: '다시 시도',
  RESET: '초기화',
  LOGIN: '로그인',
  LOGOUT: '로그아웃',
  SUBMIT: '등록',
  CANCEL: '취소',
  CLOSE: '닫기',
  MORE: '더보기',
} as const;
