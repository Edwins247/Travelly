# Travelly
키워드 기반 여행지 검색 및 추천 플랫폼 `v0.1.0`

여행자들이 키워드로 맞춤 여행지를 찾고, 여행 정보를 공유할 수 있는 웹 애플리케이션입니다.

## Installation

### Prerequisites
- Node.js 18.18.0 이상
- npm

### Local 실행 방법

1. **Repository Clone**
```bash
git clone <repository-url>
cd travelly
```

2. **Dependencies 설치**
```bash
npm install
```

3. **환경 변수 설정**
`.env.local` 파일을 생성하고 Firebase 설정을 추가하세요:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **개발 서버 실행**
```bash
npm run dev
```

5. **브라우저에서 확인**
[http://localhost:3000](http://localhost:3000)에서 애플리케이션을 확인할 수 있습니다.

### 참고사항
- Firebase 프로젝트 설정이 필요합니다
- Firestore 및 Storage 권한 설정 확인
- 복합 인덱스 생성이 필요할 수 있습니다 (검색 기능 사용 시)

## Project Documentation

### Built With

| Package Name | Version | Description |
|-------------|---------|-------------|
| Next.js | 15.3.4 | React 프레임워크 |
| React | ^19.0.0 | UI 라이브러리 |
| TypeScript | ^5 | 타입 안정성 |
| Firebase | ^11.10.0 | 백엔드 서비스 (Auth, Firestore, Storage, Analytics, Performance) |
| Tailwind CSS | ^3.4.4 | CSS 프레임워크 |
| shadcn/ui | - | UI 컴포넌트 라이브러리 |
| React Query | ^5.81.5 | 서버 상태 관리 |
| Zustand | ^5.0.6 | 클라이언트 상태 관리 |
| React Hook Form | ^7.59.0 | 폼 관리 |
| Lucide React | ^0.525.0 | 아이콘 라이브러리 |
| date-fns | ^4.1.0 | 날짜 처리 |
| class-variance-authority | ^0.7.1 | CSS 클래스 관리 |

*자세한 개발 스택은 `package.json` 참고*

### Pages Structure

#### Public Pages
1. `src/app/(public)/page.tsx`: 홈페이지 - 여행지 검색 및 추천
2. `src/app/(public)/search/page.tsx`: 검색 결과 페이지
3. `src/app/places/[id]/page.tsx`: 여행지 상세 페이지
4. `src/app/privacy/page.tsx`: 개인정보처리방침
5. `src/app/terms/page.tsx`: 이용약관
6. `src/app/faq/page.tsx`: 자주 묻는 질문

#### Protected Pages (로그인 필요)
1. `src/app/(protected)/contribute/page.tsx`: 여행지 제안 페이지
2. `src/app/(protected)/wishlist/page.tsx`: 찜 목록 페이지

#### Error Pages
1. `src/app/error.tsx`: 전역 에러 페이지
2. `src/app/not-found.tsx`: 404 페이지

### Key Features & Implementation

#### 🔍 **검색 및 필터링 시스템 (실제 구현)**
```typescript
// src/components/home/SearchBar.tsx - 실제 검색바 구현
export function SearchBar() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const debouncedInput = useDebounce(input, 300);
  const [showList, setShowList] = useState(false);

  // React Query로 키워드 제안 가져오기
  const {
    data: suggestions = [],
    isLoading: isLoadingSuggestions
  } = useKeywordSuggestions(debouncedInput.trim(), 5);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const term = input.trim();
    if (!term) return;

    // 검색 실행 성능 추적
    performanceTracking.trackSearch('execution');

    // Analytics: 검색 쿼리 실행
    searchAnalytics.searchQuery(term, 0);

    router.push(`/search?keyword=${encodeURIComponent(term)}`);
    setShowList(false);
  }, [input, router]);

  return (
    <div className="relative w-full">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          value={input}
          placeholder="어디로 떠나고 싶으신가요?"
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-12 text-base"
        />
        <Button type="submit" className="h-12 px-4 sm:px-6">
          <SearchIcon size={20} />
        </Button>
      </form>
      {/* 검색 제안 목록 */}
    </div>
  );
}

// src/app/(public)/search/page.tsx - 실제 검색 페이지
function SearchContent() {
  const params = useSearchParams();
  const rawKeyword = params.get('keyword') ?? '';
  const rawRegion = (params.get('region') as 'domestic' | 'abroad') ?? '';
  const rawSeason = params.get('season') ?? '';
  const rawBudget = params.get('budget') ?? '';

  const searchOptions = useMemo<GetPlacesOptions>(() => ({
    keyword: rawKeyword,
    region: rawRegion || undefined,
    season: rawSeason || undefined,
    budget: rawBudget || undefined,
  }), [rawKeyword, rawRegion, rawSeason, rawBudget]);

  const {
    data: places = [],
    isLoading: loading,
    error: queryError,
    refetch: retryFetch
  } = usePlaces(searchOptions);

  return (
    <>
      <h1 className="text-xl font-semibold">
        "{rawKeyword}" 검색 결과 ({places.length})
      </h1>
      <FilterBar />
      <PlaceGrid
        places={places}
        isLoading={loading}
        error={error}
        onRetry={retryFetch}
        searchKeyword={rawKeyword}
      />
    </>
  );
}
```

#### 🔥 **Firebase 통합 (실제 구현)**
```typescript
// src/services/firebase.ts - 실제 Firebase 초기화
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

// Analytics와 Performance는 브라우저에서만 초기화
export const analytics = typeof window !== 'undefined' && isSupported()
  ? getAnalytics(firebaseApp)
  : null;

export const perf = typeof window !== 'undefined'
  ? getPerformance(firebaseApp)
  : null;

// src/services/places.ts - 실제 Firestore 쿼리 구현
export async function getPlaces(options: GetPlacesOptions = {}): Promise<PlaceCardData[]> {
  const col = collection(db, 'places');
  let q: Query<Place> = col;

  // 키워드 필터링
  if (options.keyword) {
    q = query(q, where('keywords', 'array-contains', options.keyword));
  }

  // 지역 필터링
  if (options.region === 'domestic') {
    q = query(q, where('regionType', '==', '국내'));
  } else if (options.region === 'abroad') {
    q = query(q, where('regionType', '==', '해외'));
  }

  // 계절 필터링
  if (options.season) {
    q = query(q, where('seasonTags', 'array-contains', options.season));
  }

  // 예산 필터링
  if (options.budget) {
    q = query(q, where('budgetLevel', '==', options.budget));
  }

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

#### 🔐 **Firebase Auth 인증 시스템 (실제 구현)**
```typescript
// src/services/auth.ts - 실제 인증 서비스
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { ensureUserDocument } from './users';

// Google OAuth 로그인
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');

  const { user } = await signInWithPopup(auth, provider);

  // Firestore에 사용자 문서 생성/업데이트
  await ensureUserDocument({
    uid: user.uid,
    displayName: user.displayName || 'Google 사용자',
    email: user.email || '',
    provider: 'google',
  });

  return user;
}

// 이메일 회원가입/로그인 통합 함수
export async function signInOrSignUpEmail(email: string, password: string) {
  try {
    // 먼저 회원가입 시도
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // 프로필 업데이트 (displayName 설정)
    await updateProfile(user, {
      displayName: email.split('@')[0], // 이메일 앞부분을 displayName으로
    });

    // Firestore에 사용자 문서 생성
    await ensureUserDocument({
      uid: user.uid,
      displayName: user.displayName || email.split('@')[0],
      email: user.email || email,
      provider: 'password',
    });

    return user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // 이미 존재하는 이메일이면 로그인 시도
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    }
    throw error;
  }
}

// 로그아웃
export async function signOut() {
  await firebaseSignOut(auth);
}
```

#### 🏷️ **태그 및 키워드 시스템 (실제 구현)**
```typescript
// src/hooks/useKeywordManagement.ts - 실제 구현
interface UseKeywordManagementProps {
  setValue: UseFormSetValue<PlaceFormValues>;
  watch: UseFormWatch<PlaceFormValues>;
}

export function useKeywordManagement({ setValue, watch }: UseKeywordManagementProps) {
  const selectedKeywords = watch('keywords');
  const customKeyword = watch('customKeyword');

  const toggleKeyword = (keyword: string) => {
    const newKeywords = selectedKeywords.includes(keyword)
      ? selectedKeywords.filter(k => k !== keyword)
      : [...selectedKeywords, keyword];
    setValue('keywords', newKeywords);
  };

  const addCustomKeyword = () => {
    if (customKeyword.trim() && !selectedKeywords.includes(customKeyword.trim())) {
      setValue('keywords', [...selectedKeywords, customKeyword.trim()]);
      setValue('customKeyword', '');
    }
  };

  return { selectedKeywords, customKeyword, toggleKeyword, addCustomKeyword };
}

// src/constants/home.ts - 실제 키워드 상수
export const HOT_KEYWORDS = [
  '혼자 힐링',
  '겨울 실내',
  '가족 여행',
  '사진맛집',
  '반려동물',
  '역사 탐방',
] as const;

// 카테고리 그리드 아이템들
export const CATEGORY_ITEMS = [
  { label: '국내', icon: Landmark, href: '/search?region=domestic' },
  { label: '해외', icon: Globe, href: '/search?region=abroad' },
  { label: '저예산', icon: Wallet, href: '/search?budget=저예산' },
  { label: '힐링', icon: Heart, href: '/search?theme=힐링' },
  // ... 더 많은 카테고리
] as const;
```

#### 📱 **반응형 UI 컴포넌트 (실제 구현)**
```typescript
// src/components/common/PlaceCard.tsx - 실제 여행지 카드 컴포넌트
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LikeButton } from './LikeButton';
import { useImageError } from '@/hooks/useImageError';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlaceCardProps {
  place: PlaceCardData;
  position?: number;
  searchKeyword?: string;
}

export const PlaceCard = ({ place, position = 0, searchKeyword }: PlaceCardProps) => {
  const { name, thumbnail, location, regionType, keywords, stats } = place;
  const { hasError, isLoading, handleError, handleLoad, getSrc } =
    useImageError('/img/placeholder.png');

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-200",
      "hover:shadow-lg hover:-translate-y-1",
      "w-full", // 모바일에서 전체 너비
      "sm:max-w-none", // 태블릿 이상에서는 그리드 적용
    )}>
      <Link href={`/places/${place.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {hasError ? (
            <div className="flex h-full items-center justify-center bg-muted">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            <>
              <Image
                src={getSrc(thumbnail || '/img/placeholder.png')}
                alt={name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                onError={handleError}
                onLoad={handleLoad}
                priority={position === 0} // 첫 번째 카드만 우선 로딩
                unoptimized // Firebase Storage 이미지는 unoptimized 사용
              />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              )}
            </>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate">{name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {location.region} • {regionType}
              </p>

              {/* 키워드 태그 */}
              <div className="flex flex-wrap gap-1 mt-2">
                {keywords.slice(0, 3).map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span>❤️ {stats.likes}</span>
            <span>💬 {stats.reviewCount}</span>
          </div>
        </CardContent>
      </Link>

      {/* 찜 버튼 */}
      <LikeButton
        placeId={place.id}
        className="absolute top-2 right-2 z-10"
      />
    </Card>
  );
};
```

### Architecture & Implementation Details

#### 📁 **Detailed Directory Structure**
```
src/
├── app/                           # Next.js 15 App Router
│   ├── (public)/                 # 공개 페이지 그룹
│   │   ├── page.tsx              # 홈페이지 (SSG)
│   │   └── search/               # 검색 페이지
│   ├── (protected)/              # 인증 필요 페이지 그룹
│   │   ├── layout.tsx            # AuthGuard 래퍼
│   │   ├── contribute/           # 여행지 제안
│   │   └── wishlist/             # 찜 목록
│   ├── places/[id]/              # 동적 라우팅 (SSG)
│   ├── globals.css               # Tailwind CSS
│   ├── layout.tsx                # 루트 레이아웃
│   ├── error.tsx                 # 전역 에러 바운더리
│   └── not-found.tsx             # 404 페이지
├── components/
│   ├── ui/                       # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── common/                   # 공통 컴포넌트
│   │   ├── Header.tsx            # 네비게이션
│   │   ├── Footer.tsx
│   │   ├── PlaceGrid.tsx         # 여행지 그리드
│   │   ├── ErrorBoundary.tsx     # 에러 처리
│   │   ├── AuthGuard.tsx         # 인증 가드
│   │   ├── AuthProvider.tsx      # Firebase Auth 컨텍스트
│   │   └── NetworkStatus.tsx     # 네트워크 상태
│   ├── home/                     # 홈페이지 전용
│   │   ├── SearchBar.tsx         # 검색바 + 자동완성
│   │   ├── KeywordChips.tsx      # 인기 키워드
│   │   └── CategoryGrid.tsx      # 카테고리 그리드
│   ├── place/                    # 여행지 관련
│   │   ├── ImageGallery.tsx      # 이미지 갤러리
│   │   ├── PlaceOverview.tsx     # 여행지 개요
│   │   ├── KeywordExplorer.tsx   # 키워드 탐색
│   │   ├── ReviewList.tsx        # 리뷰 목록
│   │   └── ReviewForm.tsx        # 리뷰 작성
│   ├── contribute/               # 여행지 제안
│   │   ├── ContributeForm.tsx    # 메인 폼 (600+ 라인)
│   │   ├── BasicInfoSection.tsx  # 기본 정보
│   │   ├── ImageUploadSection.tsx # 이미지 업로드
│   │   └── KeywordSection.tsx    # 키워드 선택
│   └── search/                   # 검색 관련
│       ├── FilterBar.tsx         # 필터 바
│       └── SearchResults.tsx     # 검색 결과
├── services/                     # Firebase 서비스 레이어
│   ├── firebase.ts               # Firebase 초기화
│   ├── auth.ts                   # 인증 서비스
│   ├── places.ts                 # 여행지 CRUD
│   ├── reviews.ts                # 리뷰 CRUD
│   └── users.ts                  # 사용자 관리
├── hooks/                        # Custom React Hooks (실제 구현됨)
│   ├── usePlaces.ts              # React Query 여행지 훅
│   ├── useWishlist.ts            # 찜 목록 관리
│   ├── useImageUpload.ts         # 이미지 업로드
│   ├── useImageError.ts          # 이미지 에러 처리
│   ├── useKeywordManagement.ts   # 키워드 관리 (React Hook Form 연동)
│   ├── useSeasonManagement.ts    # 계절 태그 관리
│   ├── useNetworkStatus.ts       # 네트워크 상태
│   ├── usePageTracking.ts        # 페이지 추적 (Analytics)
│   └── useDebounce.ts            # 디바운스 훅
├── store/                        # Zustand 상태 관리
│   ├── authStore.ts              # 인증 상태
│   ├── toastStore.ts             # 토스트 알림
│   └── loginModalStore.ts        # 로그인 모달
├── types/                        # TypeScript 타입 정의
│   ├── place.ts                  # 여행지 타입
│   ├── review.ts                 # 리뷰 타입
│   ├── contribute.ts             # 제안 폼 타입
│   └── auth.ts                   # 인증 타입
├── constants/                    # 상수 정의
│   ├── common.ts                 # 공통 상수
│   ├── messages.ts               # 에러/성공 메시지
│   ├── home.ts                   # 홈페이지 상수
│   └── review.ts                 # 리뷰 관련 상수
├── utils/                        # 유틸리티 함수
│   ├── analytics.ts              # Firebase Analytics
│   ├── performance.ts            # Firebase Performance
│   └── cn.ts                     # Tailwind 클래스 병합
└── lib/
    └── utils.ts                  # shadcn/ui 유틸리티
```

#### 🗄️ **Firebase Database Schema**
```typescript
// 📄 places/{placeId}
interface Place {
  id: string;                     // 문서 ID
  name: string;                   // 여행지 이름
  description?: string;           // 상세 설명
  imageUrls: string[];           // Firebase Storage URLs
  location: {                    // 위치 정보
    region: string;              // 지역 (서울, 부산, 도쿄 등)
    district?: string;           // 구/시 (강남구, 해운대구 등)
  };
  regionType: '국내' | '해외';    // 지역 타입
  seasonTags: string[];          // 계절 태그 ['봄', '여름', '가을', '겨울']
  budgetLevel: '저예산' | '중간' | '고급'; // 예산 수준
  keywords: string[];            // 검색 키워드 배열
  createdBy: string;             // 생성자 UID
  createdAt: Timestamp;          // 생성 시간
  stats: {                       // 통계 정보
    likes: number;               // 좋아요 수 (increment 사용)
    reviewCount: number;         // 리뷰 수 (increment 사용)
  };
}

// 📄 reviews/{reviewId}
interface Review {
  id: string;                    // 문서 ID
  placeId: string;              // 여행지 ID (외래키)
  content: string;              // 리뷰 내용
  userTags: string[];           // 사용자 정의 태그
  userId: string;               // 작성자 UID
  createdAt: Timestamp;         // 작성 시간
}

// 📄 users/{uid}
interface UserDoc {
  uid: string;                  // Firebase Auth UID
  displayName: string;          // 표시 이름
  email: string;               // 이메일
  provider: string;            // 인증 제공자 ('google', 'password')
  createdAt: Timestamp;        // 가입 시간
  wishlist: string[];          // 찜한 여행지 ID 배열
}
```

#### 🔧 **Custom Hooks Architecture (실제 구현)**
```typescript
// src/hooks/usePlaces.ts - React Query + Firebase 통합
export function usePlaces(
  options: GetPlacesOptions = {},
  queryOptions?: Partial<UseQueryOptions<PlaceCardData[], Error>>
) {
  return useQuery({
    queryKey: ['places', options],
    queryFn: () => getPlaces(options),
    staleTime: TIME.STALE_TIME_MEDIUM, // 5분
    gcTime: TIME.GC_TIME,              // 10분
    retry: RETRY.MAX_ATTEMPTS,         // 3회
    retryDelay: (attemptIndex) =>
      Math.min(1000 * RETRY.EXPONENTIAL_BASE ** attemptIndex, TIME.RETRY_DELAY_MAX),
    ...queryOptions,
  });
}

// src/hooks/useKeywordSuggestions.ts - 키워드 제안
export function useKeywordSuggestions(prefix: string, limit = 5) {
  return useQuery({
    queryKey: ['keywordSuggestions', prefix, limit],
    queryFn: () => fetchKeywordSuggestions(prefix, limit),
    staleTime: TIME.STALE_TIME_SHORT, // 2분
    gcTime: TIME.STALE_TIME_MEDIUM,   // 5분
    retry: RETRY.MAX_ATTEMPTS_SEARCH,
    enabled: !!prefix && prefix.length > 0,
  });
}

// src/hooks/useImageError.ts - 이미지 에러 처리
export function useImageError(fallbackSrc?: string) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const getSrc = useCallback((originalSrc: string) => {
    if (hasError && fallbackSrc) {
      return fallbackSrc;
    }
    return originalSrc;
  }, [hasError, fallbackSrc]);

  return { hasError, isLoading, handleError, handleLoad, getSrc, reset };
}

// src/hooks/useDebounce.ts - 디바운스 훅
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

#### 🏪 **State Management Pattern (실제 구현)**
```typescript
// src/store/authStore.ts - 실제 인증 스토어
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoad: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: false,
  error: null,
  setUser: user => set({ user }),
  setLoad: loading => set({ loading }),
  setError: error => set({ error }),
}));

// src/store/toastStore.ts - 실제 토스트 알림 스토어
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000, // 기본 5초
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // 자동 제거
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

// 편의 함수들
export const toast = {
  success: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'success', title, description });
  },
  error: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'error', title, description, duration: 7000 });
  },
  warning: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'warning', title, description });
  },
  info: (title: string, description?: string) => {
    useToastStore.getState().addToast({ type: 'info', title, description });
  },
};
```

## Scripts

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린팅
npm run lint

# 린팅 자동 수정 (실제 구현됨)
npm run lint:fix

# 코드 포맷팅 (실제 구현됨)
npm run format
```

## Information

### 📚 Project Documentation
- **SEO 최적화**: [docs/seo-optimization-metadata-jsonld.md](docs/seo-optimization-metadata-jsonld.md)
  - 메타데이터 표준화
  - JSON-LD 구조화 데이터 분석
  - 검색엔진 최적화 전략

- **Firebase 성능 분석**: [docs/firebase-performance-analysis.md](docs/firebase-performance-analysis.md)
  - Firestore 쿼리 최적화
  - Storage 사용량 분석
  - 복합 인덱스 요구사항
  - 확장성 고려사항

- **에러 처리 개선**: [docs/ERROR_HANDLING_UX_IMPROVEMENTS.md](docs/ERROR_HANDLING_UX_IMPROVEMENTS.md)
  - 포괄적 에러 처리 전략
  - 사용자 경험 개선 방안
  - 네트워크 상태 관리

### 🛠️ Development Guidelines
- **코드 스타일**: Prettier + ESLint 설정
- **컴포넌트 설계**: 재사용 가능한 컴포넌트 우선
- **상태 관리**: React Query (서버) + Zustand (클라이언트)
- **타입 안정성**: TypeScript strict 모드 적용

#### 💾 **Firebase Storage Integration**
```typescript
// 이미지 업로드 with 성능 추적
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { performanceTracking, stopTrace } from '@/utils/performance';

export function uploadPlaceImage(file: File, placeId: string): Promise<string> {
  const path = `places/${placeId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);

  // Firebase Performance 추적
  const trace = performanceTracking.trackImageUpload();

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      null, // progress callback
      (error) => {
        stopTrace(trace);
        toast.error('이미지 업로드 실패', '파일 크기나 형식을 확인하고 다시 시도해주세요.');
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(storageRef);
          stopTrace(trace);
          resolve(url);
        } catch (error) {
          stopTrace(trace);
          reject(error);
        }
      }
    );
  });
}

// 이미지 업로드 훅 with 미리보기
export function useImageUpload() {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > IMAGES.MAX_UPLOAD_COUNT) {
      toast.error('이미지 개수 초과', `최대 ${IMAGES.MAX_UPLOAD_COUNT}개까지 업로드 가능합니다.`);
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // 미리보기 URL 생성
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setImagePreviewUrls(prev => [...prev, url]);
    });
  };

  const resetImages = () => {
    // 메모리 누수 방지를 위한 URL 해제
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  return { selectedImages, imagePreviewUrls, handleImageChange, resetImages };
}
```

#### � **Analytics & Performance Monitoring**
```typescript
// Firebase Analytics 이벤트 추적
import { logEvent } from 'firebase/analytics';

export const searchAnalytics = {
  searchQuery: (keyword: string, resultCount: number, filters?: Record<string, string>) => {
    logEvent(analytics, 'search', {
      search_term: keyword,
      result_count: resultCount,
      ...filters,
    });
  },

  searchResultClick: (keyword: string, placeId: string, position: number) => {
    logEvent(analytics, 'select_content', {
      content_type: 'place',
      item_id: placeId,
      search_term: keyword,
      position: position,
    });
  }
};

// Firebase Performance 커스텀 추적
import { trace } from 'firebase/performance';

export const performanceTracking = {
  trackFirestoreQuery: (queryName: string) => {
    const customTrace = trace(perf, `firestore_${queryName}`);
    customTrace.start();
    return customTrace;
  },

  trackPageLoad: (pageName: string) => {
    const customTrace = trace(perf, `page_load_${pageName}`);
    customTrace.start();
    return customTrace;
  }
};
```

### �🚀 **Performance Optimizations**

#### 🖼️ **이미지 최적화 (구현됨)**
```typescript
// next.config.ts - Firebase Storage 이미지 최적화
const nextConfig: NextConfig = {
  poweredByHeader: false, // 보안 헤더 제거
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'], // 최신 포맷 우선
  },
};

// PlaceCard.tsx - 반응형 이미지 with 에러 처리
<Image
  src={getSrc(thumbnail || '/img/placeholder.png')}
  alt={name}
  fill
  className="object-cover transition-transform group-hover:scale-105"
  onError={handleError}
  onLoad={handleLoad}
  priority={position === 0} // 첫 번째 카드만 우선 로딩
  unoptimized // Firebase Storage 이미지는 unoptimized 사용
/>

// ImageGallery.tsx - 갤러리 이미지 최적화
<Image
  src={images[currentIndex]}
  alt={`${placeName} - ${currentIndex + 1}`}
  fill
  className="object-cover transition-transform duration-300 group-hover:scale-105"
  onError={() => handleImageError(currentIndex)}
  unoptimized
/>
```

#### 🗄️ **React Query 캐싱 전략 (구현됨)**
```typescript
// src/lib/react-query.tsx - 실제 캐싱 설정
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,        // 5분간 fresh
          gcTime: 10 * 60 * 1000,          // 10분간 캐시 유지
          retry: 3,                        // 3회 재시도
          refetchOnReconnect: true,        // 네트워크 재연결 시 refetch
          refetchOnWindowFocus: true,      // 윈도우 포커스 시 refetch
        },
      },
    })
  );
}

// 서버 사이드 QueryClient (SSR/SSG용)
export function createServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,                      // 서버에서는 항상 fresh
        gcTime: 0,                         // 서버에서는 캐시 없음
        retry: false,                      // 서버에서는 재시도 없음
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}
```

#### 📊 **Firebase Performance 모니터링 (실제 구현)**
```typescript
// src/utils/performance.ts - 실제 성능 추적 구현
import { perf } from '@/services/firebase';
import { trace } from 'firebase/performance';

// Performance 사용 가능 여부 확인
export const isPerformanceEnabled = (): boolean => {
  return perf !== null && typeof window !== 'undefined';
};

// 커스텀 추적 시작
export const startTrace = (traceName: string) => {
  if (!isPerformanceEnabled() || !perf) {
    if (process.env.NODE_ENV === 'development') console.warn('Firebase Performance not available');
    return null;
  }

  try {
    const customTrace = trace(perf, traceName);
    customTrace.start();
    return customTrace;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Failed to start trace:', error);
    return null;
  }
};

// 추적 종료
export const stopTrace = (traceInstance: { stop: () => void } | null) => {
  if (traceInstance) {
    try {
      traceInstance.stop();
    } catch (error) {
     if (process.env.NODE_ENV === 'development') console.error('Failed to stop trace:', error);
    }
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

// src/components/home/HomeClient.tsx - 실제 사용 예시
useEffect(() => {
  if (!loading) {
    // 메인 페이지 로딩 성능 추적
    const homePageTrace = performanceTracking.trackPageLoad('home');
    stopTrace(homePageTrace);
  }
}, [loading]);

// src/app/(public)/page.tsx - 서버 사이드 추적 예시
const homePageTrace = performanceTracking.trackPageLoad('home-server');
try {
  initialPlaces = await getPlaces({});
  stopTrace(homePageTrace);
} catch (error) {
  stopTrace(homePageTrace);
  initialPlaces = [];
}
```

#### 🔥 **Firebase 최적화 (구현됨)**
```typescript
// src/services/places.ts - 실제 Firestore 쿼리 구현
export async function getPlaces(options: GetPlacesOptions = {}): Promise<PlaceCardData[]> {
  const col = collection(db, 'places');
  let q: Query<Place> = col;

  // 키워드 필터링
  if (options.keyword) {
    q = query(q, where('keywords', 'array-contains', options.keyword));
  }

  // 지역 필터링
  if (options.region === 'domestic') {
    q = query(q, where('regionType', '==', '국내'));
  } else if (options.region === 'abroad') {
    q = query(q, where('regionType', '==', '해외'));
  }

  // 계절 필터링
  if (options.season) {
    q = query(q, where('seasonTags', 'array-contains', options.season));
  }

  // 예산 필터링
  if (options.budget) {
    q = query(q, where('budgetLevel', '==', options.budget));
  }

  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// 필요한 복합 인덱스 (Firebase Console에서 생성 필요)
/*
Collection: places
- (keywords, regionType) - Array, Ascending
- (keywords, seasonTags) - Array, Array
- (keywords, budgetLevel) - Array, Ascending
- (regionType, seasonTags) - Ascending, Array
*/
```


