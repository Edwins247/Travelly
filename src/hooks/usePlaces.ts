import { useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { getPlaces, getPlaceById, fetchKeywordSuggestions, getWishlistPlaces } from '@/services/places';
import type { GetPlacesOptions, PlaceCardData } from '@/types/place';

/**
 * 장소 목록을 가져오는 React Query 훅
 *
 * @param options - 검색 옵션 (키워드, 지역, 계절, 예산)
 * @param queryOptions - React Query 옵션 (선택사항)
 * @returns React Query 결과 객체
 */
export function usePlaces(
  options: GetPlacesOptions = {},
  queryOptions?: Partial<UseQueryOptions<PlaceCardData[], Error>>
) {
  return useQuery({
    queryKey: ['places', options],
    queryFn: () => getPlaces(options),
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    ...queryOptions, // 추가 옵션 병합
  });
}

/**
 * 특정 장소의 상세 정보를 가져오는 React Query 훅
 * 
 * @param placeId - 장소 ID
 * @returns React Query 결과 객체
 */
export function usePlace(placeId: string) {
  return useQuery({
    queryKey: ['place', placeId],
    queryFn: () => getPlaceById(placeId),
    staleTime: 10 * 60 * 1000, // 10분간 fresh 상태 유지 (상세 정보는 더 오래 캐시)
    gcTime: 30 * 60 * 1000, // 30분간 캐시 유지
    retry: 3,
    enabled: !!placeId, // placeId가 있을 때만 쿼리 실행
  });
}

/**
 * 키워드 제안을 가져오는 React Query 훅
 * 
 * @param prefix - 검색할 키워드 접두사
 * @param limit - 최대 결과 수 (기본값: 5)
 * @returns React Query 결과 객체
 */
export function useKeywordSuggestions(prefix: string, limit = 5) {
  return useQuery({
    queryKey: ['keywordSuggestions', prefix, limit],
    queryFn: () => fetchKeywordSuggestions(prefix, limit),
    staleTime: 2 * 60 * 1000, // 2분간 fresh 상태 유지 (검색 제안은 짧게)
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: 2, // 검색 제안은 실패해도 크게 문제없으므로 재시도 횟수 줄임
    enabled: !!prefix && prefix.length > 0, // prefix가 있을 때만 쿼리 실행
  });
}

/**
 * 위시리스트 장소들을 가져오는 React Query 훅
 * 
 * @param wishlistIds - 위시리스트 장소 ID 배열
 * @returns React Query 결과 객체
 */
export function useWishlistPlaces(wishlistIds: string[]) {
  return useQuery({
    queryKey: ['wishlistPlaces', wishlistIds],
    queryFn: () => getWishlistPlaces(wishlistIds),
    staleTime: 3 * 60 * 1000, // 3분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: 3,
    enabled: wishlistIds.length > 0, // 위시리스트가 있을 때만 쿼리 실행
  });
}

/**
 * React Query 캐시를 무효화하는 유틸리티 훅
 * 
 * @returns 캐시 무효화 함수들
 */
export function usePlacesCache() {
  const queryClient = useQueryClient();

  const invalidatePlaces = () => {
    queryClient.invalidateQueries({ queryKey: ['places'] });
  };

  const invalidatePlace = (placeId: string) => {
    queryClient.invalidateQueries({ queryKey: ['place', placeId] });
  };

  const invalidateWishlistPlaces = () => {
    queryClient.invalidateQueries({ queryKey: ['wishlistPlaces'] });
  };

  const invalidateKeywordSuggestions = () => {
    queryClient.invalidateQueries({ queryKey: ['keywordSuggestions'] });
  };

  return {
    invalidatePlaces,
    invalidatePlace,
    invalidateWishlistPlaces,
    invalidateKeywordSuggestions,
  };
}
