// src/constants/contribute.ts

export const domesticRegions = [
  { value: '서울', label: '서울', districts: ['중구', '강남구', '마포구', '종로구', '용산구'] },
  { value: '부산', label: '부산', districts: ['해운대구', '중구', '서구', '동래구'] },
  { value: '제주', label: '제주', districts: ['제주시', '서귀포시'] },
  { value: '경기', label: '경기', districts: ['수원시', '성남시', '고양시', '용인시'] },
  { value: '강원', label: '강원', districts: ['춘천시', '강릉시', '속초시', '원주시'] },
  { value: '경북', label: '경북', districts: ['경주시', '안동시', '포항시'] },
  { value: '경남', label: '경남', districts: ['통영시', '거제시', '진주시'] },
  { value: '전북', label: '전북', districts: ['전주시', '군산시'] },
  { value: '전남', label: '전남', districts: ['여수시', '순천시', '목포시'] },
  { value: '충북', label: '충북', districts: ['청주시', '충주시'] },
  { value: '충남', label: '충남', districts: ['천안시', '아산시', '공주시'] }
];

export const overseasRegions = [
  { value: '일본', label: '일본', districts: ['도쿄', '오사카', '교토', '후쿠오카'] },
  { value: '중국', label: '중국', districts: ['베이징', '상하이', '시안', '청두'] },
  { value: '동남아', label: '동남아', districts: ['태국', '베트남', '싱가포르', '말레이시아'] },
  { value: '유럽', label: '유럽', districts: ['프랑스', '이탈리아', '스페인', '독일'] },
  { value: '미주', label: '미주', districts: ['미국', '캐나다', '멕시코'] },
  { value: '기타', label: '기타', districts: ['호주', '뉴질랜드', '인도', '기타'] }
];

export const seasons = ['봄', '여름', '가을', '겨울'];

export const budgets = ['저예산', '중간', '고급'];

export const keywordCategories = {
  location: ['자연', '도시', '바다', '산', '강', '호수', '섬', '온천'],
  activity: ['등산', '트레킹', '수영', '서핑', '스키', '쇼핑', '카페투어', '맛집투어'],
  mood: ['힐링', '로맨틱', '데이트', '가족여행', '혼행', '친구여행', '액티비티', '휴식'],
  style: ['사진맛집', '인스타', '뷰맛집', '전통', '현대', '조용함', '활기참', '이색체험']
};
